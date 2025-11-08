import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('No user found with this ID!!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found!! Please enter a valid ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with this ID!! Please enter a valid ID', 404));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cannot update your password here'), 400);
  }

  const filteredObj = filterObj(req.body, 'name', 'email', 'username');

  const user = await User.findByIdAndUpdate(userId, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: 'success',
    data: { user },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// this won't work because of the pre find hook, will figure it out later, but the functionality is working correct
export const recoverMe = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  const userId = user._id;

  await User.findByIdAndUpdate(userId, { active: true }, { new: true });

  res.status(201).json({
    status: 'success',
    message: 'User recovered successfully!',
    data: { user },
  });
});
