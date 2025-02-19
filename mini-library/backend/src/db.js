const mysql = require('mysql2');
require('dotenv').config();

console.log('Database Configuration:', {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'bookstore',
    // Don't log the actual password
    hasPassword: !!process.env.DB_PASSWORD
});


// Create a connection to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',        // Host name (localhost or your DB server)
    user: process.env.DB_USER || 'root',             // Your MySQL username (root or your username)
    password: process.env.DB_PASSWORD || '', // Your MySQL password
    database: process.env.DB_NAME || 'bookstore',   // Your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Successfully connected to the database.');
    connection.release();
});

module.exports = pool.promise();
