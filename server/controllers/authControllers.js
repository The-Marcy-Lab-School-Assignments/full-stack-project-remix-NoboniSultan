const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Body: { username, password }
 * Creates a new user account and opens a session.
 */
const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const existing = await userModel.findByUsername(username);
  if (existing) {
    return res.status(409).json({ error: 'Username already taken.' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userModel.create(username, passwordHash);

  req.session.userId = user.user_id;
  res.status(201).json(user);
};

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Validates credentials and opens a session.
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = await userModel.findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  req.session.userId = user.user_id;
  res.json({ user_id: user.user_id, username: user.username });
};

/**
 * DELETE /api/auth/logout
 * Destroys the current session.
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Could not log out.' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully.' });
  });
};

/**
 * GET /api/auth/me
 * Returns the currently logged-in user, or null.
 * Used for session rehydration on frontend mount.
 */
const getMe = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.json(null);

  const user = await userModel.findById(userId);
  if (!user) return res.json(null);

  res.json(user);
};

module.exports = { register, login, logout, getMe };