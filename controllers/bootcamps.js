const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');
// @descr    get all bootcamps
// @routes   GET /api/v1/bootcamps
// @acces    Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
  //console.log(req.query);
  res.status(200).json(res.advancedSearch);
});
// @descr    get Single bootcamps
// @routes   GET /api/v1/bootcamps/:id
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
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp tidak tersedia  ${req.params.id}`, 404));
  }
  bootcamp.remove();
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
// @descr    upload photo for bootcamp
// @routes   PUT /api/v1/bootcamp/:id/photo
// @acces    Private

exports.bootcampUpload = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp tidak tersedia  ${req.params.id}`, 404));
  }
  // MAke sure user upload photo
  if (!req.files) {
    return next(new ErrorResponse(`Please upload Photo`, 400));
  }

  const file = req.files.file;


  // make sure is start with image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image`, 400));
  }
  // makes sure the size is right
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload the size ${process.env.MAX_FILE_UPLOAD}`, 400));

  }
  // custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with upload an image`, 500));

    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name
    });
    res.status(200).json({
      success: true,
      data: file.name

    })
  })
});