const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./app/routes/auth');
const bookRoutes = require('./app/routes/books');
dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
