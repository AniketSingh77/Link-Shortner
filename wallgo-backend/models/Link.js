const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  alias: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  clicks: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  pageType: { type: String, enum: ['Interstitial', 'Banner', 'No Ad'], default: 'Interstitial' },
  status: { type: String, enum: ['Active', 'Hidden'], default: 'Active' },
  trafficSource: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Link', LinkSchema);
