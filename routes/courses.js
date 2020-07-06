const express = require('express');
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses.js');
const Courses = require('../models/Courses');

const router = express.Router({
  mergeParams: true
});
const advancedSearch = require('../middleware/advancedSearch');
const {
  security,
  authorizations
} = require('../middleware/auth');
router.route('/').get(advancedSearch(Courses, {
  path: 'bootcamp',
  select: 'name description'
}), getCourses).post(security, authorizations('publisher', 'admin'), addCourse);
router.route('/:id').get(getCourse)
  .put(security, authorizations('publisher', 'admin'), updateCourse)
  .delete(security, authorizations('publisher', 'admin'), deleteCourse)

module.exports = router;