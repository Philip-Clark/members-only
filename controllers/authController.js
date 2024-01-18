const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

exports.loginGet = function (req, res) {
  res.render('login', { user: req.user });
};

exports.loginPost = [
  body('username', 'Username must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password must not be empty.').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('login', { user: req.user, errors: errors.array() });
      return;
    }
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.render('login', { user: req.user, failureMessage: info.message });
        return;
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    })(req, res, next);
  }),
];
exports.signupGet = function (req, res) {
  res.render('signup', { user: req.user });
};

exports.signupPost = [
  asyncHandler(async (req, res, next) => {
    const duplicate = await User.findOne({ username: req.body.username });
    if (duplicate) {
      res.render('signup', { user: req.user, errors: [{ msg: 'Username already exists.' }] });
      return;
    }
  }),
  body('username', 'Username must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('passwordConfirmation', 'Password confirmation must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('passwordConfirmation', 'Passwords must match.')
    .custom((value, { req }) => value === req.body.password)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('signup', { user: req.user, errors: errors.array() });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      const user = new User({
        username: req.body.username,
        password: hash,
        roles: [await Role.findOne({ name: 'user' })],
      });

      await user.save();
      setTimeout(() => {}, 0);
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  }),
];

exports.logout = function (req, res, next) {
  req.logout((err) => {
    return next(err);
  });
  res.redirect('/');
};
