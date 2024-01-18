const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Role = require('../models/Role');
const asyncHandler = require('express-async-handler');

exports.profileGet = asyncHandler(async (req, res, next) => {
  const user = await User.findOne(req.user).populate('roles').exec();

  res.render('profile', { user: user });
});

exports.profileUpdateGet = (req, res, next) => {
  res.render('profileUpdate', { user: req.user });
};

exports.profileUpdatePost = [];

exports.profileSecretPost = [
  body('secret', 'Secret must not be empty.').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('profile', { user: req.user, secretErrors: errors.array() });
      return;
    }

    const match = await Role.findOne({ password: req.body.secret });
    if (!match) {
      res.render('profile', { user: req.user, secretErrors: [{ msg: 'Secret is invalid.' }] });
      return;
    }

    const duplicate = await User.findOne({ _id: req.user._id, roles: match });
    if (duplicate) {
      res.render('profile', { user: req.user, secretErrors: [{ msg: 'Role already applied' }] });
      return;
    }

    console.log('Secret is valid');

    const user = new User({ ...req.user, _id: req.user._id, roles: [match, ...req.user.roles] });
    await User.findByIdAndUpdate(req.user._id, user, {});
    res.locals.currentUser = user;
    res.redirect('back');
  }),
];
