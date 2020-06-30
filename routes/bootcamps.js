const express = require('express');
const {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsRadius,
  bootcampUpload
} = require('../controllers/bootcamps.js');

const Bootcamp = require('../models/Bootcamp');
const advancedSearch = require('../middleware/advancedSearch');

const router = express.Router();
// include other resource routers
const courseRouter = require('./courses');

// Pass THis route to other resource
router.use('/:bootcampId/courses', courseRouter);


router.route('/:id/photo').put(bootcampUpload)
router.route('/radius/:zipcode/:distance').get(getBootcampsRadius);
router.route('/').get(advancedSearch(Bootcamp, 'courses'), getAllBootcamps).post(createBootcamp);
router.route('/:id').get(getSingleBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;