const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');


// Protect routes
exports.security = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Make Sure toke is exist
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    // veryfy sendTokenCookie
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    req.user = await User.findById(decoded.id);
    next()
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
})

// grant authorization for User
exports.authorizations = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.roles)) {
      return next(new ErrorResponse(`Opps .. Sorry your roles cannot access this route`, 403));
    }
    next();
  }
}