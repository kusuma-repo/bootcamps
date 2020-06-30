const Course = require('../models/Courses');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @descr    get all Corses
// @routes   GET /api/v1/Corses
// @routes   GET /api/v1/bootcamps/:bootcampId/course
// @acces    Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const course = await Course.find({
      bootcamp: req.params.bootcampId
    });
    return res.status(200).json({
      success: true,
      count: course.length,
      data: course
    })
  } else {
    res.status(200).json(res.advancedSearch);
  }
});

// @descr    get all Corses
// @routes   GET /api/v1/Corses/:id
// @acces    Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'nama description'
  });
  if (!course) {
    return next(new ErrorResponse(`Course tidak tersedia  ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: course
  });
});


// @descr    Add  Corses
// @routes   GET /api/v1/bootcamps/:bootcampId/courses
// @acces    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({
    path: 'bootcamp',
    select: 'name description'
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`bootcamp tidak tersedia  ${req.params.bootcampId}`, 404));
  }
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course
  });
});
// @descr    Update  Courses
// @routes   PUT /api/v1/course/:id
// @acces    Private

exports.updateCourse = asyncHandler(async (req, res, next) => {

  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Courses tidak tersedia  ${req.params.bootcampId}`, 404));
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @descr    Delete  Courses
// @routes   PUT /api/v1/course/:id
// @acces    Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {

  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Courses tidak tersedia  ${req.params.bootcampId}`, 404));
  }
  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});