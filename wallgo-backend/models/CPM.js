const mongoose = require('mongoose');

const CPMSchema = new mongoose.Schema({
  countryCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  countryName: String,
  rate: {
    type: Number,
    required: true,
    default: 5.0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CPM', CPMSchema);
