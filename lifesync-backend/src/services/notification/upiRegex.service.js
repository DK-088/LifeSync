const { UPI_PATTERNS } = require('../../utils/regexPatterns');

/**
 * Apply UPI regex patterns to raw notification text
 * @param {string} text
 * @returns {Object} extracted fields
 */
const extract = (text) => {
  return {
    isDebit: UPI_PATTERNS.DEBIT.test(text),
    isCredit: UPI_PATTERNS.CREDIT.test(text),
    amount: (() => {
      const m = text.match(UPI_PATTERNS.AMOUNT);
      return m ? parseFloat(m[1].replace(/,/g, '')) : null;
    })(),
    merchant: (() => {
      const m = text.match(UPI_PATTERNS.MERCHANT);
      return m ? m[1].trim() : null;
    })(),
    upiId: (() => {
      const m = text.match(UPI_PATTERNS.UPI_ID);
      return m ? m[1] : null;
    })(),
    referenceId: (() => {
      const m = text.match(UPI_PATTERNS.REFERENCE_ID);
      return m ? m[1] : null;
    })(),
  };
};

module.exports = { extract };
