const express = require('express');
const router = express.Router();
const bookController = require('../controller/booksController');
const verifyAdminKey = require('../middlewares/verifyAdminKey');

router.post('/create', verifyAdminKey, bookController.addBook);
router.get('', bookController.searchByTitle);
router.get('/:book_id/availability', bookController.getBookAvailability);



module.exports = router;
