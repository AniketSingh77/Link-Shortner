const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Page', PageSchema);
