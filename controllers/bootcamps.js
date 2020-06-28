const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
// @descr    get all bootcamps
// @routes   GET /api/v1/bootcamps
// @acces    Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
  //console.log(req.query);
  let query;
  // copy query string
  const reqQuery = {
    ...req.query
  };
  // FIeld will exclude
  const removeFields = ['select', 'sort']
  // loop over removedFields aand delete from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  console.log(reqQuery);
  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  query = Bootcamp.find(JSON.parse(queryStr));

  // select FIeld
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);

  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);

  } else {
    query = query.sort('-createdAt')
  }

  const bootcamps = await query;
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,

  });
});
// @descr    get Single bootcamps
// @routes   GET /api/v1/bootcamps
// @acces    Public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp tidak tersedia  ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });

});
// @descr    Create New bootcamp
// @routes   GET /api/v1/bootcamps
// @acces    Public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
})
// @descr    update single bootcamps
// @routes   GET /api/v1/bootcamps/:id
// @acces    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp tidak tersedia  ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });

})
// @descr    get all bootcamps
// @routes   GET /api/v1/bootcamps/:id
// @acces    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findOneAndDelete(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp tidak tersedia  ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: {
      msg: "success deleted bootcamp"
    }
  });
})

// @descr    get  bootcampsInRadius
// @routes   GET /api/v1/bootcamps/:zipcode/:distance
// @acces    Public
exports.getBootcampsRadius = asyncHandler(async (req, res, next) => {
  const {
    zipcode,
    distance
  } = req.params;
  // get long/latitude
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lang = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [lang, lat], radius
        ]
      }
    }
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps

  })
});