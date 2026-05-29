const mongoose = require('mongoose');

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
    notificationText: { type: String, trim: true },
    category: { type: String, default: 'Others' },
    transactionType: {
      type: String,
      enum: ['debit', 'credit'],
      required: true,
    },
    upiId: { type: String, trim: true, default: null },
    referenceId: { type: String, trim: true, default: null },
    bankName: { type: String, trim: true, default: null },
    timestamp: { type: Date, default: Date.now },
    isProcessed: { type: Boolean, default: false },
    linkedExpenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      default: null,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, timestamp: -1 });
transactionSchema.index({ userId: 1, transactionType: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
