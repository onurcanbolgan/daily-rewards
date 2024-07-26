const { Reward, User } = require('../models');
const moment = require('moment');

///ödülleri başlatma fonksiyonu
const initializeRewards = async (userId) => {
    const initialRewards = [];
    for (let i = 1; i <= 7; i++) {
        initialRewards.push({
            day: i,
            state: i === 1 ? 1 : 0,
            claimStartDate: moment().startOf('day').add(i - 1, 'days').toDate(),
            claimEndDate: moment().endOf('day').add(i - 1, 'days').toDate(),
            coin: i * 5 + 5,
            userId
        });
    }
    await Reward.bulkCreate(initialRewards);
    return await Reward.findAll({ where: { userId }, order: [['day', 'ASC']] });
};

// ödülleri başlatma ve mevcut ödülleri getirme fonksiyonu
const getDays = async (req, res) => {
    const userId = req.session.userId;

    let rewards = await Reward.findAll({ where: { userId }, order: [['day', 'ASC']] });

    // ueni kullanıcı için ödülleri başlat
    if (rewards.length === 0) {
        rewards = await initializeRewards(userId);
    }

    // günlük kontrol ve sıfırlama
    const now = moment();
    const collectedRewards = rewards.filter(reward => reward.state === 2);
    const activeReward = rewards.find(reward => reward.state === 1);

    if (collectedRewards.length > 0) {
        // state değeri 2 olan son ödülü bul
        const lastCollectedReward = collectedRewards.sort((a, b) => moment(b.claimEndDate).diff(moment(a.claimEndDate)))[0];
        const lastCollectedDate = moment(lastCollectedReward.claimEndDate).startOf('day');
        if (now.isAfter(lastCollectedDate.add(1, 'day').endOf('day'))) {
            await Reward.destroy({ where: { userId } });
            rewards = await initializeRewards(userId);
        }
    } else if (activeReward && now.isAfter(moment(activeReward.claimEndDate))) {
        // Eğer aktif ödülün toplama süresi dolduysa sıfırla
        await Reward.destroy({ where: { userId } });
        rewards = await initializeRewards(userId);
    }

    // Ödüllerin toplanabilir olup olmadığını kontrol et ve saat bilgisi ekle
    const modifiedRewards = rewards.map(reward => {
        const claimStart = moment(reward.claimStartDate);
        const claimEnd = moment(reward.claimEndDate);
        reward.isCollectible = now.isBetween(claimStart, claimEnd);
        reward.hoursUntilCollectible = claimStart.diff(now, 'hours');
        return reward;
    });

    const newActiveReward = modifiedRewards.find(reward => reward.state === 1);

    res.render('rewards', { rewards: modifiedRewards, activeReward: newActiveReward });
};

// Ödül toplama fonksiyonu
const collectReward = async (req, res) => {
    const { dayIndex } = req.body;
    const userId = req.session.userId;

    const reward = await Reward.findOne({ where: { userId, day: parseInt(dayIndex) } });

    if (!reward) {
        return res.status(400).json({ status: 'error', message: 'Vakti gelmemiş gün için ödül toplanamaz.' });
    }

    const now = moment();
    const claimStart = moment(reward.claimStartDate);
    const claimEnd = moment(reward.claimEndDate);

    if (now.isBefore(claimStart) || now.isAfter(claimEnd)) {
        return res.status(400).json({ status: 'error', message: 'Bu gün için ödül zamanı geçerli değil.' });
    }

    if (reward.state === 2) {
        return res.status(400).json({ status: 'error', message: 'Bugün için ödül zaten toplandı.' });
    }

    reward.state = 2;
    await reward.save();

    // Sonraki günün ödülünü aktifleştir
    if (parseInt(dayIndex) < 7) {
        const nextReward = await Reward.findOne({ where: { userId, day: parseInt(dayIndex) + 1 } });
        if (nextReward) {
            nextReward.state = 1; // Sonraki günün state durumunu 1 yap
            await nextReward.save();
        }
    } else if (parseInt(dayIndex) === 7) {
        // 7. gün ödülü toplandıysa döngüyü başa al
        await Reward.destroy({ where: { userId } });
        await initializeRewards(userId);
    }

    return res.status(200).json({ status: 'success', message: 'Ödül başarıyla toplandı.' });
};

module.exports = { getDays, collectReward };