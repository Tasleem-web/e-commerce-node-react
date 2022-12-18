const userModel = require('../models/userModel');

const userAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);

        if (user.role === 0) return res.status(500).json({ message: "Admin resources access denied" });

        next();

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = userAdmin;