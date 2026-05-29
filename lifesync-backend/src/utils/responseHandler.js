/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 * @param {Object} meta - Optional pagination / extra metadata
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode
 * @param {string} message
 * @param {string} stack - Optional stack trace (dev mode only)
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', stack = null) => {
  const response = { success: false, message };
  if (stack && process.env.NODE_ENV === 'development') response.stack = stack;
  return res.status(statusCode).json(response);
};

/**
 * Build pagination meta object
 */
const paginate = (page, limit, total) => ({
  currentPage: Number(page),
  itemsPerPage: Number(limit),
  totalItems: total,
  totalPages: Math.ceil(total / limit),
});

module.exports = { sendSuccess, sendError, paginate };
