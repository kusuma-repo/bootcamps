const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @descr    Register User
// @routes   POST /api/v1/login/register
// @acces    Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    roles,
    password
  } = req.body;

  const user = await User.create({
    name,
    email,
    roles,
    password
  });

  // create getUserJwtToken
  sendTokenCookie(user, 200, res);

});

// @descr    login User
// @routes   POST /api/v1/user/login
// @acces    Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  // Validation email and password
  if (!email || !password) {
    return next(new ErrorResponse(`Please insert email and password`, 400));
  }

  // Checks User
  const user = await User.findOne({
    email
  }).select('+password');

  if (!user) {
    return next(new ErrorResponse(`invalid credentials`, 401));
  }
  // Cehck if password macthd
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`invalid credentials`, 401));
  }

  // create getUserJwtToken
  sendTokenCookie(user, 200, res);
});

const sendTokenCookie = (user, statusCode, res) => {
  const token = user.getUserJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
}

// @descr    Get logged in User
// @routes   get /api/v1/user/getme
// @acces    Private
exports.logedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  })
})