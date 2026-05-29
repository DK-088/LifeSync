const Expense = require('../../models/Expense');
const { getLastNDays } = require('../../utils/dateHelper');

/**
 * Predict spending habits based on last 90 days of expenses
 * @param {string} userId
 * @returns {Object} habit predictions
 */
const predictHabits = async (userId) => {
  const { start, end } = getLastNDays(90);

  const categoryTotals = await Expense.aggregate([
    { $match: { userId, createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);

  const topCategories = categoryTotals.slice(0, 3).map((c) => ({
    category: c._id,
    monthlyAverage: Math.round(c.total / 3),
    transactionCount: c.count,
  }));

  const habits = topCategories.map((cat) => {
    let insight = '';
    if (cat.category === 'Food & Dining' && cat.monthlyAverage > 5000) {
      insight = 'Consider cooking at home more often to reduce dining expenses.';
    } else if (cat.category === 'Entertainment' && cat.monthlyAverage > 3000) {
      insight = 'Your entertainment spending is high. Look for free or lower-cost alternatives.';
    } else {
      insight = `You consistently spend ₹${cat.monthlyAverage}/month on ${cat.category}.`;
    }
    return { ...cat, insight };
  });

  return { habits, analysedDays: 90 };
};

module.exports = { predictHabits };
