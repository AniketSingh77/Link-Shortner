const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Complete', 'Cancelled'],
    default: 'Pending'
  },
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payout', PayoutSchema);
