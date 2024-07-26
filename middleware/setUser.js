const { User } = require('../models');

const setUser = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await User.findByPk(req.session.userId);
            res.locals.user = user;
        } catch (error) {
            console.error('Error setting user:', error);
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
};

module.exports = setUser;