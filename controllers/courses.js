const Course = require('../models/Courses');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @descr    get all Corses
// @routes   GET /api/v1/Corses
// @routes   GET /api/v1/bootcamps/:bootcampId/course
// @acces    Public

exports.getCourses = asyncHandler(async (req, res, next) => {

  let query;
  if (req.params.bootcampId) {
    query = Course.find({
      bootcamp: req.params.bootcampId
    });
  } else {
    query = Course.find();
  }

  const course = await query;

  res.status(200).json({
    success: true,
    count: course.length,
    data: course
  })

})