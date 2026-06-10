const pool = require('../db/pool');

/**
 * Find a user by username.
 * @param {string} username
 * @returns {Object|undefined} user row
 */
const findByUsername = async (username) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return rows[0];
};

/**
 * Find a user by their primary key.
 * @param {number} userId
 * @returns {Object|undefined} user row (without password_hash)
 */
const findById = async (userId) => {
  const { rows } = await pool.query(
    `SELECT user_id, username FROM users WHERE user_id = $1`,
    [userId]
  );
  return rows[0];
};

/**
 * Create a new user with a hashed password.
 * @param {string} username
 * @param {string} passwordHash  — already bcrypt-hashed
 * @returns {Object} new user row (without password_hash)
 */
const create = async (username, passwordHash) => {
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING user_id, username`,
    [username, passwordHash]
  );
  return rows[0];
};

module.exports = { findByUsername, findById, create };