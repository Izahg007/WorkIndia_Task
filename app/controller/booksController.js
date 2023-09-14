const mysql = require('mysql2');
const connection = require('../config/db');

exports.addBook = (req, res) => {
    const { title, author, isbn } = req.body;

    const query = 'INSERT INTO Books (title, author, isbn) VALUES (?, ?, ?)';
    connection.query(query, [title, author, isbn], (error, results) => {
        if (error) {
            return res.status(500).json({
                status: "Error",
                message: "Failed to add book"
            });
        }

        res.status(200).json({
            message: "Book added successfully",
            book_id: results.insertId
        });
    });
};
