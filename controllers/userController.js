const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');

exports.getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

exports.getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  res.json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }
  res.json({ success: true, message: 'User deleted' });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, profileImage } = req.body;
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (profileImage !== undefined) updateData.profileImage = profileImage;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: user });
});
