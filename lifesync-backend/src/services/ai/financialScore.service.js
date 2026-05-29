const Expense = require('../../models/Expense');
const FinancialHealth = require('../../models/FinancialHealth');
const { FINANCIAL_HEALTH_GRADES } = require('../../utils/constants');
const { getCurrentMonthRange } = require('../../utils/dateHelper');

/**
 * Calculate financial health score for a user
 * @param {string} userId
 * @param {number} monthlyIncome
 * @returns {Object} Financial health record
 */
const calculateScore = async (userId, monthlyIncome) => {
  const { start, end } = getCurrentMonthRange();

  const expenses = await Expense.find({ userId, createdAt: { $gte: start, $lte: end } });
  const totalSpent = expenses.reduce((a, e) => a + e.amount, 0);

  const emiExpenses = expenses.filter((e) => e.category === 'EMI').reduce((a, e) => a + e.amount, 0);
  const savings = Math.max(0, monthlyIncome - totalSpent);

  const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0;
  const emiRatio = monthlyIncome > 0 ? (emiExpenses / monthlyIncome) * 100 : 0;
  const spendingRatio = monthlyIncome > 0 ? (totalSpent / monthlyIncome) * 100 : 0;

  // Scoring logic (0-100)
  let score = 100;
  if (savingsRate < 10) score -= 30;
  else if (savingsRate < 20) score -= 15;
  if (emiRatio > 40) score -= 25;
  else if (emiRatio > 25) score -= 10;
  if (spendingRatio > 90) score -= 20;
  else if (spendingRatio > 75) score -= 10;
  score = Math.max(0, Math.min(100, score));

  // Determine grade
  const gradeEntry = Object.entries(FINANCIAL_HEALTH_GRADES)
    .reverse()
    .find(([threshold]) => score >= Number(threshold));
  const grade = gradeEntry ? gradeEntry[1] : 'F';

  const insights = [];
  if (savingsRate < 20) insights.push('Your savings rate is below the recommended 20%. Try to cut discretionary spending.');
  if (emiRatio > 30) insights.push('EMI obligations exceed 30% of income. Consider restructuring high-interest loans.');
  if (spendingRatio > 80) insights.push('You are spending over 80% of your income. Build an emergency fund.');

  const now = new Date();
  return FinancialHealth.create({
    userId,
    score,
    grade,
    savingsRate,
    emiRatio,
    spendingRatio,
    insights,
    recommendations: insights,
    period: { month: now.getMonth() + 1, year: now.getFullYear() },
  });
};

module.exports = { calculateScore };
