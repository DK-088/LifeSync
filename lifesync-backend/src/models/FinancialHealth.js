const mongoose = require('mongoose');

const financialHealthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'],
    },
    savingsRate: { type: Number, default: 0 },
    emiRatio: { type: Number, default: 0 },
    debtRatio: { type: Number, default: 0 },
    spendingRatio: { type: Number, default: 0 },
    investmentRatio: { type: Number, default: 0 },
    insights: [{ type: String }],
    recommendations: [{ type: String }],
    generatedAt: { type: Date, default: Date.now },
    period: {
      month: { type: Number },
      year: { type: Number },
    },
  },
  { timestamps: true }
);

financialHealthSchema.index({ userId: 1, generatedAt: -1 });

module.exports = mongoose.model('FinancialHealth', financialHealthSchema);
