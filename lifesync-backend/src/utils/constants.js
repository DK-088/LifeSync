const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health & Medical', 'Utilities', 'Education', 'Travel',
  'Groceries', 'Rent', 'EMI', 'Investment', 'Insurance',
  'Subscriptions', 'Personal Care', 'Others',
];

const PAYMENT_TYPES = ['UPI', 'Cash', 'Card', 'Net Banking', 'Wallet', 'Others'];

const EXPENSE_SOURCES = ['manual', 'notification', 'voice', 'ocr', 'ai'];

const UPI_APPS_LIST = ['PhonePe', 'GPay', 'Paytm', 'BHIM', 'AmazonPay', 'WhatsApp Pay', 'Others'];

const FINANCIAL_HEALTH_GRADES = {
  90: 'A+',
  80: 'A',
  70: 'B+',
  60: 'B',
  50: 'C',
  40: 'D',
  0: 'F',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_ERROR: 500,
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

module.exports = {
  EXPENSE_CATEGORIES,
  PAYMENT_TYPES,
  EXPENSE_SOURCES,
  UPI_APPS_LIST,
  FINANCIAL_HEALTH_GRADES,
  HTTP_STATUS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
