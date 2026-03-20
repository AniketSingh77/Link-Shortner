const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Settings = require('../models/Settings');

// @route   GET api/pages/settings/ad-config
// @desc    Get ad-config (public)
router.get('/settings/ad-config', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'ad_config' });
    if (!setting) return res.json({ value: { steps: 2, timer: 15, backgroundSites: ['https://www.pastex.online/'], adBannerIds: { top: 'fc4c80a53247a4cd577428a7e29741d0', sidebar: '3334f040539d82d83a45dcee7b1e54f2', content: '3334f040539d82d83a45dcee7b1e54f2' } } });
    res.json(setting);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/pages/:slug
// @desc    Get a static page by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug.toLowerCase() });
    if (!page) return res.status(404).json({ msg: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/pages/:slug
// @desc    Update a static page (Admin only)
router.put('/:slug', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ msg: 'No auth' });
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Admin') return res.status(403).json({ msg: 'Admin only' });

    const { title, content } = req.body;
    const page = await Page.findOneAndUpdate(
      { slug: req.params.slug.toLowerCase() },
      { $set: { title, content, updatedAt: Date.now() } },
      { new: true, upsert: true }
    );
    res.json(page);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
