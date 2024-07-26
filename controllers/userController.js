const { User } = require('../models');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ name, email, password: hashedPassword });
        req.session.userId = user.id;
        res.redirect('/');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'email veya parola yanlış' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'email veya parola yanlış' });
        }

        req.session.userId = user.id;
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

module.exports = { register, login, logout };