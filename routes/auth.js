const express = require('express');
const {
  registerUser,
  loginUser,
  logoutdUser,
  logedUser,
  forgotPassword,
  resetPassword,
  detailUser,
  updatePassword
} = require('../controllers/auth');
const {
  security,
  authorizations
} = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getme', security, logedUser);
router.get('/logout', logoutdUser)
router.put('/updatedetails', security, detailUser);
router.put('/updatepassword', security, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetPassword/:resettoken', resetPassword);

module.exports = router;