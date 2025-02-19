# 📚 Mini Library App  

A mini library app that allows users to search for available books, view their availability (online or offline), and book them if needed. The app retrieves books from a database and, if unavailable, fetches additional results from external sources like **Google Books API** and **Project Gutenberg**. Offline books display their locations, while online books provide direct access links.  

## ✨ Features  

- 🔍 **Search Books** by title or author.  
- ✅ **View Availability** (Online, Offline, or both).  
- 🌍 **External API Fetching** (Google Books API, Project Gutenberg).  
- 📍 **Location Tracking** for offline books.  
- 🔗 **Direct Links** to online books.  
- 📅 **Booking System** for offline books.  
- 🕒 **Order History** to track current and past bookings.  
- 🔒 **Secure Authentication** with JWT-based login.  
- 📌 **Bookmarking Feature** to save favorite books.  
- ⚡ **State Management with Akita** for better performance.  

## 🚀 Installation  

### Backend Setup (Node.js + Express + MySQL)  

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/minilibrary.git
   ```  
2. Navigate to the backend directory:  
   ```bash
   cd minilibrary/backend
   ```  
3. Install dependencies:  
   ```bash
   npm install
   ```  
4. Create a `.env` file and configure database & JWT credentials:  
   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_secret_key
   ```  
5. Start the backend server:  
   ```bash
   npm start
   ```  
   The backend runs on `http://localhost:3000`.  

### Frontend Setup (Angular + Akita + TypeScript)  

1. Navigate to the frontend directory:  
   ```bash
   cd ../frontend
   ```  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Start the development server:  
   ```bash
   npm start
   ```  
4. Open the app in your browser:  
   ```
   http://localhost:4200
   ```  

## 🛠️ Technologies Used  

### **Backend (Node.js + Express + MySQL)**  
- **Node.js** – JavaScript runtime environment.  
- **Express.js** – Backend framework for API handling.  
- **MySQL** – Relational database for storing books and user data.  
- **Axios** – Fetching books from external APIs.  
- **JWT (JSON Web Token)** – Secure authentication.  
- **Bcrypt.js** – Password encryption.  
- **Cors** – Cross-Origin Resource Sharing for frontend communication.  

### **Frontend (Angular + Akita + TypeScript)**  
- **Angular** – Frontend framework for UI and state management.  
- **Akita** – State management for efficient data handling.  
- **RxJS** – Handling asynchronous data streams.  
- **TypeScript** – Strongly typed JavaScript for improved reliability.  
- **Bootstrap** – Responsive UI components.  
- **HTTP Client Module** – API communication with the backend.  

## 📝 Usage  

1. **Search Books** – Enter a title or author in the search bar.  
2. **Check Availability** – View if the book is online or offline.  
3. **Online Books** – Click on a link to read the book.  
4. **Offline Books** – See locations and fill out the booking form.  
5. **Bookmark Books** – Save favorite books for later.  
6. **Order History** – View current and past bookings.  
7. **Authentication** – Login to manage your bookings.  

## 📌 API Endpoints  

### **Authentication**  
- `POST /login` – User login (returns JWT token).  

### **Book Management**  
- `GET /fetch-books?title=<book_title>` – Fetch books (from DB or external APIs).  
- `POST /bookmark` – Bookmark a book.  
- `POST /order` – Book an offline book.  
- `GET /orders/:user_id` – Get a user's booking history.  

## 🛠️ Future Improvements  

- 📗 **User Registration & Profile Management**.  
- 📅 **Advanced Booking System with Notifications**.  
- 🔎 **Enhanced Search Filters (by genre, author, etc.)**.  
- 📊 **Admin Dashboard for Book Management**.  

🚀 **Enjoy using the Mini Library App!** 🚀
