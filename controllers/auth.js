const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
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
// @descr    Update detail User
// @routes   get /api/v1/user/updatedetails
// @acces    Private
exports.detailUser = asyncHandler(async (req, res, next) => {
  const fieldUpdate = {
    nama: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldUpdate, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: user
  })
})
// @descr    Update password User
// @routes   PUT /api/v1/user/updatepassword
// @acces    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // checks current password
  if (!(await user.matchPassword(req.body.recentpassword))) {
    return next(new ErrorResponse('invalid password', 401));
  }
  user.password = req.body.password;
  await user.save();

  sendTokenResponse(user, 200, res);
})
// @descr    send forgot password
// @routes   post /api/v1/user/forgotpassword
// @acces    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    return next(new ErrorResponse(` user with email ${req.body.email} not found`, 404));
  }
  // get reset token
  const resetToken = user.getResetPasswordToken()
  await user.save({
    validateBeforeSave: false
  });
  // create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetpassword/${resetToken}`;
  const message = `You receiving this email because you
  click resetpassword Please make PUT request to :\n\n
  ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'password reset token',
      message
    });
    res.status(200).json({
      success: true,
      data: 'email has been sent'
    });
  } catch (e) {
    console.log(e);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({
      validateBeforeSave: false
    });
    return next(new ErrorResponse(` email could not be sent`, 400));
  }

});
// @descr    Reset password
// @routes   PUT /api/v1/user/resetpassword/:resetToken
// @acces    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get has password token
  const resetPasswordToken = crypto.createHash('sha256')
    .update(req.params.resettoken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now()
    }
  });
  if (!user) {
    return next(new ErrorResponse('invalid token', 400));
  }
  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
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