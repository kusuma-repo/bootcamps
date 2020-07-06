const Review = require('../models/Reviews');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @descr    get all Reviews
// @routes   GET /api/v1/Corses
// @routes   GET /api/v1/bootcamps/:bootcampId/review
// @acces    Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const review = await Review.find({
      bootcamp: req.params.bootcampId
    });
    return res.status(200).json({
      success: true,
      count: review.length,
      data: review
    })
  } else {
    res.status(200).json(res.advancedSearch);
  }
});

// @desc      Get single review
// @route    GET /api/v1/reviews/:id
// @acces    Public

exports.getBootcampReviews = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'nama description'
  });
  if (!review) {
    return next(new ErrorResponse(`Bootcamp tidak tersedia  ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});


// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse(`bootcamp tidak tersedia dengan id ${req.params.bootcampId}`, 404));
  }

  const review = await Review.create(req.body);
  res.status(200).json({
    success: true,
    data: review
  });
});

// @descr    Update Single Reviews
// @routes   GET /api/v1/Corses
// @routes   GET /api/v1/reviews/:id
// @acces    Private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`reviews tidak tersedia dengan id ${req.params.id}`, 404));
  }
  if (review.user.toString() !== req.user.id && req.user.roles !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: review
  });
});
// @descr    Delete Single Reviews
// @routes   GET /api/v1/Corses
// @routes   GET /api/v1/reviews/:id
// @acces    Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`reviews tidak tersedia dengan id ${req.params.id}`, 404));
  }
  if (review.user.toString() !== req.user.id && req.user.roles !== 'admin') {
    return next(new ErrorResponse(`Not authorized to Delete review`, 401));
  }
  await review.remove();
  res.status(200).json({
    success: true,
    data: {}
  });
});