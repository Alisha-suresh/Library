const express = require('express');
const router = express.Router();
const connection = require('./db');

// API to fetch books
router.get('/books', (req, res) => {
    const searchQuery = req.query.title || '';
    connection.execute('SELECT * FROM books WHERE title LIKE ?', [`%${searchQuery}%`], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
