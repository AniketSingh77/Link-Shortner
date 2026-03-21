const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/payouts', require('./routes/payouts'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/v1', require('./routes/publicApi'));

// ========================================
// Redirection Gateway (Monetization Engine)
// ========================================
app.get('/:alias', async (req, res) => {
  if (req.params.alias === 'st' || req.params.alias === 'api') return; // Skip if it's a reserved prefix
  try {
    const Link = require('./models/Link');
    const Click = require('./models/Click');
    const User = require('./models/User');
    const CPM = require('./models/CPM');
    const geoip = require('geoip-lite');

    const link = await Link.findOne({ alias: req.params.alias, status: 'Active' });
    if (!link) return res.status(404).send('Link not found or has been hidden.');

    // --- GeoIP Detection ---
    let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    rawIp = rawIp.split(',')[0].trim();
    // Strip IPv6-mapped IPv4 prefix
    if (rawIp.startsWith('::ffff:')) rawIp = rawIp.substring(7);
    
    const geo = geoip.lookup(rawIp);
    const countryCode = geo ? geo.country : 'GLOBAL';
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';

    // --- CPM Lookup (country first, then GLOBAL fallback) ---
    let cpmData = await CPM.findOne({ countryCode });
    if (!cpmData) cpmData = await CPM.findOne({ countryCode: 'GLOBAL' });
    const rate = cpmData ? cpmData.rate : 5.0;
    const clickEarning = rate / 1000;

    // --- Detect Device & Browser ---
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const device = isMobile ? 'Mobile' : 'Desktop';
    let browser = 'Unknown';
    if (/Chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent)) browser = 'Safari';
    else if (/Edge/i.test(userAgent)) browser = 'Edge';
    else if (/Opera|OPR/i.test(userAgent)) browser = 'Opera';

    // --- IP-based Duplicate View Check (24 Hours) ---
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingClick = await Click.findOne({
      linkId: link._id,
      ip: rawIp,
      timestamp: { $gte: twentyFourHoursAgo }
    });

    const isDuplicate = !!existingClick;

    if (!isDuplicate) {
      // --- Log Click ---
      const newClick = new Click({
        linkId: link._id,
        userId: link.userId,
        ip: rawIp,
        country: countryCode,
        device,
        browser,
        referrer,
        earning: clickEarning
      });
      await newClick.save();

      // --- Credit Publisher ---
      await User.findByIdAndUpdate(link.userId, {
        $inc: { balance: clickEarning, totalEarnings: clickEarning }
      });
      await Link.findByIdAndUpdate(link._id, {
        $inc: { clicks: 1, earnings: clickEarning }
      });

      // --- Referral Commission (20%) ---
      const publisher = await User.findById(link.userId);
      if (publisher && publisher.referredBy) {
        const referralBonus = clickEarning * 0.20;
        await User.findByIdAndUpdate(publisher.referredBy, {
          $inc: { balance: referralBonus, referralEarnings: referralBonus, totalEarnings: referralBonus }
        });
      }
    } else {
        // Just log the duplicate hit without adding money
        await Link.findByIdAndUpdate(link._id, {
            $inc: { clicks: 1 } // Optionally count raw clicks separately or skip
        });
        console.log(`Duplicate click suppressed for IP ${rawIp} on link ${link.alias}`);
    }

    // --- Redirect to Ad Gateway ---
    const frontendUrl = process.env.FRONTEND_URL || 'https://shortner.wallgo.in';
    res.redirect(`${frontendUrl}/v/${link.alias}`);
  } catch (err) {
    console.error('Redirect Gateway Error:', err);
    res.status(500).send('Server Error');
  }
});

// ========================================
// Quick Link (Instant Redirect via API Token)
// ========================================
app.get('/st', async (req, res) => {
  try {
    const { api: apiToken, url } = req.query;
    if (!apiToken || !url) return res.status(400).send('Missing api token or url');

    const User = require('./models/User');
    const Link = require('./models/Link');
    const { nanoid } = require('nanoid');

    const user = await User.findOne({ apiToken });
    if (!user) return res.status(401).send('Invalid API token');

    // Create the link on-the-fly
    const alias = nanoid(6);
    const newLink = new Link({
      userId: user._id,
      originalUrl: url,
      alias,
      title: url
    });
    await newLink.save();

    // Redirect to the monetized gateway
    res.redirect(`${req.protocol}://${req.get('host')}/st/${alias}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ========================================
// Startup
// ========================================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // --- Seed Default CPM Rates ---
    const CPM = require('./models/CPM');
    const count = await CPM.countDocuments();
    if (count === 0) {
      const defaultRates = [
        { countryCode: 'GLOBAL', countryName: 'Global (Default)', rate: 5.0 },
        { countryCode: 'US', countryName: 'United States', rate: 12.0 },
        { countryCode: 'GB', countryName: 'United Kingdom', rate: 10.0 },
        { countryCode: 'CA', countryName: 'Canada', rate: 9.0 },
        { countryCode: 'AU', countryName: 'Australia', rate: 8.0 },
        { countryCode: 'DE', countryName: 'Germany', rate: 7.0 },
        { countryCode: 'FR', countryName: 'France', rate: 6.5 },
        { countryCode: 'IN', countryName: 'India', rate: 3.5 },
        { countryCode: 'BD', countryName: 'Bangladesh', rate: 2.5 },
        { countryCode: 'PK', countryName: 'Pakistan', rate: 2.5 },
        { countryCode: 'BR', countryName: 'Brazil', rate: 4.0 },
        { countryCode: 'NG', countryName: 'Nigeria', rate: 3.0 },
        { countryCode: 'EG', countryName: 'Egypt', rate: 3.0 },
        { countryCode: 'ID', countryName: 'Indonesia', rate: 3.0 },
        { countryCode: 'PH', countryName: 'Philippines', rate: 3.0 },
        { countryCode: 'TR', countryName: 'Turkey', rate: 4.0 },
        { countryCode: 'SA', countryName: 'Saudi Arabia', rate: 6.0 },
        { countryCode: 'AE', countryName: 'UAE', rate: 7.0 },
        { countryCode: 'JP', countryName: 'Japan', rate: 8.0 },
        { countryCode: 'KR', countryName: 'South Korea', rate: 7.0 }
      ];
      await CPM.insertMany(defaultRates);
      console.log('✅ Seeded 20 default CPM country rates');
    }

    // --- Seed Default Pages ---
    const Page = require('./models/Page');
    const pageCount = await Page.countDocuments();
    if (pageCount === 0) {
      const defaultPages = [
        { slug: 'faq', title: 'FAQ', content: '## Frequently Asked Questions\n\n### What Is Wallgo Links?\nWallgo Links is a URL shortener that pays you for every visitor who clicks your shortened links.\n\n### How To Earn Money?\n1. Create an account\n2. Shorten your links\n3. Share them on social media, blogs, or websites\n4. Earn money for every click!\n\n### What Is The Minimum Withdrawal?\nThe minimum withdrawal amount is $5.00.\n\n### Which Payment Methods Are Available?\nWe support UPI, PayPal, PhonePe, and Bank Transfer.\n\n### Why Was My Account Disabled?\nAccounts are disabled for violating our terms: bot traffic, self-clicking, or illegal content.' },
        { slug: 'privacy', title: 'Privacy Policy', content: '## Privacy Policy\n\nYour privacy is important to us. We collect only the information necessary to provide our services.\n\n### Information We Collect\n- Account information (name, email)\n- Link click data (IP, country, device)\n- Payment details for withdrawals\n\n### How We Use It\n- To track clicks and calculate earnings\n- To process withdrawal requests\n- To prevent fraud and abuse\n\nWe never sell your personal data to third parties.' },
        { slug: 'terms', title: 'Terms of Use', content: '## Terms of Use\n\nBy using Wallgo Links, you agree to these terms.\n\n### Prohibited Activities\n- Bot or automated traffic\n- Self-clicking your own links\n- Sharing illegal or harmful content\n- Using multiple accounts\n- VPN/Proxy traffic generation\n\n### Account Termination\nWe reserve the right to terminate accounts that violate these terms without prior notice.' },
        { slug: 'dmca', title: 'DMCA', content: '## DMCA Policy\n\nWe respect intellectual property rights. If you believe any content linked through our service infringes your copyright, please contact us with:\n- Your contact information\n- The infringing URL\n- Proof of ownership\n\nEmail: contact@wallgolinks.com' },
        { slug: 'contact-us', title: 'Contact Us', content: '## Contact Us\n\nHave a question or need support?\n\n**Email:** contact@wallgolinks.com\n**Telegram:** @wallgolinks\n\nWe typically respond within 24 hours.' },
        { slug: 'payment-policy', title: 'Payment Policy', content: '## Payment Policy\n\n### Minimum Payout\n- UPI: $2.00\n- PayPal: $5.00\n- Bank Transfer: $10.00\n\n### Payment Schedule\nPayments are processed within 3-5 business days after request.\n\n### Invalid Traffic\nEarnings from bot, VPN, or self-click traffic will be deducted.' },
        { slug: 'report', title: 'Report', content: '## Report A Link\n\nIf you encounter a shortened link that contains harmful or illegal content, please report it to us.\n\nEmail: report@wallgolinks.com\n\nInclude the full shortened URL and a description of the issue.' }
      ];
      await Page.insertMany(defaultPages);
      console.log('✅ Seeded 7 default static pages');
    }

    // --- Seed Default Settings ---
    const Settings = require('./models/Settings');
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        key: 'ad_config',
        value: {
          steps: 3,
          timer: 15,
          smartlink: 'https://www.highperformanceformat.com/f9be6e7c7a5f4f899c64e5c5a5a5a5a5', // Placeholder smartlink
          backgroundSites: ['https://www.pastex.online/'],
          adBannerIds: {
            top: 'fc4c80a53247a4cd577428a7e29741d0',
            sidebar: '3334f040539d82d83a45dcee7b1e54f2',
            content: '3334f040539d82d83a45dcee7b1e54f2'
          },
          adCodes: {
            top: '',
            sidebar: '',
            content: '',
            popunder: '',
            socialBar: ''
          }
        },
        description: 'Global configuration for Redirect/Bridge page and Ad units'
      });
      console.log('✅ Seeded default ad_config settings with 3 steps');
    }

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
