const express = require('express');
const router = express.Router();
const bookController = require('../controller/booksController');
const verifyAdminKey = require('../middlewares/verifyAdminKey');
const verifyToken = require("../middlewares/verifyToken");

router.post('/create', verifyAdminKey, bookController.addBook);
router.get('', bookController.searchByTitle);
router.get('/:book_id/availability', bookController.getBookAvailability);
router.post('/borrow', verifyToken, bookController.borrowBook);


module.exports = router;
