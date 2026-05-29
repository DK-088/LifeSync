const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Food & Dining',
        'Transport',
        'Shopping',
        'Entertainment',
        'Health & Medical',
        'Utilities',
        'Education',
        'Travel',
        'Groceries',
        'Rent',
        'EMI',
        'Investment',
        'Insurance',
        'Subscriptions',
        'Personal Care',
        'Others',
      ],
      default: 'Others',
    },
    merchant: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    paymentType: {
      type: String,
      enum: ['UPI', 'Cash', 'Card', 'Net Banking', 'Wallet', 'Others'],
      default: 'UPI',
    },
    source: {
      type: String,
      enum: ['manual', 'notification', 'voice', 'ocr', 'ai'],
      default: 'manual',
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    tags: [{ type: String, trim: true }],
    receiptImage: { type: String, default: null },
    isRecurring: { type: Boolean, default: false },
    recurringFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', null],
      default: null,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, createdAt: -1 });
expenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
