const Expense = require('../../models/Expense');
const Reminder = require('../../models/Reminder');
const Debt = require('../../models/Debt');
const Goal = require('../../models/Goal');
const { getCurrentMonthRange } = require('../../utils/dateHelper');
const mongoose = require('mongoose');

/**
 * Build the main dashboard data for a user
 * @param {string} userId
 * @param {number} monthlyIncome
 * @returns {Object} Dashboard data
 */
const getDashboardData = async (userId, monthlyIncome) => {
  const { start, end } = getCurrentMonthRange();
  const uid = new mongoose.Types.ObjectId(userId);

  const [monthlyExpenses, upcomingReminders, pendingDebts, activeGoals] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: uid, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Reminder.find({ userId, completed: false, reminderDate: { $gte: new Date() } })
      .sort({ reminderDate: 1 })
      .limit(5),
    Debt.find({ userId, paidStatus: false }).sort({ dueDate: 1 }).limit(5),
    Goal.find({ userId, status: 'active' }).sort({ targetDate: 1 }).limit(5),
  ]);

  const totalSpent = monthlyExpenses.reduce((a, e) => a + e.total, 0);
  const savings = Math.max(0, monthlyIncome - totalSpent);
  const savingsRate = monthlyIncome > 0 ? ((savings / monthlyIncome) * 100).toFixed(1) : 0;

  return {
    overview: {
      monthlyIncome,
      totalSpent: Math.round(totalSpent),
      savings: Math.round(savings),
      savingsRate: parseFloat(savingsRate),
    },
    topCategories: monthlyExpenses.slice(0, 5),
    upcomingReminders,
    pendingDebts,
    activeGoals,
  };
};

module.exports = { getDashboardData };
