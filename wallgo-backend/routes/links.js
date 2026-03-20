const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Link = require('../models/Link');
const Click = require('../models/Click');
const auth = require('../middleware/auth');

// @route   POST api/links/shorten
// @desc    Shorten a URL
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, alias, title, pageType, trafficSource } = req.body;
  try {
    const linkAlias = alias || nanoid(6);
    
    let existing = await Link.findOne({ alias: linkAlias });
    if (existing) return res.status(400).json({ msg: 'Alias already in use' });

    const newLink = new Link({
      userId: req.user.id,
      originalUrl,
      alias: linkAlias,
      title: title || originalUrl,
      pageType: pageType || 'Interstitial',
      trafficSource: trafficSource || ''
    });

    await newLink.save();
    res.json(newLink);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/links/bulk
// @desc    Bulk shorten multiple URLs
router.post('/bulk', auth, async (req, res) => {
  const { urls } = req.body; // Array of { url, alias?, title? }
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ msg: 'Please provide an array of URLs' });
  }
  if (urls.length > 100) {
    return res.status(400).json({ msg: 'Maximum 100 URLs per request' });
  }

  try {
    const results = [];
    for (const item of urls) {
      const linkAlias = item.alias || nanoid(6);
      let existing = await Link.findOne({ alias: linkAlias });
      if (existing) {
        results.push({ url: item.url, error: 'Alias already in use', alias: linkAlias });
        continue;
      }
      const newLink = new Link({
        userId: req.user.id,
        originalUrl: item.url,
        alias: linkAlias,
        title: item.title || item.url
      });
      await newLink.save();
      results.push({ url: item.url, alias: linkAlias, shortUrl: `/st/${linkAlias}` });
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/links/user
// @desc    Get user links (with optional filters)
router.get('/user', auth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user.id };
    
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { alias: { $regex: search, $options: 'i' } },
        { originalUrl: { $regex: search, $options: 'i' } }
      ];
    }

    const links = await Link.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Link.countDocuments(filter);
    
    res.json({ links, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/links/:id
// @desc    Edit a link
router.put('/:id', auth, async (req, res) => {
  const { title, alias, pageType, trafficSource } = req.body;
  try {
    let link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ msg: 'Link not found' });
    if (link.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // If alias changed, check uniqueness
    if (alias && alias !== link.alias) {
      const existing = await Link.findOne({ alias });
      if (existing) return res.status(400).json({ msg: 'Alias already in use' });
      link.alias = alias;
    }
    if (title) link.title = title;
    if (pageType) link.pageType = pageType;
    if (trafficSource !== undefined) link.trafficSource = trafficSource;

    await link.save();
    res.json(link);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/links/:id/hide
// @desc    Toggle link visibility (Hide/Unhide)
router.put('/:id/hide', auth, async (req, res) => {
  try {
    let link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ msg: 'Link not found' });
    if (link.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    link.status = link.status === 'Active' ? 'Hidden' : 'Active';
    await link.save();
    res.json(link);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/links/:id
// @desc    Delete a link permanently
router.delete('/:id', auth, async (req, res) => {
  try {
    let link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ msg: 'Link not found' });
    if (link.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Link.findByIdAndDelete(req.params.id);
    // Also delete associated clicks
    await Click.deleteMany({ linkId: req.params.id });
    res.json({ msg: 'Link deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   GET api/links/:id/stats
// @desc    Get per-link statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ msg: 'Link not found' });
    if (link.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // Country breakdown
    const byCountry = await Click.aggregate([
      { $match: { linkId: link._id } },
      { $group: { _id: '$country', clicks: { $sum: 1 }, earnings: { $sum: '$earning' } } },
      { $sort: { clicks: -1 } },
      { $limit: 20 }
    ]);

    // Device breakdown
    const byDevice = await Click.aggregate([
      { $match: { linkId: link._id } },
      { $group: { _id: '$device', clicks: { $sum: 1 } } }
    ]);

    // Referrer breakdown
    const byReferrer = await Click.aggregate([
      { $match: { linkId: link._id } },
      { $group: { _id: '$referrer', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 }
    ]);

    // Last 7 days trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const nextD = new Date(d); nextD.setDate(d.getDate() + 1);
      const count = await Click.countDocuments({ linkId: link._id, timestamp: { $gte: d, $lt: nextD } });
      last7Days.push({ name: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }), views: count });
    }

    res.json({
      link,
      totalClicks: link.clicks,
      totalEarnings: link.earnings.toFixed(4),
      byCountry,
      byDevice,
      byReferrer,
      chartData: last7Days
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/links/resolve/:alias
// @desc    Get the original URL for a given alias (Public)
router.get('/resolve/:alias', async (req, res) => {
  try {
    const link = await Link.findOne({ alias: req.params.alias, status: 'Active' });
    if (!link) return res.status(404).json({ msg: 'Link not found' });
    res.json({ originalUrl: link.originalUrl });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/links/details/:alias
// @desc    Get link details (title, etc.) for bridge page
router.get('/details/:alias', async (req, res) => {
  try {
    const link = await Link.findOne({ alias: req.params.alias, status: 'Active' });
    if (!link) return res.status(404).json({ msg: 'Link not found' });
    res.json({ 
        title: link.title, 
        alias: link.alias,
        createdAt: link.createdAt
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
