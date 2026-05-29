const Transaction = require('../models/Transaction');
const { sendSuccess, sendError, paginate } = require('../utils/responseHandler');
const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../utils/constants');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, type, startDate, endDate } = req.query;
    const filter = { userId: req.user._id };
    if (type) filter.transactionType = type;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ timestamp: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(filter),
    ]);
    return sendSuccess(res, 200, 'Transactions fetched.', transactions, paginate(page, limit, total));
  } catch (error) { next(error); }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res, next) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!tx) return sendError(res, 404, 'Transaction not found.');
    return sendSuccess(res, 200, 'Transaction fetched.', tx);
  } catch (error) { next(error); }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!tx) return sendError(res, 404, 'Transaction not found.');
    return sendSuccess(res, 200, 'Transaction deleted.');
  } catch (error) { next(error); }
};

module.exports = { getTransactions, getTransactionById, deleteTransaction };
