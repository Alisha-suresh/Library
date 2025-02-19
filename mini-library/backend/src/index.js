const express = require("express");
const mysql = require("mysql2/promise");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require('cors');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:4200', // Allow frontend requests
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Add user info to request object
        next();  // Proceed with the request
    } catch (error) {
        console.log("Token verification failed:", error);  // Log error details for debugging
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
// Login route to authenticate user and generate JWT token
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Basic validation (you can enhance this part with real user validation)
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    try {
        const connection = await pool.getConnection();
        const [users] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = users[0];  // Assuming the user exists

        // Compare password with the hashed one in the database
        const isMatch = await bcrypt.compare(password, user.password);  // Compare entered password with hashed password in DB

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // If password is correct, generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error during login" });
    }
});


// SEARCH functionality with pagination
// SEARCH functionality without pagination
// SEARCH functionality without pagination
app.get("/fetch-books", verifyToken, async (req, res) => {
    const { title } = req.query;

    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            console.log(`Checking database for books matching: ${title}`);
            const [existingBooks] = await connection.query(
                `SELECT b.*, GROUP_CONCAT(l.name) as locations
                 FROM books b
                 LEFT JOIN book_locations bl ON b.id = bl.book_id
                 LEFT JOIN locations l ON bl.location_id = l.id
                 WHERE b.title LIKE ?
                 GROUP BY b.id`,
                [`%${title}%`]
            );

            if (existingBooks.length > 0) {
                console.log(`✅ Found ${existingBooks.length} books in database.`);
                await connection.commit();

                return res.json({
                    message: "Books fetched from database",
                    books: existingBooks.map(book => ({
                        ...book,
                        location: book.locations ? book.locations.split(',') : []
                    }))
                });
            }

            console.log(`❌ No books in database, fetching from API: ${title}`);
            let books = await fetchGoogleBooks(title);  // Fetch books from API without pagination

            for (const book of books) {
                const [bookResult] = await connection.query(
                    `INSERT INTO books (title, author, format, availability, source_id) 
                     VALUES (?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE 
                     format=VALUES(format), 
                     availability=VALUES(availability)`,
                    [book.title, book.author, book.format, book.availability, book.source_id]
                );

                const bookId = bookResult.insertId || (
                    await connection.query(`SELECT id FROM books WHERE source_id = ?`, [book.source_id])
                )[0][0].id;

                if (book.location.length > 0) {
                    const locationValues = book.location.map(loc => [loc]);
                    await connection.query(`INSERT IGNORE INTO locations (name) VALUES ?`, [locationValues]);

                    const [locationRows] = await connection.query(
                        `SELECT id, name FROM locations WHERE name IN (?)`,
                        [book.location]
                    );

                    const bookLocationValues = locationRows.map(loc => [bookId, loc.id]);
                    await connection.query(`INSERT IGNORE INTO book_locations (book_id, location_id) VALUES ?`, [bookLocationValues]);
                }
            }

            await connection.commit();
            console.log(`✅ API books stored in database successfully.`);

            res.json({ message: "Books fetched from API", books });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching book data" });
    }
});

// Fetch book data from external APIs without pagination
async function fetchGoogleBooks(title) {
    console.log(`🌍 Fetching books from Google Books API for title: "${title}"`);
    const googleResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}`);  // Removed pagination

    let books = [];

    if (googleResponse.data.items) {
        for (let item of googleResponse.data.items) {
            const bookInfo = item.volumeInfo;
            const saleInfo = item.saleInfo || {};
            let locations = [];

            // Fetch UK library locations
            console.log(`📚 Checking UK library availability for: "${title}"`);
            const ukLibraries = await fetchUKLibraries(title);
            if (ukLibraries.length > 0) {
                locations.push(...ukLibraries.map(lib => `${lib.library_name}, ${lib.city}`));
            }

            // Check Project Gutenberg availability
            console.log(`🔎 Checking Project Gutenberg availability for: "${title}"`);
            const gutenbergResponse = await fetchGutenbergAvailability(bookInfo.title);
            if (gutenbergResponse) {
                locations.push("Available on Project Gutenberg");
            }

            // Check Amazon Kindle availability
            if (saleInfo.saleability === "FOR_SALE" && saleInfo.isEbook) {
                locations.push("Available on Amazon Kindle");
            }

            books.push({
                title: bookInfo.title,
                author: bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown",
                format: determineFormat(saleInfo, gutenbergResponse),
                location: locations,
                availability: determineAvailability(saleInfo, gutenbergResponse),
                source_id: item.id
            });
        }
    }
    console.log(`✅ Google Books API fetch complete.`);
    return books;
}

// Determine format
function determineFormat(saleInfo, isOnGutenberg) {
    if (saleInfo.saleability === "FOR_SALE" && saleInfo.isEbook) {
        return "ebook";
    }
    if (isOnGutenberg) {
        return "online";
    }
    return "offline";
}

// Determine availability
function determineAvailability(saleInfo, isOnGutenberg) {
    return saleInfo.saleability === "FOR_SALE" || isOnGutenberg;
}

// Check Project Gutenberg
async function fetchGutenbergAvailability(title) {
    try {
        console.log(`🔍 Checking Gutenberg for: "${title}"`);
        const gutenbergResponse = await axios.get(`https://www.gutenberg.org/ebooks/search/?query=${title}`);
        return gutenbergResponse.status === 200;
    } catch (error) {
        console.error("❌ Error checking Project Gutenberg:", error);
        return false;
    }
}

// Fetch UK libraries (mocked)
async function fetchUKLibraries(bookTitle) {
    return [
        { library_name: "British Library", city: "London" },
        { library_name: "Manchester Central Library", city: "Manchester" }
    ];
}

// Bookmark a book
app.post("/bookmark", verifyToken, async (req, res) => {
    const { user_id, book_id } = req.body;
    if (!user_id || !book_id) return res.status(400).json({ message: "User ID and Book ID required" });

    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 🔹 Check if the bookmark already exists
            const [existing] = await connection.query(
                "SELECT * FROM bookmarks WHERE user_id = ? AND book_id = ?",
                [user_id, book_id]
            );

            if (existing.length > 0) {
                console.log(`✅ User ${user_id} already bookmarked book ${book_id}`);
                await connection.commit();
                return res.status(200).json({ message: "Book already bookmarked" });
            }

            // 🔹 Insert new bookmark
            await connection.query("INSERT INTO bookmarks (user_id, book_id) VALUES (?, ?)", [user_id, book_id]);
            await connection.commit();

            console.log(`✅ Book ${book_id} bookmarked successfully by user ${user_id}`);
            res.json({ message: "Book bookmarked successfully" });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error bookmarking book" });
    }
});

app.listen(3000, () => console.log("🚀 Server is running on http://localhost:3000"));
