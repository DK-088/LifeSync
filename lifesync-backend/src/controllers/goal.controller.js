const Goal = require('../models/Goal');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user._id });
    return sendSuccess(res, 201, 'Goal created.', goal);
  } catch (error) { next(error); }
};

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Goals fetched.', goals);
  } catch (error) { next(error); }
};

// @desc    Add contribution to a goal
// @route   PATCH /api/goals/:id/contribute
// @access  Private
const contributeToGoal = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) return sendError(res, 404, 'Goal not found.');

    goal.currentAmount += Number(amount);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }
    await goal.save();
    return sendSuccess(res, 200, 'Contribution added.', goal);
  } catch (error) { next(error); }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return sendError(res, 404, 'Goal not found.');
    return sendSuccess(res, 200, 'Goal deleted.');
  } catch (error) { next(error); }
};

module.exports = { createGoal, getGoals, contributeToGoal, deleteGoal };
