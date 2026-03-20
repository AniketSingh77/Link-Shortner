const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../middleware/auth');
const User = require('../models/User');

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
    const user = await User.findById(req.user.id);
    if (user.role !== 'Admin') return res.status(403).json({ msg: 'Admin only' });

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
