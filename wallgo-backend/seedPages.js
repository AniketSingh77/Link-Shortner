import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const Page = mongoose.models.Page || mongoose.model('Page', new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  content: String,
  updatedAt: { type: Date, default: Date.now }
}));

const pages = [
  {
    title: 'FAQ',
    slug: 'faq',
    content: '<h2>Frequently Asked Questions</h2><p>Our link shortener allows you to earn money for every visit to your links. It is a simple tool to monetize your traffic.</p>'
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    content: '<h2>Privacy Policy</h2><p>This privacy policy describes how we handle your personal data. We take your privacy seriously and take all measures to protect your personal information.</p>'
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms',
    content: '<h2>Terms & Conditions</h2><p>By using our website, you agree to these terms and conditions. If you do not agree, please do not use our service.</p>'
  },
  {
    title: 'DMCA',
    slug: 'dmca',
    content: '<h2>DMCA Policy</h2><p>We respect intellectual property rights. If you believe your content has been infringed, please contact us with the required information.</p>'
  },
  {
    title: 'Payment Policy',
    slug: 'payment-policy',
    content: '<h2>Payment Policy</h2><p>We process payments every week. Minimum withdrawal is $5.00 via PayPal, Payeer, or UPI.</p>'
  }
];

async function seedPages() {
  try {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI not found in .env');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const page of pages) {
      await Page.findOneAndUpdate(
        { slug: page.slug },
        page,
        { upsert: true, new: true }
      );
      console.log(`Seeded page: ${page.title}`);
    }

    console.log('All static pages seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding pages:', err);
    process.exit(1);
  }
}

seedPages();
