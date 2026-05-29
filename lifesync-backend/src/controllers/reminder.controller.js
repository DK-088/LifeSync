const Reminder = require('../models/Reminder');
const smartReminderService = require('../services/reminder/smartReminder.service');
const { sendSuccess, sendError, paginate } = require('../utils/responseHandler');
const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../utils/constants');

// @desc    Create a reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.create({ ...req.body, userId: req.user._id });
    return sendSuccess(res, 201, 'Reminder created.', reminder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res, next) => {
  try {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, completed } = req.query;
    const filter = { userId: req.user._id };
    if (completed !== undefined) filter.completed = completed === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [reminders, total] = await Promise.all([
      Reminder.find(filter).sort({ reminderDate: 1 }).skip(skip).limit(Number(limit)),
      Reminder.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Reminders fetched.', reminders, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
};

// @desc    Mark reminder as complete
// @route   PATCH /api/reminders/:id/complete
// @access  Private
const completeReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { completed: true, completedAt: new Date() },
      { new: true }
    );
    if (!reminder) return sendError(res, 404, 'Reminder not found.');
    return sendSuccess(res, 200, 'Reminder marked as complete.', reminder);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!reminder) return sendError(res, 404, 'Reminder not found.');
    return sendSuccess(res, 200, 'Reminder deleted.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-suggested smart reminders
// @route   GET /api/reminders/smart-suggestions
// @access  Private
const getSmartSuggestions = async (req, res, next) => {
  try {
    const suggestions = await smartReminderService.generateSuggestions(req.user._id);
    return sendSuccess(res, 200, 'Smart reminder suggestions.', suggestions);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReminder, getReminders, completeReminder, deleteReminder, getSmartSuggestions };
