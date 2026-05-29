const Expense = require('../models/Expense');
const { sendSuccess, sendError, paginate } = require('../utils/responseHandler');
const { getCurrentMonthRange } = require('../utils/dateHelper');
const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../utils/constants');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({ ...req.body, userId: req.user._id });
    return sendSuccess(res, 201, 'Expense added successfully.', expense);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all expenses with filters & pagination
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, category, source, startDate, endDate } = req.query;

    const filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (source) filter.source = source;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Expense.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Expenses fetched.', expenses, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) return sendError(res, 404, 'Expense not found.');
    return sendSuccess(res, 200, 'Expense fetched.', expense);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return sendError(res, 404, 'Expense not found.');
    return sendSuccess(res, 200, 'Expense updated.', expense);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!expense) return sendError(res, 404, 'Expense not found.');
    return sendSuccess(res, 200, 'Expense deleted.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense summary for current month
// @route   GET /api/expenses/summary
// @access  Private
const getExpenseSummary = async (req, res, next) => {
  try {
    const { start, end } = getCurrentMonthRange();
    const summary = await Expense.aggregate([
      { $match: { userId: req.user._id, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    const totalSpent = summary.reduce((acc, s) => acc + s.total, 0);
    return sendSuccess(res, 200, 'Expense summary fetched.', { summary, totalSpent });
  } catch (error) {
    next(error);
  }
};

module.exports = { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, getExpenseSummary };
