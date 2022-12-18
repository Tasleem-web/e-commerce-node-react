const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
    register: async (req, res) => {
        try {
            // Need to remove role here its restricted only for admin or super admin
            const { name, email, password, role = 0, cart = [] } = req.body;
            const user = await userModel.findOne({ email });
            if (user) return res.status(400).json({ message: 'The email is already exist.' });

            if (password.length < 6) return res.status(400).json({ message: 'Password should be at least 6 character long.' });

            // Password Encryption

            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({
                name, email, password: hashPassword, role, cart
            })

            // save into mongodb
            await newUser.save();

            // then create token to authentication
            const accessToken = createAccessToken({ id: newUser._id });
            const refreshToken = createRefreshToken({ id: newUser._id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/users/refresh_token'
            })

            // return res.status(201).json({ accessToken });
            return res.status(201).json({ message: 'Register Success!', accessToken });

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) return res.status(500).json({ message: "User doesn't exists." });

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) return res.status(500).json({ message: "Incorrect Username or Password." });

            const accessToken = createAccessToken({ id: user.id });
            const refreshToken = createRefreshToken({ id: user.id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/users/refresh_token'
            })

            return res.status(200).json({ message: 'Login Success!', accessToken })

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshToken', { path: '/users/refresh_token' });
            return res.status(200).json({ message: 'Logged Out' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken;
            if (!rf_token) return res.status(400).json({ message: 'Please login or Register' });
            jwt.verify(rf_token, process.env.REFRESH_ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ message: 'Please login or Register' });
                const accessToken = createAccessToken({ id: user.id })
                return res.json({ user, accessToken })

            })
        } catch (error) {
            return res.status(500).json({ message: error.message });

        }

    },
    getUsers: async (req, res) => {
        try {
            const user = await userModel.findById(req.user.id);
            if (!user) return res.status(400).json({ message: `User doesn't exists` });

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

const createAccessToken = (userId) => {
    return jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = (userId) => {
    return jwt.sign(userId, process.env.REFRESH_ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl;