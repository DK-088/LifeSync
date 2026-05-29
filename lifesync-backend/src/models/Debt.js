const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
      maxlength: 50,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0.01,
    },
    type: {
      type: String,
      enum: ['lent', 'borrowed'],
      required: true,
    },
    dueDate: { type: Date, default: null },
    description: { type: String, trim: true, maxlength: 200 },
    paidStatus: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    paidAmount: { type: Number, default: 0 },
    contact: { type: String, trim: true, default: null },
    interestRate: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

debtSchema.index({ userId: 1, paidStatus: 1 });

module.exports = mongoose.model('Debt', debtSchema);
