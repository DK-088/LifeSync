const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');
const User = require('../models/User');
const env = require('../config/env');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Not authorized. No token provided.');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return sendError(res, 401, 'User not found or account deactivated.');
    }

    if (!user.isActive) {
      return sendError(res, 401, 'Account is deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Invalid token. Please login again.');
    }
    return sendError(res, 500, 'Authentication error.');
  }
};

module.exports = { protect };
