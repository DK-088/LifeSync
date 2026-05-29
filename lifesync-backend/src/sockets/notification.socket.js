const logger = require('../utils/logger');

/**
 * Initialize Socket.IO for real-time notifications
 * @param {Object} io - Socket.IO server instance
 */
const initNotificationSocket = (io) => {
  // Namespace for notifications
  const notifNs = io.of('/notifications');

  notifNs.on('connection', (socket) => {
    logger.info(`[Socket] Client connected: ${socket.id}`);

    // Join user-specific room for targeted notifications
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      logger.info(`[Socket] User ${userId} joined notification room`);
    });

    socket.on('disconnect', () => {
      logger.info(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  // Helper to emit notification to a specific user
  const sendToUser = (userId, event, data) => {
    notifNs.to(`user:${userId}`).emit(event, data);
  };

  return { sendToUser };
};

module.exports = { initNotificationSocket };
