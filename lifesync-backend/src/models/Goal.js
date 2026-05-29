const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: 100,
    },
    description: { type: String, trim: true, maxlength: 300 },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: 1,
    },
    currentAmount: { type: Number, default: 0, min: 0 },
    targetDate: { type: Date, required: true },
    category: {
      type: String,
      enum: ['emergency_fund', 'travel', 'education', 'vehicle', 'home', 'retirement', 'wedding', 'gadget', 'custom'],
      default: 'custom',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'cancelled'],
      default: 'active',
    },
    monthlyContribution: { type: Number, default: 0 },
    aiSuggestedContribution: { type: Number, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

goalSchema.virtual('progressPercent').get(function () {
  return this.targetAmount > 0
    ? Math.min(100, ((this.currentAmount / this.targetAmount) * 100).toFixed(2))
    : 0;
});

goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Goal', goalSchema);
