const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @descr    get all users
// @routes   GET /api/v1/bootcamps
// @acces    Private(Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
  //console.log(req.query);
  res.status(200).json(res.advancedSearch);
});

// @descr    get single user
// @routes   GET /api/v1/bootcamps
// @acces    Private(Admin)
exports.getUser = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.params.id);
  // check if users exist
  if (!user) {
    return next(new ErrorResponse(`Bootcamp tidak tersedia  ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @descr    create single user
// @routes   POST /api/v1/user
// @acces    Private(Admin)
exports.createUser = asyncHandler(async (req, res, next) => {

  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    data: user
  });
});
// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});