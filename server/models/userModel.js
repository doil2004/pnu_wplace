// server/models/userModel.js
const pool = require('../db/pool');

async function createUser({ email, passwordHash, nickname }) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, nickname)
     VALUES ($1, $2, $3)
     RETURNING id, email, nickname`,
    [email, passwordHash, nickname]
  );
  return rows[0];
}

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function findUserById(id) {
  const { rows } = await pool.query(
    'SELECT id, email, nickname FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
