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

const {
  security,
  authorizations
} = require('../middleware/auth');
// include other resource routers
const courseRouter = require('./courses');
const reviewsRouter = require('./reviews');

// Pass THis route to other resource
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewsRouter);


router.route('/:id/photo').put(security, authorizations('publisher', 'admin'), bootcampUpload)
router.route('/radius/:zipcode/:distance').get(getBootcampsRadius);
router.route('/').get(advancedSearch(Bootcamp, 'courses'), getAllBootcamps).post(security, authorizations('publisher', 'admin'), createBootcamp);
router.route('/:id').get(getSingleBootcamp)
  .put(security, authorizations('publisher', 'admin'), updateBootcamp)
  .delete(security, authorizations('publisher', 'admin'), deleteBootcamp);

module.exports = router;