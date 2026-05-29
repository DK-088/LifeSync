const Expense = require('../../models/Expense');
const { getLastNDays } = require('../../utils/dateHelper');

/**
 * Predict next month's savings based on last 3 months
 * @param {string} userId
 * @param {number} monthlyIncome
 * @returns {Object} Savings prediction
 */
const predict = async (userId, monthlyIncome) => {
  const threeMonthsRange = getLastNDays(90);

  const monthlyTotals = await Expense.aggregate([
    { $match: { userId, createdAt: { $gte: threeMonthsRange.start } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  if (monthlyTotals.length === 0) {
    return { predictedSavings: monthlyIncome, confidence: 'low', message: 'Not enough data.' };
  }

  const avgSpend = monthlyTotals.reduce((a, m) => a + m.total, 0) / monthlyTotals.length;
  const predictedSavings = Math.max(0, monthlyIncome - avgSpend);
  const savingsRate = monthlyIncome > 0 ? (predictedSavings / monthlyIncome) * 100 : 0;

  let message = '';
  if (savingsRate >= 30) message = 'Excellent! You are saving well above the recommended 20%.';
  else if (savingsRate >= 20) message = 'Good savings rate. Keep it up!';
  else if (savingsRate >= 10) message = 'Below recommended savings. Try reducing non-essential spending.';
  else message = 'Critical: You are saving less than 10%. Review your budget immediately.';

  return {
    avgMonthlySpend: Math.round(avgSpend),
    predictedSavings: Math.round(predictedSavings),
    savingsRate: savingsRate.toFixed(1),
    confidence: monthlyTotals.length >= 3 ? 'high' : 'medium',
    message,
  };
};

module.exports = { predict };
