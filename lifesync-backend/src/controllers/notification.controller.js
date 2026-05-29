const notificationParserService = require('../services/notification/notificationParser.service');
const Transaction = require('../models/Transaction');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Parse an incoming UPI/bank notification
// @route   POST /api/notification/parse
// @access  Private
const parseNotification = async (req, res, next) => {
  try {
    const { notificationText, upiApp } = req.body;

    if (!notificationText) return sendError(res, 400, 'Notification text is required.');

    const parsed = await notificationParserService.parse(notificationText, upiApp);

    if (!parsed.isTransaction) {
      return sendSuccess(res, 200, 'Not a financial transaction.', { isTransaction: false });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      ...parsed,
      notificationText,
      upiApp: upiApp || parsed.upiApp,
    });

    return sendSuccess(res, 201, 'Transaction parsed and saved.', { isTransaction: true, transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all parsed transactions
// @route   GET /api/notification/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(50);
    return sendSuccess(res, 200, 'Transactions fetched.', transactions);
  } catch (error) {
    next(error);
  }
};

module.exports = { parseNotification, getTransactions };
