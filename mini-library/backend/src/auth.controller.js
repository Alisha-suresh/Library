const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./db-config');

const JWT_SECRET = process.env.JWT_SECRET || 'TeHAFeK1VmH/UrIdl8gdhTXfYt6I/As2jF4o5S6+lklpaqjIXAXuQDoKX3x85zUZ1skr69GT/FWw6B/pyoz54g==';

async function register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const connection = await pool.getConnection();
        try {
            // Check if user exists
            const [existingUsers] = await connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password and create user
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await connection.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );

            res.status(201).json({
                message: 'User created successfully',
                user: { id: result.insertId, name, email }
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const connection = await pool.getConnection();
        try {
            const [users] = await connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    name: user.name
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
}

module.exports = { register, login };
