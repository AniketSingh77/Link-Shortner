const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ip: String,
  country: {
    type: String,
    default: 'Unknown'
  },
  device: String,
  browser: String,
  referrer: String,
  earning: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Click', ClickSchema);
