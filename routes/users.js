const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users.js');
const User = require('../models/User');
const router = express.Router({
  mergeParams: true
});
const advancedSearch = require('../middleware/advancedSearch');
const {
  security,
  authorizations
} = require('../middleware/auth');

router.use(security);
router.use(authorizations('admin'));

router
  .route('/')
  .get(advancedSearch(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;