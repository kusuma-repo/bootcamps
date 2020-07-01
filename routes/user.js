const express = require('express');
const {
  registerUser,
  loginUser,
  logedUser
} = require('../controllers/auth');
const {
  security,
  authorizations
} = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getme', security, logedUser)


module.exports = router;