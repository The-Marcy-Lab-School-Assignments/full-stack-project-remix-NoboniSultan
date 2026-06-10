const bookModel = require('../models/bookModel');

/**
 * GET /api/books
 * Returns all books belonging to the logged-in user.
 */
const listBooks = async (req, res) => {
  const books = await bookModel.getAllByUser(req.session.userId);
  res.json(books);
};

/**
 * POST /api/books
 * Body: { title, author, genre, status, rating, notes, cover_url }
 * Creates a new book for the logged-in user.
 */
const createBook = async (req, res) => {
  const { title, author, genre, status, rating, notes, cover_url } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required.' });
  }

  const book = await bookModel.create({
    title,
    author,
    genre,
    status,
    rating,
    notes,
    cover_url,
    userId: req.session.userId,
  });

  res.status(201).json(book);
};

/**
 * PATCH /api/books/:book_id
 * Body: any subset of { title, author, genre, status, rating, notes, cover_url }
 * Updates a book — ownership is enforced in the model query.
 */
const updateBook = async (req, res) => {
  const bookId = Number(req.params.book_id);
  const book = await bookModel.update(bookId, req.session.userId, req.body);

  if (!book) {
    return res.status(404).json({ error: 'Book not found or not yours.' });
  }

  res.json(book);
};

/**
 * DELETE /api/books/:book_id
 * Deletes a book — ownership is enforced in the model query.
 */
const deleteBook = async (req, res) => {
  const bookId = Number(req.params.book_id);
  const book = await bookModel.remove(bookId, req.session.userId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found or not yours.' });
  }

  res.json(book);
};

module.exports = { listBooks, createBook, updateBook, deleteBook };