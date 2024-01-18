var express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const Chirp = require('../models/Chirp');
const User = require('../models/User');
var router = express.Router();

//* HOME
router.get('/', async (req, res, next) => {
  const chirps = await Chirp.find()
    .populate({ path: 'user', populate: { path: 'roles', select: 'name' } })
    .exec();
  const user = await User.findOne(req.user).populate('roles').exec();
  res.render('index', { user: user, chirps: chirps });
});

//* LOGIN
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);

//* SIGNUP
router.get('/signup', authController.signupGet);
router.post('/signup', authController.signupPost);

//* LOGOUT
router.post('/logout', authController.logout);

//* NEW MESSAGE
router.get('/newMessage', messageController.newMessageGet);
router.post('/newMessage', messageController.newMessagePost);
router.post('/deleteMessage', messageController.deleteMessagePost);

// //* USER PROFILE
router.get('/profile', userController.profileGet);
router.post('/profile/update', userController.profileUpdateGet);
router.post('/profile/update', userController.profileUpdatePost);
router.post('/profile/secret', userController.profileSecretPost);
module.exports = router;
