const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Financial
  balance: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  referralEarnings: { type: Number, default: 0 },
  
  // Role & Status
  role: { type: String, enum: ['User', 'Admin'], default: 'User' },
  status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
  
  // Profile
  gender: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  country: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  
  // Payment
  paymentMethod: { type: String, default: 'UPI' },
  paymentAccount: { type: String, default: '' },
  
  // API & Referral
  apiToken: { type: String, unique: true, default: () => uuidv4().replace(/-/g, '') },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
