const express = require('express');
const {
  getAllBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsRadius
} = require('../controllers/bootcamps.js');
const router = express.Router();
// include other resource routers
const courseRouter = require('./courses');

// Pass THis route to other resource
router.use('/:bootcampId/courses', courseRouter);



router.route('/radius/:zipcode/:distance').get(getBootcampsRadius);
router.route('/').get(getAllBootcamps).post(createBootcamp);
router.route('/:id').get(getSingleBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;