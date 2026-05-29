const { EXPENSE_CATEGORIES, PAYMENT_TYPES } = require('../../utils/constants');

/**
 * Parse expense data from voice transcription and extracted entities
 * @param {string} text - Raw transcription
 * @param {Object} entities - Entities from intent detector
 * @returns {Object} Expense data ready for Mongoose
 */
const parseExpense = async (text, entities = {}) => {
  const amount = entities.amount || extractAmountFromText(text);
  const merchant = entities.merchant || extractMerchantFromText(text);
  const category = entities.category && EXPENSE_CATEGORIES.includes(entities.category)
    ? entities.category
    : 'Others';
  const paymentType = entities.paymentType && PAYMENT_TYPES.includes(entities.paymentType)
    ? entities.paymentType
    : 'UPI';

  return {
    amount,
    merchant,
    category,
    paymentType,
    description: `Voice: ${text.substring(0, 100)}`,
  };
};

// Simple regex fallback extractors
const extractAmountFromText = (text) => {
  const match = text.match(/(?:₹|rs\.?|rupees?)\s*(\d+(?:\.\d{1,2})?)/i);
  return match ? parseFloat(match[1]) : null;
};

const extractMerchantFromText = (text) => {
  const match = text.match(/(?:at|to|from|for)\s+([A-Za-z\s]{2,20})/i);
  return match ? match[1].trim() : 'Unknown';
};

module.exports = { parseExpense };
