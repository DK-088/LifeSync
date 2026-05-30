const crypto = require('crypto');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { sendEmail } = require('../services/notification/emailService');
const { getOtpEmailTemplate } = require('../utils/emailTemplate');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, 409, 'Email already registered.');

    const user = await User.create({ name, email, password, phone });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 201, 'Account created successfully.', {
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Login successful.', {
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return sendError(res, 400, 'Refresh token required.');

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return sendError(res, 401, 'Invalid or expired refresh token.');
    }

    const newAccessToken = generateAccessToken(user._id);
    return sendSuccess(res, 200, 'Token refreshed.', { accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    return sendSuccess(res, 200, 'Logged out successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'Profile fetched.', req.user);
  } catch (error) {
    next(error);
  }
};

// @desc    Request forgot password OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, 'No account found with this email address.');
    }

    // Generate a secure 6-digit OTP code (between 100000 and 999999)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before saving in DB for security
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetPasswordOTP = hashedOtp;
    
    // Valid for 10 minutes
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Prepare device/client details for the caution card
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
    const os = req.headers['x-os'] || 'Mobile Device';
    const browser = req.headers['x-client'] || 'LifeSync App';

    // Generate HTML template
    const htmlContent = getOtpEmailTemplate(otp, {
      ip,
      os,
      browser,
      date: new Date().toLocaleString(),
    });

    // Send the email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP Code - LifeSync AI',
      html: htmlContent,
      text: `Your 6-digit password reset verification code is ${otp}. This code is valid for 10 minutes.`,
    });

    return sendSuccess(res, 200, 'Verification code sent successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify forgot password OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordExpires) {
      return sendError(res, 400, 'Invalid reset request or expired code.');
    }

    // Check expiry
    if (Date.now() > user.resetPasswordExpires) {
      return sendError(res, 400, 'Verification code has expired. Please request a new one.');
    }

    // Hash and verify OTP code
    const hashedOtp = crypto.createHash('sha256').update(String(otp)).digest('hex');
    if (hashedOtp !== user.resetPasswordOTP) {
      return sendError(res, 400, 'Incorrect verification code. Please try again.');
    }

    return sendSuccess(res, 200, 'Verification code is valid.');
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordExpires) {
      return sendError(res, 400, 'Invalid reset request or expired code.');
    }

    // Check expiry
    if (Date.now() > user.resetPasswordExpires) {
      return sendError(res, 400, 'Verification code has expired. Please request a new one.');
    }

    // Hash and verify OTP code
    const hashedOtp = crypto.createHash('sha256').update(String(otp)).digest('hex');
    if (hashedOtp !== user.resetPasswordOTP) {
      return sendError(res, 400, 'Incorrect verification code. Please try again.');
    }

    // Update password (hashed automatically in userSchema.pre('save') hook)
    user.password = password;
    
    // Clear OTP fields
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    
    await user.save();

    return sendSuccess(res, 200, 'Password has been successfully updated.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
