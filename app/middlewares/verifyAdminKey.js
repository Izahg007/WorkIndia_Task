require('dotenv').config();
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

const verifyAdminKey = (req, res, next) => {
    const apiKey = req.header('X-Admin-API-Key');

    if (!apiKey || apiKey !== ADMIN_API_KEY) {
        return res.status(403).json({
            status: "Access denied",
            message: "Invalid API key"
        });
    }

    next();
}

module.exports = verifyAdminKey;
