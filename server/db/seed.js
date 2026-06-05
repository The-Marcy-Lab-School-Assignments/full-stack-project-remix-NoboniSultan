require('dotenv').config();
const pool = require('./pool');
const bcrypt = require('bcrypt');

const seed = async () => {
  const client = await pool.connect();

  try {
    console.log('Seeding database...');

    // Drop tables in reverse FK order
    await client.query(`DROP TABLE IF EXISTS books`);
    await client.query(`DROP TABLE IF EXISTS users`);

    // Create users table
    await client.query(`
      CREATE TABLE users (
        user_id       SERIAL PRIMARY KEY,
        username      TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    // Create books table
    await client.query(`
      CREATE TABLE books (
        book_id   SERIAL PRIMARY KEY,
        title     TEXT NOT NULL,
        author    TEXT NOT NULL,
        genre     TEXT,
        status    TEXT NOT NULL DEFAULT 'want-to-read'
                  CHECK (status IN ('want-to-read', 'reading', 'finished')),
        rating    INTEGER CHECK (rating BETWEEN 1 AND 5),
        notes     TEXT,
        cover_url TEXT,
        user_id   INTEGER REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    console.log('Tables created');

    // Seed users
    const hash = await bcrypt.hash('password123', 10);
    const { rows: [alice] } = await client.query(
      `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *`,
      ['alice', hash]
    );
    const { rows: [bob] } = await client.query(
      `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *`,
      ['bob', hash]
    );

    console.log('Users seeded');

    // Seed books for alice
    await client.query(
      `INSERT INTO books (title, author, genre, status, rating, notes, cover_url, user_id)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8),
         ($9, $10, $11, $12, $13, $14, $15, $16),
         ($17, $18, $19, $20, $21, $22, $23, $24)`,
      [
        'Dune', 'Frank Herbert', 'Science Fiction', 'reading', null,
        'Dense world-building, very immersive.',
        'https://covers.openlibrary.org/b/title/Dune-L.jpg',
        alice.user_id,

        'Atomic Habits', 'James Clear', 'Non-Fiction', 'finished', 4,
        'Practical and immediately actionable.',
        'https://covers.openlibrary.org/b/title/Atomic+Habits-L.jpg',
        alice.user_id,

        'The Alchemist', 'Paulo Coelho', 'Fiction', 'want-to-read', null, null,
        'https://covers.openlibrary.org/b/title/The+Alchemist-L.jpg',
        alice.user_id,
      ]
    );

    // Seed books for bob
    await client.query(
      `INSERT INTO books (title, author, genre, status, rating, notes, cover_url, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        'The Pragmatic Programmer', 'David Thomas', 'Technology', 'finished', 5,
        'Essential reading for any developer.',
        'https://covers.openlibrary.org/b/title/The+Pragmatic+Programmer-L.jpg',
        bob.user_id,
      ]
    );

    console.log('Books seeded');
    console.log('Seed complete!');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    client.release();
    pool.end();
  }
};

seed();