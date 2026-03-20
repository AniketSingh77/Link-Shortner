const express = require('express');
const router = express.Router();
const Payout = require('../models/Payout');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/payouts/request
// @desc    Request a withdrawal
router.post('/request', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { method, account } = req.body;

    const paymentMethod = method || user.paymentMethod;
    const paymentAccount = account || user.paymentAccount;

    if (!paymentAccount) {
      return res.status(400).json({ msg: 'Please set your payment account in Settings first.' });
    }

    if (user.balance < 5) {
      return res.status(400).json({ msg: 'Minimum withdrawal is $5.00' });
    }

    const amount = user.balance;

    const newPayout = new Payout({
      userId: req.user.id,
      amount,
      method: paymentMethod,
      account: paymentAccount
    });

    await newPayout.save();

    // Deduct from balance
    user.balance = 0;
    await user.save();

    res.json(newPayout);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payouts/history
// @desc    Get user payout history
router.get('/history', auth, async (req, res) => {
  try {
    const payouts = await Payout.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    const totalPaid = payouts
      .filter(p => p.status === 'Complete')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pending = payouts
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({ payouts, totalPaid, pending });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
