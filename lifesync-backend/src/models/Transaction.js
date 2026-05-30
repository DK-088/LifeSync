const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    upiApp: {
      type: String,
      enum: ['PhonePe', 'GPay', 'Paytm', 'BHIM', 'AmazonPay', 'WhatsApp Pay', 'Others', null],
      default: null,
    },
    merchant: { type: String, trim: true, default: 'Unknown' },
    notificationText: {
      type: String,
      trim: true,
      get: (val) => val ? decrypt(val) : null,
      set: (val) => val ? encrypt(val) : null,
    },
    category: { type: String, default: 'Others' },
    transactionType: {
      type: String,
      enum: ['debit', 'credit'],
      required: true,
    },
    upiId: {
      type: String,
      trim: true,
      default: null,
      get: (val) => val ? decrypt(val) : null,
      set: (val) => val ? encrypt(val) : null,
    },
    referenceId: {
      type: String,
      trim: true,
      default: null,
      get: (val) => val ? decrypt(val) : null,
      set: (val) => val ? encrypt(val) : null,
    },
    bankName: { type: String, trim: true, default: null },
    timestamp: { type: Date, default: Date.now },
    isProcessed: { type: Boolean, default: false },
    linkedExpenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ userId: 1, transactionType: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
