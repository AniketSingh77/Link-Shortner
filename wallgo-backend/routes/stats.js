const express = require('express');
const router = express.Router();
const Click = require('../models/Click');
const Link = require('../models/Link');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/stats/dashboard
// @desc    Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    const totalViews = await Click.countDocuments({ userId });
    const totalLinks = await Link.countDocuments({ userId });

    // Stats for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const nextD = new Date(d); nextD.setDate(d.getDate() + 1);
      const count = await Click.countDocuments({ userId, timestamp: { $gte: d, $lt: nextD } });
      last7Days.push({
        name: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        views: count
      });
    }

    res.json({
      totalViews,
      totalEarnings: user.totalEarnings.toFixed(4),
      referralEarnings: user.referralEarnings.toFixed(4),
      balance: user.balance.toFixed(4),
      averageCPM: totalViews > 0 ? ((user.totalEarnings / totalViews) * 1000).toFixed(2) : "0.00",
      totalLinks,
      chartData: last7Days
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/stats/traffic
// @desc    Get traffic source analytics (country, device, referrer breakdown)
router.get('/traffic', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Country Breakdown
    const byCountry = await Click.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
      { $group: { _id: '$country', clicks: { $sum: 1 }, earnings: { $sum: '$earning' } } },
      { $sort: { clicks: -1 } },
      { $limit: 30 }
    ]);

    // Device Breakdown
    const byDevice = await Click.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
      { $group: { _id: '$device', clicks: { $sum: 1 } } }
    ]);

    // Browser Breakdown
    const byBrowser = await Click.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
      { $group: { _id: '$browser', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } }
    ]);

    // Top Referrers
    const byReferrer = await Click.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
      { $group: { _id: '$referrer', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 15 }
    ]);

    // Last 30 days daily trend
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const nextD = new Date(d); nextD.setDate(d.getDate() + 1);
      const count = await Click.countDocuments({ userId, timestamp: { $gte: d, $lt: nextD } });
      last30Days.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        views: count
      });
    }

    res.json({ byCountry, byDevice, byBrowser, byReferrer, last30Days });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
