require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const env = require('./config/env');
const loggerMiddleware = require('./middleware/logger.middleware');

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, 'config', 'swagger.yaml'));
const { errorHandler, notFound } = require('./middleware/error.middleware');
const { defaultLimiter } = require('./middleware/rateLimiter.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const transactionRoutes = require('./routes/transaction.routes');
const notificationRoutes = require('./routes/notification.routes');
const voiceRoutes = require('./routes/voice.routes');
const ocrRoutes = require('./routes/ocr.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const reminderRoutes = require('./routes/reminder.routes');
const debtRoutes = require('./routes/debt.routes');
const goalRoutes = require('./routes/goal.routes');
const subscriptionRoutes = require('./routes/subscription.routes');

const app = express();

// ============================================
// Security Middleware
// ============================================
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use(mongoSanitize());

// ============================================
// Body Parsing
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// HTTP Logging
// ============================================
app.use(loggerMiddleware);

// ============================================
// Static Files (uploaded bills/audio)
// ============================================
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ============================================
// Rate Limiting (global)
// ============================================
app.use('/api', defaultLimiter);

// ============================================
// Health Check
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LifeSync AI Backend is running!',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Documentation
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// ============================================
// Error Handling
// ============================================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
