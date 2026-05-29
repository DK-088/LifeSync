const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * EMI Reminder Job - runs every day at 8:00 AM IST
 * Checks for EMI reminders due in the next 3 days and sends notifications
 */
const startEmiReminderJob = () => {
  cron.schedule('0 8 * * *', async () => {
    logger.info('[CRON] EMI Reminder job started');
    try {
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const now = new Date();

      const dueReminders = await Reminder.find({
        type: 'emi',
        completed: false,
        notificationSent: false,
        reminderDate: { $gte: now, $lte: threeDaysFromNow },
      }).populate('userId', 'name email');

      for (const reminder of dueReminders) {
        // TODO: Integrate with push notification service
        logger.info(`[EMI Reminder] Sending to user: ${reminder.userId?.email} - ${reminder.title}`);
        await Reminder.findByIdAndUpdate(reminder._id, { notificationSent: true });
      }

      logger.info(`[CRON] EMI Reminder job complete. Processed: ${dueReminders.length}`);
    } catch (error) {
      logger.error(`[CRON] EMI Reminder job failed: ${error.message}`);
    }
  }, { timezone: 'Asia/Kolkata' });
};

module.exports = { startEmiReminderJob };
