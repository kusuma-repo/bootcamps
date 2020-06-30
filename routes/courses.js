const express = require('express');
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses.js');
const Courses = require('../models/Courses');
const advancedSearch = require('../middleware/advancedSearch');
const router = express.Router({
  mergeParams: true
});
router.route('/').get(advancedSearch(Courses, {
  path: 'bootcamp',
  select: 'name description'
}), getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router;