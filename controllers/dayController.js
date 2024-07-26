const { Reward } = require('../models');
const moment = require('moment');

const getDaysList = async (req, res) => {
    const userId = req.session.userId;

    try {
        const rewards = await Reward.findAll({ where: { userId }, order: [['day', 'ASC']] });

        const daysList = rewards.map(reward => ({
            title: `Day ${reward.day}`,
            state: reward.state,
            claimStartDate: moment(reward.claimStartDate).format('YYYY-MM-DD HH:mm:ss'),
            claimEndDate: moment(reward.claimEndDate).format('YYYY-MM-DD HH:mm:ss'),
            coin: reward.coin
        }));

        return res.status(200).json(daysList);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'hata oluştu.' });
    }
};

module.exports = { getDaysList };