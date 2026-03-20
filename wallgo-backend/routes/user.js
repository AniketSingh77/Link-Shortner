const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// @route   GET api/user/profile
// @desc    Get current user's full profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/user/profile
// @desc    Update user profile details
router.put('/profile', auth, async (req, res) => {
  const { name, gender, address, city, state, pincode, country, whatsapp } = req.body;
  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (gender !== undefined) updateFields.gender = gender;
    if (address !== undefined) updateFields.address = address;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (pincode !== undefined) updateFields.pincode = pincode;
    if (country !== undefined) updateFields.country = country;
    if (whatsapp !== undefined) updateFields.whatsapp = whatsapp;

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updateFields }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/user/password
// @desc    Change password
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save(); // pre-save hook will hash it
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/user/payment
// @desc    Update payment method and account
router.put('/payment', auth, async (req, res) => {
  const { paymentMethod, paymentAccount } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { paymentMethod, paymentAccount } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
