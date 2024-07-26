const express = require('express');
const router = express.Router();
const { getDays, collectReward } = require('../controllers/rewardController');
const { authenticate } = require('../middleware/authenticate');

router.get('/', authenticate, getDays);
router.post('/collect', authenticate, collectReward);
router.get('/collect', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/rewards');
    } else {
        return res.redirect('/');
    }
});
module.exports = router;