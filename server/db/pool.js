const { Pool } = require('pg');
require('dotenv').config();

// Hosted Postgres (Render, Railway, Neon, Supabase) hands out a single
// connection string, and requires SSL. Locally there is no connection string,
// so the Pool is left unconfigured and `pg` falls back to the standard
// PGHOST / PGPORT / PGDATABASE / PGUSER / PGPASSWORD variables in .env.
//
// Render names its own managed-database variable DATABASE_URL, so accept
// either rather than making the deploy depend on which one got set.
const connectionString =
  process.env.PG_CONNECTION_STRING || process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      // Hosted providers terminate TLS with certificates Node does not have in
      // its trust store; without this the connection is refused outright.
      ssl: { rejectUnauthorized: false },
    })
  : new Pool();

module.exports = pool;
