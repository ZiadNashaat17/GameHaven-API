import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  user.password = undefined;
  user.passwordChangedAt = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

export const register = async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password to login!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('You are not logged in!! Please log in to get access', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) return next(new AppError('User no longer exists!!', 401));

  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError('Password changed after token was issued!! You have to login again!', 401)
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have presmission to perform this action.', 403));
    }

    next();
  };
};

export const changePassword = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return next(new AppError('Please Enter current password and new password'), 400);
  }

  const user = await User.findById(userId).select('+password');

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Current password is incorrect', 400));
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new AppError('Passwords are not the same!', 400));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully, Please login with the new password!',
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('No user found with  this email', 400));
  }

  const resetToken = await user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

  await sendEmail(
    user.email,
    'Welcome to GameHaven!',
    'Welcome to our platform',
    `<strong>${resetURL}</strong>`
  );

  res.status(200).json({
    status: 'success',
    message: 'Email sent successfully',
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const { password, passwordConfirm } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});
