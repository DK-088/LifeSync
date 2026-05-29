const spendingAnalyticsService = require('../services/analytics/spendingAnalytics.service');
const dashboardService = require('../services/analytics/dashboard.service');
const savingsPredictionService = require('../services/analytics/savingsPrediction.service');
const { sendSuccess } = require('../utils/responseHandler');

// @desc    Get dashboard overview
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData(req.user._id, req.user.monthlyIncome);
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

module.exports = { getDashboard, getSpendingAnalytics, getSavingsPrediction };
