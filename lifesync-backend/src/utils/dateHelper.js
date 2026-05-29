const moment = require('moment');

/**
 * Get the start and end of the current month
 */
const getCurrentMonthRange = () => ({
  start: moment().startOf('month').toDate(),
  end: moment().endOf('month').toDate(),
});

/**
 * Get start/end for a specific month and year
 */
const getMonthRange = (month, year) => ({
  start: moment({ year, month: month - 1 }).startOf('month').toDate(),
  end: moment({ year, month: month - 1 }).endOf('month').toDate(),
});

/**
 * Get last N days range
 */
const getLastNDays = (n) => ({
  start: moment().subtract(n, 'days').startOf('day').toDate(),
  end: moment().endOf('day').toDate(),
});

/**
 * Format a date to a readable string
 */
const formatDate = (date, format = 'DD MMM YYYY') => moment(date).format(format);

/**
 * Check if a date is past due
 */
const isPastDue = (date) => moment(date).isBefore(moment());

/**
 * Days remaining until a date
 */
const daysUntil = (date) => moment(date).diff(moment(), 'days');

module.exports = { getCurrentMonthRange, getMonthRange, getLastNDays, formatDate, isPastDue, daysUntil };
