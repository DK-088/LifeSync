const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    amount: { type: Number, required: true, min: 0.01 },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'half-yearly', 'yearly'],
      default: 'monthly',
    },
    nextBillingDate: { type: Date, required: true },
    category: {
      type: String,
      enum: ['streaming', 'music', 'gaming', 'software', 'news', 'fitness', 'cloud', 'others'],
      default: 'others',
    },
    isActive: { type: Boolean, default: true },
    reminderDaysBefore: { type: Number, default: 3 },
    autoDetected: { type: Boolean, default: false },
    logo: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
