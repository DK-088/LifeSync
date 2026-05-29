const { UPI_PATTERNS, UPI_APPS } = require('../../utils/regexPatterns');

/**
 * Extracts UPI transaction details from a notification string
 * @param {string} text - Notification message text
 * @param {string} appHint - Optional app name hint
 * @returns {Object} Parsed transaction data
 */
const parse = async (text, appHint = null) => {
  const lowerText = text.toLowerCase();

  const isDebit = UPI_PATTERNS.DEBIT.test(text);
  const isCredit = UPI_PATTERNS.CREDIT.test(text);

  if (!isDebit && !isCredit) {
    return { isTransaction: false };
  }

  const amountMatch = text.match(UPI_PATTERNS.AMOUNT);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

  if (!amount) return { isTransaction: false };

  const merchantMatch = text.match(UPI_PATTERNS.MERCHANT);
  const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown';

  const refMatch = text.match(UPI_PATTERNS.REFERENCE_ID);
  const referenceId = refMatch ? refMatch[1] : null;

  const upiIdMatch = text.match(UPI_PATTERNS.UPI_ID);
  const upiId = upiIdMatch ? upiIdMatch[1] : null;

  // Detect UPI app
  let detectedApp = appHint || null;
  if (!detectedApp) {
    for (const [key, appName] of Object.entries(UPI_APPS)) {
      if (lowerText.includes(key)) {
        detectedApp = appName;
        break;
      }
    }
  }

  return {
    isTransaction: true,
    transactionType: isDebit ? 'debit' : 'credit',
    amount,
    merchant,
    referenceId,
    upiId,
    upiApp: detectedApp,
  };
};

module.exports = { parse };
