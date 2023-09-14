const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const connection = require('../config/db');

exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    connection.query('SELECT * FROM Users WHERE username = ?', [username], async (error, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query('INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)', 
            [username, hashedPassword, email, 'USER'], 
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: "Server error" });
                }

                res.status(200).json({
                    status: "Account successfully created",
                    status_code: 200,
                    user_id: results.insertId
                });
        });

    });
};

exports.loginUser = (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM Users WHERE username = ?', [username], async (error, results) => {
        if (error || results.length === 0) {
            return res.status(401).json({ status: "Incorrect username/password provided. Please retry", status_code: 401 });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ status: "Incorrect username/password provided. Please retry", status_code: 401 });
        }

        const token = jwt.sign({ userId: user.user_id, username: user.username, role: user.role }, process.env.SECRET_KEY);

        res.status(200).json({
            status: "Login successful",
            status_code: 200,
            user_id: user.user_id,
            access_token: token
        });
    });
};
