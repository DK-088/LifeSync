const Joi = require('joi');
const { EXPENSE_CATEGORIES, PAYMENT_TYPES, EXPENSE_SOURCES } = require('../utils/constants');

const createExpenseSchema = Joi.object({
  amount: Joi.number().min(0.01).required().messages({
    'number.min': 'Amount must be greater than 0',
    'any.required': 'Amount is required',
  }),
  category: Joi.string().valid(...EXPENSE_CATEGORIES).default('Others'),
  merchant: Joi.string().max(80).optional(),
  description: Joi.string().max(200).optional(),
  paymentType: Joi.string().valid(...PAYMENT_TYPES).default('UPI'),
  source: Joi.string().valid(...EXPENSE_SOURCES).default('manual'),
  tags: Joi.array().items(Joi.string()).optional(),
  isRecurring: Joi.boolean().optional(),
  recurringFrequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').optional().allow(null),
});

module.exports = { createExpenseSchema };
