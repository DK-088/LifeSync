const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, monthlyIncome, savingsGoal } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, 409, 'Email already registered.');

    const user = await User.create({ name, email, password, phone, monthlyIncome, savingsGoal });

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

// @desc    Update user profile settings
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, monthlyIncome, savingsGoal } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, 'User not found.');

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (monthlyIncome !== undefined) user.monthlyIncome = Number(monthlyIncome);
    if (savingsGoal !== undefined) user.savingsGoal = Number(savingsGoal);

    await user.save();
    return sendSuccess(res, 200, 'Profile updated successfully.', user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout, getMe, updateProfile };
