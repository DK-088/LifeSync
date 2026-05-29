const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const Reminder = require('../models/Reminder');
const logger = require('../utils/logger');

/**
 * Subscription Check Job - runs every day at 9:00 AM IST
 * Auto-creates reminders for subscriptions due in 3 days
 */
const startSubscriptionCheckJob = () => {
  cron.schedule('0 9 * * *', async () => {
    logger.info('[CRON] Subscription check job started');
    try {
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const now = new Date();

      const dueSubs = await Subscription.find({
        isActive: true,
        nextBillingDate: { $gte: now, $lte: threeDaysFromNow },
      });

      for (const sub of dueSubs) {
        const existing = await Reminder.findOne({
          userId: sub.userId,
          title: { $regex: sub.name, $options: 'i' },
          reminderDate: { $gte: now },
        });

        if (!existing) {
          await Reminder.create({
            userId: sub.userId,
            title: `${sub.name} subscription renews soon`,
            description: `₹${sub.amount} will be charged on ${sub.nextBillingDate.toDateString()}`,
            reminderDate: sub.nextBillingDate,
            type: 'subscription',
            amount: sub.amount,
            priority: 'high',
          });
          logger.info(`[CRON] Created subscription reminder for: ${sub.name}`);
        }
      }

      logger.info(`[CRON] Subscription check complete. Processed: ${dueSubs.length}`);
    } catch (error) {
      logger.error(`[CRON] Subscription check failed: ${error.message}`);
    }
  }, { timezone: 'Asia/Kolkata' });
};

module.exports = { startSubscriptionCheckJob };
