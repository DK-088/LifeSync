const { sendError } = require('../utils/responseHandler');

/**
 * Validates request body/params/query using a Joi schema
 * @param {Object} schema - Joi schema object
 * @param {string} source - 'body' | 'params' | 'query'
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message.replace(/['"]/g, '')).join('; ');
      return sendError(res, 422, `Validation failed: ${messages}`);
    }

    req[source] = value;
    next();
  };
};

module.exports = { validate };
