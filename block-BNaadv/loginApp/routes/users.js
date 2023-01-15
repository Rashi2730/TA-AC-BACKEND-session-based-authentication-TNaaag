var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('index');
});

router.get('/register', (req, res, next) => {
  var error = req.flash('error')[0];
  console.log(error);
  res.redirect('register', { error });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/register');
  });
});

module.exports = router;
