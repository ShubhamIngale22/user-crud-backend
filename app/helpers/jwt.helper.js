const jwt = require('jsonwebtoken');

module.exports = {

    generateToken: (payload, expiry = process.env.JWT_EXPIRE || '1d') => {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: expiry }
        );
    },
    verifyToken: (token) => {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
};
