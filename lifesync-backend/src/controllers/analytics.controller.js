const spendingAnalyticsService = require('../services/analytics/spendingAnalytics.service');
const dashboardService = require('../services/analytics/dashboard.service');
const savingsPredictionService = require('../services/analytics/savingsPrediction.service');
const { calculateScore } = require('../services/ai/financialScore.service');
const { checkAffordability } = require('../services/ai/affordability.service');
const { predictHabits } = require('../services/ai/habitPrediction.service');
const FinancialHealth = require('../models/FinancialHealth');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get dashboard overview
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData(req.user._id, req.user.monthlyIncome);
    // Let's attach latest financial health score as well
    const health = await FinancialHealth.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    data.healthScore = health ? health.score : 80; // default to 80 if not calculated yet
    return sendSuccess(res, 200, 'Dashboard data fetched.', data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get spending breakdown by category
// @route   GET /api/analytics/spending
// @access  Private
const getSpendingAnalytics = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const data = await spendingAnalyticsService.getSpendingBreakdown(
      req.user._id,
      month || new Date().getMonth() + 1,
      year || new Date().getFullYear()
    );
    return sendSuccess(res, 200, 'Spending analytics fetched.', data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get savings prediction
// @route   GET /api/analytics/savings-prediction
// @access  Private
const getSavingsPrediction = async (req, res, next) => {
  try {
    const data = await savingsPredictionService.predict(req.user._id, req.user.monthlyIncome);
    return sendSuccess(res, 200, 'Savings prediction fetched.', data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get financial health score
// @route   GET /api/analytics/health
// @access  Private
const getFinancialHealth = async (req, res, next) => {
  try {
    let health = await FinancialHealth.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    if (!health) {
      health = await calculateScore(req.user._id, req.user.monthlyIncome || 0);
    }
    return sendSuccess(res, 200, 'Financial health score fetched.', health);
  } catch (error) {
    next(error);
  }
};

// @desc    Recalculate financial health score
// @route   POST /api/analytics/health/recalculate
// @access  Private
const recalculateFinancialHealth = async (req, res, next) => {
  try {
    const health = await calculateScore(req.user._id, req.user.monthlyIncome || 0);
    return sendSuccess(res, 200, 'Financial health score recalculated.', health);
  } catch (error) {
    next(error);
  }
};

// @desc    Check affordability of a purchase
// @route   POST /api/analytics/affordability
// @access  Private
const checkAffordabilityController = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const result = await checkAffordability(req.user._id, Number(amount), description, req.user.monthlyIncome || 0);
    return sendSuccess(res, 200, 'Affordability checked.', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get spend habits analysis
// @route   GET /api/analytics/habits
// @access  Private
const getSpendHabits = async (req, res, next) => {
  try {
    const result = await predictHabits(req.user._id);
    return sendSuccess(res, 200, 'Spend habits analytics fetched.', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getSpendingAnalytics,
  getSavingsPrediction,
  getFinancialHealth,
  recalculateFinancialHealth,
  checkAffordabilityController,
  getSpendHabits,
};
