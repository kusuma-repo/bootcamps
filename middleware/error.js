const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  let error = {
    ...err
  };
  error.message = err.message;

  // Log to console for dev
  console.log(err);
  // mongoose vaidation ObjectID

  if (err.name === 'CastError') {
    const message = `Resource tidak tersedia dengan id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose Duplicate Keys
  if (err.code === 11000) {
    const message = 'duplicate of Resource already exist';
    error = new ErrorResponse(message, 400);
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',

  })
}

module.exports = errorHandler