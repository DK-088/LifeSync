const { SUBSCRIPTION_KEYWORDS } = require('../../utils/regexPatterns');

/**
 * Determines whether a notification is a financial transaction
 * and whether it's a subscription
 * @param {string} text
 * @returns {{ isTransaction: boolean, isSubscription: boolean }}
 */
const detect = (text) => {
  const lowerText = text.toLowerCase();

  const transactionKeywords = ['debited', 'credited', 'paid', 'received', 'transferred', 'payment', '₹', 'rs.', 'inr'];
  const isTransaction = transactionKeywords.some((kw) => lowerText.includes(kw));

  const isSubscription = SUBSCRIPTION_KEYWORDS.some((kw) => lowerText.includes(kw.toLowerCase()));

  return { isTransaction, isSubscription };
};

module.exports = { detect };
