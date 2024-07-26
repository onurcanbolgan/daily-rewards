const authenticate = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    next();
};

module.exports = { authenticate };