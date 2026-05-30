const Subscription = require('../models/Subscription');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({ ...req.body, userId: req.user._id });
    return sendSuccess(res, 201, 'Subscription created.', subscription);
  } catch (error) { next(error); }
};

const getSubscriptions = async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    const subscriptions = await Subscription.find(filter).sort({ nextBillingDate: 1 });
    return sendSuccess(res, 200, 'Subscriptions fetched.', subscriptions);
  } catch (error) { next(error); }
};

const toggleSubscriptionActive = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sub) return sendError(res, 404, 'Subscription not found.');
    sub.isActive = !sub.isActive;
    await sub.save();
    return sendSuccess(res, 200, 'Subscription status updated.', sub);
  } catch (error) { next(error); }
};

const deleteSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!sub) return sendError(res, 404, 'Subscription not found.');
    return sendSuccess(res, 200, 'Subscription deleted.');
  } catch (error) { next(error); }
};

module.exports = { createSubscription, getSubscriptions, toggleSubscriptionActive, deleteSubscription };
