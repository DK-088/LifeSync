const Joi = require('joi');

const parseNotificationSchema = Joi.object({
  notificationText: Joi.string().min(5).max(500).required().messages({
    'string.min': 'Notification text is too short',
    'any.required': 'Notification text is required',
  }),
  upiApp: Joi.string().valid('PhonePe', 'GPay', 'Paytm', 'BHIM', 'AmazonPay', 'WhatsApp Pay', 'Others').optional(),
});

module.exports = { parseNotificationSchema };
