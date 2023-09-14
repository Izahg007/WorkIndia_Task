const mysql = require('mysql2');
const connection = require('../config/db');

// Adding a book endpoint
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

//Searching a book by name endpoint
exports.searchByTitle = (req, res) => {
    const title = req.query.title;

    if (!title) {
        return res.status(400).json({
            status: 'Error',
            message: 'Title query parameter is required.'
        });
    }

    const searchQuery = `%${title}%`; // Use wildcards to search anywhere within the string
    connection.query('SELECT * FROM Books WHERE title LIKE ?', [searchQuery], (err, results) => {
        if(err) {
            return res.status(500).json({
                status: 'Error',
                message: 'Server Error.'
            });
        }
        return res.status(200).json({
            results
        });
    });
}

//Book availability endpoint
exports.getBookAvailability = (req, res) => {
    const bookId = req.params.book_id;

    connection.query('SELECT * FROM Books WHERE book_id = ?', [bookId], (err, bookResults) => {
        if(err) {
            return res.status(500).json({
                status: 'Error',
                message: 'Server Error.'
            });
        }
        if (!bookResults.length) {
            return res.status(404).json({
                status: 'Error',
                message: 'Book not found.'
            });
        }

        // Then, check the book's availability in the Bookings table
        connection.query('SELECT * FROM Bookings WHERE book_id = ? ORDER BY return_time DESC LIMIT 1', [bookId], (err, bookingResults) => {
            if(err) {
                return res.status(500).json({
                    status: 'Error',
                    message: 'Server Error.'
                });
            }

            const bookData = {
                book_id: bookResults[0].id,
                title: bookResults[0].title,
                author: bookResults[0].author,
                available: true
            };

            if (bookingResults.length && new Date(bookingResults[0].return_time) > new Date()) {
                // If the book is currently booked and the return time is in the future
                bookData.available = false;
                bookData.next_available_at = bookingResults[0].return_time;
            }

            return res.status(200).json(bookData);
        });
    });
}
