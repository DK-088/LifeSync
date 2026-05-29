const Debt = require('../models/Debt');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Add a debt record
// @route   POST /api/debts
// @access  Private
const addDebt = async (req, res, next) => {
  try {
    const debt = await Debt.create({ ...req.body, userId: req.user._id });
    return sendSuccess(res, 201, 'Debt added.', debt);
  } catch (error) { next(error); }
};

// @desc    Get all debts
// @route   GET /api/debts
// @access  Private
const getDebts = async (req, res, next) => {
  try {
    const { type, paidStatus } = req.query;
    const filter = { userId: req.user._id };
    if (type) filter.type = type;
    if (paidStatus !== undefined) filter.paidStatus = paidStatus === 'true';
    const debts = await Debt.find(filter).sort({ createdAt: -1 });
    const totalLent = debts.filter(d => d.type === 'lent' && !d.paidStatus).reduce((a, d) => a + d.amount, 0);
    const totalBorrowed = debts.filter(d => d.type === 'borrowed' && !d.paidStatus).reduce((a, d) => a + d.amount, 0);
    return sendSuccess(res, 200, 'Debts fetched.', { debts, summary: { totalLent, totalBorrowed, net: totalLent - totalBorrowed } });
  } catch (error) { next(error); }
};

// @desc    Mark debt as paid
// @route   PATCH /api/debts/:id/pay
// @access  Private
const payDebt = async (req, res, next) => {
  try {
    const debt = await Debt.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { paidStatus: true, paidAt: new Date(), paidAmount: req.body.amount },
      { new: true }
    );
    if (!debt) return sendError(res, 404, 'Debt not found.');
    return sendSuccess(res, 200, 'Debt marked as paid.', debt);
  } catch (error) { next(error); }
};

// @desc    Delete a debt
// @route   DELETE /api/debts/:id
// @access  Private
const deleteDebt = async (req, res, next) => {
  try {
    const debt = await Debt.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!debt) return sendError(res, 404, 'Debt not found.');
    return sendSuccess(res, 200, 'Debt deleted.');
  } catch (error) { next(error); }
};

module.exports = { addDebt, getDebts, payDebt, deleteDebt };
