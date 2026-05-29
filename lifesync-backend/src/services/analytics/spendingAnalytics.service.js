const Expense = require('../../models/Expense');
const { getMonthRange } = require('../../utils/dateHelper');

/**
 * Get detailed spending breakdown for a month
 * @param {string} userId
 * @param {number} month - 1-12
 * @param {number} year
 * @returns {Object} Breakdown by category with trends
 */
const getSpendingBreakdown = async (userId, month, year) => {
  const { start, end } = getMonthRange(month, year);

  const breakdown = await Expense.aggregate([
    { $match: { userId, createdAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const totalSpent = breakdown.reduce((a, b) => a + b.total, 0);

  const enriched = breakdown.map((item) => ({
    category: item._id,
    total: Math.round(item.total),
    count: item.count,
    avgAmount: Math.round(item.avgAmount),
    percentage: totalSpent > 0 ? ((item.total / totalSpent) * 100).toFixed(1) : 0,
  }));

  // Day-wise spending trend
  const dailyTrend = await Expense.aggregate([
    { $match: { userId, createdAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return { breakdown: enriched, totalSpent: Math.round(totalSpent), dailyTrend };
};

module.exports = { getSpendingBreakdown };
