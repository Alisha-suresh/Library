const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function updatePassword() {
    let connection;
    try {
        // Create database connection
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'bookstore'
        });

        // Hash the password
        const password = 'password123';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('Password hashed successfully');

        // Update user's password in database
        const email = 'ali.sur@gmail.com';
        const [result] = await connection.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        if (result.affectedRows > 0) {
            console.log('Password updated successfully in database');
        } else {
            console.log('No user found with that email');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run the function
updatePassword();