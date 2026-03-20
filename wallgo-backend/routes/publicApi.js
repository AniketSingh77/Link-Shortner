const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Link = require('../models/Link');
const User = require('../models/User');

// @route   GET api/v1/shorten
// @desc    Public Developer API — shorten a URL using API token
// Usage:   GET /api/v1/shorten?api=YOUR_TOKEN&url=DESTINATION&alias=CUSTOM&format=text
router.get('/shorten', async (req, res) => {
  const { api: apiToken, url, alias, format } = req.query;

  if (!apiToken || !url) {
    if (format === 'text') return res.send('Error: Missing api or url parameter');
    return res.json({ status: 'error', message: 'Missing api or url parameter' });
  }

  try {
    const user = await User.findOne({ apiToken });
    if (!user) {
      if (format === 'text') return res.send('Error: Invalid API token');
      return res.json({ status: 'error', message: 'Invalid API token' });
    }
    if (user.status === 'Blocked') {
      if (format === 'text') return res.send('Error: Account is blocked');
      return res.json({ status: 'error', message: 'Account is blocked' });
    }

    const linkAlias = alias || nanoid(6);

    // Check alias uniqueness
    const existing = await Link.findOne({ alias: linkAlias });
    if (existing) {
      if (format === 'text') return res.send('Error: Alias already in use');
      return res.json({ status: 'error', message: 'Alias already in use' });
    }

    const newLink = new Link({
      userId: user._id,
      originalUrl: url,
      alias: linkAlias,
      title: url
    });
    await newLink.save();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const shortenedUrl = `${baseUrl}/st/${linkAlias}`;

    if (format === 'text') return res.send(shortenedUrl);
    return res.json({
      status: 'success',
      shortenedUrl,
      alias: linkAlias,
      originalUrl: url
    });
  } catch (err) {
    console.error(err);
    if (format === 'text') return res.send('Error: Server error');
    return res.json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
