const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');
const { initNotificationSocket } = require('./sockets/notification.socket');

// Cron Jobs
const { startEmiReminderJob } = require('./jobs/emiReminder.job');
const { startSubscriptionCheckJob } = require('./jobs/subscriptionCheck.job');
const { startFinancialHealthJob } = require('./jobs/financialHealth.job');

// ============================================
// Create HTTP Server + Socket.IO
// ============================================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach socket IO to app for use in controllers
app.set('io', io);
initNotificationSocket(io);

// ============================================
// Start Server
// ============================================
const startServer = async () => {
  try {
    await connectDB();

    server.listen(env.PORT, () => {
      logger.info(`
+===========================================+
|  LifeSync AI Backend                      |
|  Server running on port ${env.PORT}              |
|  Environment: ${env.NODE_ENV.padEnd(24)} |
+===========================================+
      `);
    });

    // Start background cron jobs
    startEmiReminderJob();
    startSubscriptionCheckJob();
    startFinancialHealthJob();
    logger.info('[CRON] All background cron jobs started.');
  } catch (error) {
    logger.error(`[SERVER] Startup failed: ${error.message}`);
    process.exit(1);
  }
};

// ============================================
// Graceful Shutdown
// ============================================
process.on('SIGTERM', () => {
  logger.warn('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  server.close(() => process.exit(1));
});

startServer();
