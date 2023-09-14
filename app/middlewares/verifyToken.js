const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = function(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ status: "Access denied. No token provided.", status_code: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ status: "Invalid token.", status_code: 400 });
    }
}
