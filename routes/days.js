const express = require('express');
const router = express.Router();
const { getDaysList } = require('../controllers/dayController');
const { authenticate } = require('../middleware/authenticate');

router.get('/', authenticate, getDaysList);

module.exports = router;