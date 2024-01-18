const { body } = require('express-validator');
const Chirp = require('../models/Chirp');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.newMessageGet = (req, res, next) => {
  res.render('newMessage', { user: req.user });
};

exports.newMessagePost = [
  body('message', 'Message must not be empty.').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('newMessage', { user: req.user, errors: errors.array() });
      return;
    }

    const user = await User.findById(req.user._id);

    const chirp = new Chirp({
      message: req.body.message,
      user: user,
    });

    await chirp.save();
    res.redirect('/');
  }),
];

exports.deleteMessagePost = asyncHandler(async (req, res, next) => {
  console.log('Deleting message...');
  await Chirp.findByIdAndDelete(req.body.messageId);
  console.log('Message deleted.');
  res.redirect('/');
});
