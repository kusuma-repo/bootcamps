const express = require('express');
const {
  getReviews,
  getBootcampReviews,
  addReview,
  updateReview,
  deleteReview

} = require('../controllers/reviews.js');
const Review = require('../models/Reviews');

const router = express.Router({
  mergeParams: true
});
const advancedSearch = require('../middleware/advancedSearch');
const {
  security,
  authorizations
} = require('../middleware/auth');
router.route('/').get(advancedSearch(Review, {
  path: 'bootcamp',
  select: 'name description'
}), getReviews).post(security, authorizations('user', 'admin'), addReview)

router.route('/:id').get(getBootcampReviews).put(security, authorizations('user', 'admin'), updateReview)
  .delete(security, authorizations('user', 'admin'), deleteReview)

module.exports = router;