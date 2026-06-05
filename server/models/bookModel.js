const pool = require('../db/pool');

/**
 * Get all books belonging to a user.
 * @param {number} userId
 * @returns {Array} array of book rows
 */
const getAllByUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM books WHERE user_id = $1 ORDER BY book_id DESC`,
    [userId]
  );
  return rows;
};

/**
 * Create a new book for a user.
 * @param {Object} fields
 * @returns {Object} new book row
 */
const create = async ({ title, author, genre, status, rating, notes, cover_url, userId }) => {
  const { rows } = await pool.query(
    `INSERT INTO books (title, author, genre, status, rating, notes, cover_url, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [title, author, genre || null, status || 'want-to-read', rating || null, notes || null, cover_url || null, userId]
  );
  return rows[0];
};

/**
 * Update a book — only updates fields that are provided.
 * @param {number} bookId
 * @param {number} userId  — ensures ownership
 * @param {Object} updates
 * @returns {Object|undefined} updated book row
 */
const update = async (bookId, userId, updates) => {
  const { title, author, genre, status, rating, notes, cover_url } = updates;
  const { rows } = await pool.query(
    `UPDATE books
     SET
       title     = COALESCE($1, title),
       author    = COALESCE($2, author),
       genre     = COALESCE($3, genre),
       status    = COALESCE($4, status),
       rating    = COALESCE($5, rating),
       notes     = COALESCE($6, notes),
       cover_url = COALESCE($7, cover_url)
     WHERE book_id = $8 AND user_id = $9
     RETURNING *`,
    [title, author, genre, status, rating, notes, cover_url, bookId, userId]
  );
  return rows[0];
};

/**
 * Delete a book by id, confirming ownership via userId.
 * @param {number} bookId
 * @param {number} userId
 * @returns {Object|undefined} deleted book row
 */
const remove = async (bookId, userId) => {
  const { rows } = await pool.query(
    `DELETE FROM books WHERE book_id = $1 AND user_id = $2 RETURNING *`,
    [bookId, userId]
  );
  return rows[0];
};

module.exports = { getAllByUser, create, update, remove };