// UPI transaction detection patterns (Indian context)
const UPI_PATTERNS = {
  // Generic UPI debit
  DEBIT: /(?:debited|paid|sent|transferred|deducted)\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
  // Generic UPI credit
  CREDIT: /(?:credited|received|added)\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
  // Amount extractor
  AMOUNT: /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
  // Merchant / VPA
  MERCHANT: /(?:to|from|at|via)\s+([A-Za-z0-9\s&._-]{2,40}?)(?:\s+on|\s+for|\s+via|\.|$)/i,
  // UPI Reference ID
  REFERENCE_ID: /(?:Ref\.?\s*(?:No\.?|ID)?|UPI Ref|Txn ID)[:\s]*([A-Z0-9]{12,20})/i,
  // VPA / UPI ID
  UPI_ID: /([a-zA-Z0-9.\-_]+@[a-zA-Z]{2,10})/,
};

// Subscription merchant keywords
const SUBSCRIPTION_KEYWORDS = [
  'netflix', 'spotify', 'amazon prime', 'hotstar', 'zee5', 'sonyliv',
  'youtube premium', 'disney', 'apple music', 'google one', 'dropbox', 'adobe',
];

// UPI app identifiers
const UPI_APPS = {
  phonepe: 'PhonePe',
  gpay: 'GPay',
  'google pay': 'GPay',
  paytm: 'Paytm',
  bhim: 'BHIM',
  amazonpay: 'AmazonPay',
  whatsapp: 'WhatsApp Pay',
};

module.exports = { UPI_PATTERNS, SUBSCRIPTION_KEYWORDS, UPI_APPS };
