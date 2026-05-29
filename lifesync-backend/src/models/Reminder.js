const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Reminder title is required'],
      trim: true,
      maxlength: 100,
    },
    description: { type: String, trim: true, maxlength: 300 },
    reminderDate: {
      type: Date,
      required: [true, 'Reminder date is required'],
    },
    type: {
      type: String,
      enum: ['bill', 'emi', 'subscription', 'savings', 'custom', 'investment'],
      default: 'custom',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    isRecurring: { type: Boolean, default: false },
    recurringInterval: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', null],
      default: null,
    },
    amount: { type: Number, default: null },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reminderSchema.index({ userId: 1, reminderDate: 1 });
reminderSchema.index({ userId: 1, completed: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
