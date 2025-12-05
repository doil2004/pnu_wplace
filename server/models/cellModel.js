// server/models/cellModel.js
const pool = require('../db/pool');

async function getAllCells() {
  const { rows } = await pool.query(
    `SELECT c.x, c.y, c.color, u.nickname
     FROM cells c
     JOIN users u ON c.owner_id = u.id`
  );
  return rows;
}

async function upsertCell({ x, y, color, ownerId }) {
  const { rows } = await pool.query(
    `INSERT INTO cells (x, y, color, owner_id, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (x, y)
     DO UPDATE SET color = EXCLUDED.color,
                   owner_id = EXCLUDED.owner_id,
                   updated_at = NOW()
     RETURNING x, y, color, owner_id`,
    [x, y, color, ownerId]
  );
  return rows[0];
}

module.exports = {
  getAllCells,
  upsertCell,
};
