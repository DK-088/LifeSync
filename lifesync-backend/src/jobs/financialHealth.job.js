const cron = require('node-cron');
const User = require('../models/User');
const { calculateScore } = require('../services/ai/financialScore.service');
const logger = require('../utils/logger');

/**
 * Financial Health Job - runs on 1st of every month at 7:00 AM IST
 * Calculates and saves monthly financial health scores for all active users
 */
const startFinancialHealthJob = () => {
  cron.schedule('0 7 1 * *', async () => {
    logger.info('[CRON] Financial health score job started');
    try {
      const users = await User.find({ isActive: true }).select('_id monthlyIncome');
      let processed = 0;

      for (const user of users) {
        try {
          await calculateScore(user._id, user.monthlyIncome || 0);
          processed++;
        } catch (err) {
          logger.error(`[CRON] Failed for user ${user._id}: ${err.message}`);
        }
      }

      logger.info(`[CRON] Financial health job complete. Users processed: ${processed}`);
    } catch (error) {
      logger.error(`[CRON] Financial health job failed: ${error.message}`);
    }
  }, { timezone: 'Asia/Kolkata' });
};

module.exports = { startFinancialHealthJob };
