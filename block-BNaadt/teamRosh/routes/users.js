var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  var error = req.flash('error')[0];
  console.log(error);
  res.render('form', { error });
});

function createUser(req, res, next) {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/login');
  });
}
router.post('/register', (req, res, next) => {
  console.log(req.body);
  var { email, password, age, phone } = req.body;
  console.log(req.body);
  if (email) {
    User.findOne({ email }, (err, user) => {
      if (err) return next(err);
      if (!user) {
        if (password.length <= 4) {
          req.flash('error', 'Password is Short');
          return res.redirect('/users/register');
        } else if (age < 18) {
          req.flash('error', 'Age is below 18 your are not able sign in');
          return res.redirect('/users/register');
        } else if (phone.length < 10) {
          req.flash('error', 'Invalid Phone Number');
          return res.redirect('/users/register');
        } else if (!email.includes('@')) {
          req.flash('error', 'Email requires @ symbol');
          return res.redirect('/users/register');
        } else {
          return createUser(req, res);
        }
      } else {
        req.flash(
          'error',
          'This email is already registered, please login here'
        );
        return res.redirect('/users/login');
      }
    });
  } else {
    req.flash('error', 'Email Required');
    return res.redirect('/users/register');
  }
});

router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  console.log(error);
  res.render('login', { error });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    req.flash('error', 'Email/password required');
    res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) next(err);
    //No User
    if (!user) {
      req.flash('error', 'User not found!!!');
      return res.redirect('/users/login');
    }
    //user & Compare password
    user.verifyPassword(password, (err, result) => {
      console.log(err, result);
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Password incorrext !');
        return res.redirect('/users/login');
      }
      // persist logged in user information
      req.session.userId = user.id;
      res.redirect('/users');
    });
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});
module.exports = router;
