const path = require('path');
const express = require('express');
const session = require('express-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');

const authControllers = require('./controllers/authControllers');
const bookControllers = require('./controllers/bookControllers');

const app = express();
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(express.json());

// In production, serve the built React app from frontend/dist.
// In development, Vite's dev server handles the frontend on a separate port
// and proxies /api requests to this server.
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure: true // uncomment when deployed with HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);
// ====================================
// Auth routes
// ====================================

app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.getMe);
app.delete('/api/auth/logout', authControllers.logout);

// ====================================
// Book routes (all require authentication)
// ====================================

app.get('/api/books', checkAuthentication, bookControllers.listBooks);
app.post('/api/books', checkAuthentication, bookControllers.createBook);
app.patch('/api/books/:book_id', checkAuthentication, bookControllers.updateBook);
app.delete('/api/books/:book_id', checkAuthentication, bookControllers.deleteBook);

// ====================================
// Catch-All: serve React app for any non-API route
// ====================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ====================================
// Global Error Handler
// ====================================

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ====================================
// Listen
// ====================================

app.listen(PORT, () => {
  console.log(`\n boi server running at http://localhost:${PORT}\n`);
});
