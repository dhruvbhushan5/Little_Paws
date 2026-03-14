const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


const verifyRole = (allowedRole) => {
    return async (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user!",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
            const userId = decoded.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(403).json({
                    success: false,
                    message: "User does not exist. Please register first!",
                });
            }

            if (user.role !== allowedRole) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Only ${allowedRole} can access this resource.`,
                });
            }

            req.user = {
                id: user._id,
                email: user.email,
                role: user.role,
            };

            next(); 
        } catch (error) {
            console.error("JWT verification error:", error.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token. Please log in again.",
            });
        }
    };
};

module.exports = {
    verifyUser: verifyRole('user'),
    verifyShelterAdmin: verifyRole('shelterAdmin'),
};
