const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Link = require('../models/Link');
const Click = require('../models/Click');
const Payout = require('../models/Payout');
const CPM = require('../models/CPM');
const auth = require('../middleware/auth');

// Middleware: Admin only
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admin only.' });
  }
  next();
};

// @route   GET api/admin/stats
// @desc    Get overall platform stats
router.get('/stats', [auth, isAdmin], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLinks = await Link.countDocuments();
    const clickAgg = await Click.aggregate([{ $group: { _id: null, total: { $sum: 1 }, earnings: { $sum: '$earning' } } }]);
    const payoutAgg = await Payout.aggregate([{ $match: { status: 'Complete' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    const pendingPayouts = await Payout.countDocuments({ status: 'Pending' });

    res.json({
      totalUsers,
      totalLinks,
      totalClicks: clickAgg[0]?.total || 0,
      totalEarnings: (clickAgg[0]?.earnings || 0).toFixed(4),
      totalPayouts: (payoutAgg[0]?.total || 0).toFixed(4),
      pendingPayouts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/users
// @desc    List all users with stats
router.get('/users', [auth, isAdmin], async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);
    
    // Enrich with link count for each user
    const enriched = await Promise.all(users.map(async (u) => {
      const linkCount = await Link.countDocuments({ userId: u._id });
      const clickCount = await Click.countDocuments({ userId: u._id });
      return { ...u.toObject(), linkCount, clickCount };
    }));

    res.json({ users: enriched, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/users/:id/block
// @desc    Block a user
router.post('/users/:id/block', [auth, isAdmin], async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'Blocked' });
    res.json({ msg: 'User blocked' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/users/:id/unblock
// @desc    Unblock a user
router.post('/users/:id/unblock', [auth, isAdmin], async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: 'Active' });
    res.json({ msg: 'User unblocked' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/users/:id/role
// @desc    Change user role
router.put('/users/:id/role', [auth, isAdmin], async (req, res) => {
  try {
    const { role } = req.body;
    if (!['User', 'Admin'].includes(role)) return res.status(400).json({ msg: 'Invalid role' });
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ msg: `Role changed to ${role}` });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/cpm
// @desc    Get all CPM rates
router.get('/cpm', [auth, isAdmin], async (req, res) => {
  try {
    const rates = await CPM.find().sort({ countryName: 1 });
    res.json(rates);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/cpm
// @desc    Create/Update CPM rate
router.post('/cpm', [auth, isAdmin], async (req, res) => {
  const { countryCode, countryName, rate } = req.body;
  try {
    let cpm = await CPM.findOne({ countryCode: countryCode.toUpperCase() });
    if (cpm) {
      cpm.rate = rate;
      if (countryName) cpm.countryName = countryName;
      cpm.updatedAt = Date.now();
    } else {
      cpm = new CPM({ countryCode: countryCode.toUpperCase(), countryName: countryName || countryCode, rate });
    }
    await cpm.save();
    res.json(cpm);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/cpm/:id
// @desc    Delete a CPM rate
router.delete('/cpm/:id', [auth, isAdmin], async (req, res) => {
  try {
    await CPM.findByIdAndDelete(req.params.id);
    res.json({ msg: 'CPM rate deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/payouts
// @desc    Get all payouts (with pagination)
router.get('/payouts', [auth, isAdmin], async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const payouts = await Payout.find(filter)
      .populate('userId', 'name email paymentMethod paymentAccount')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payout.countDocuments(filter);
    res.json({ payouts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/payouts/approve/:id
// @desc    Approve/Complete a payout
router.post('/payouts/approve/:id', [auth, isAdmin], async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ msg: 'Payout not found' });
    payout.status = 'Complete';
    payout.remarks = req.body.remarks || 'Approved by admin';
    await payout.save();
    res.json(payout);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/payouts/reject/:id
// @desc    Reject a payout and refund balance
router.post('/payouts/reject/:id', [auth, isAdmin], async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ msg: 'Payout not found' });
    
    // Refund
    await User.findByIdAndUpdate(payout.userId, { $inc: { balance: payout.amount } });
    payout.status = 'Cancelled';
    payout.remarks = req.body.remarks || 'Rejected by admin';
    await payout.save();
    res.json(payout);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

const Settings = require('../models/Settings');

// @route   GET api/admin/settings
// @desc    Get all settings
router.get('/settings', [auth, isAdmin], async (req, res) => {
  try {
    const settings = await Settings.find();
    res.json(settings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/settings
// @desc    Update/Create a setting
router.post('/settings', [auth, isAdmin], async (req, res) => {
  const { key, value } = req.body;
  try {
    let setting = await Settings.findOne({ key });
    if (setting) {
      setting.value = value;
      setting.updatedAt = Date.now();
    } else {
      setting = new Settings({ key, value });
    }
    await setting.save();
    res.json(setting);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
