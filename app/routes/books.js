const express = require('express');
const router = express.Router();
const bookController = require('../controller/booksController');
const verifyAdminKey = require('../middlewares/verifyAdminKey');

router.post('/create', verifyAdminKey, bookController.addBook);

module.exports = router;
