const Expense = require('../../models/Expense');
const Subscription = require('../../models/Subscription');
const Reminder = require('../../models/Reminder');
const { getCurrentMonthRange } = require('../../utils/dateHelper');

/**
 * Generate AI-powered smart reminder suggestions for a user
 * @param {string} userId
 * @returns {Array} List of suggested reminders
 */
const generateSuggestions = async (userId) => {
  const suggestions = [];
  const { start, end } = getCurrentMonthRange();

  // Check for upcoming subscriptions
  const subscriptions = await Subscription.find({
    userId,
    isActive: true,
    nextBillingDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });

  subscriptions.forEach((sub) => {
    suggestions.push({
      type: 'subscription',
      title: `${sub.name} renewal in ${Math.ceil((sub.nextBillingDate - new Date()) / (1000 * 60 * 60 * 24))} days`,
      amount: sub.amount,
      reminderDate: sub.nextBillingDate,
      priority: 'high',
    });
  });

  // Check if savings goal contribution is due
  const { start: mStart } = getCurrentMonthRange();
  const savedThisMonth = await Expense.countDocuments({
    userId,
    category: 'Investment',
    createdAt: { $gte: mStart },
  });

  if (savedThisMonth === 0) {
    const endOfMonth = new Date(end);
    endOfMonth.setDate(endOfMonth.getDate() - 5);
    suggestions.push({
      type: 'savings',
      title: 'Monthly investment contribution reminder',
      amount: null,
      reminderDate: endOfMonth,
      priority: 'medium',
    });
  }

  return suggestions;
};

module.exports = { generateSuggestions };
