const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.userId) {
    return res.redirect('/rewards');
  }
  res.render('index', { title: 'Daily Rewards' });
});

module.exports = router;
