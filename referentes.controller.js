const pool = require('../db/pool');

// GET /api/referentes
async function getAll(req, res) {
  const { tag, netiana } = req.query;

  let query = `
    SELECT r.*, n.letra, n.alias
    FROM referentes r
    JOIN netianas n ON r.netiana_id = n.id
    WHERE 1=1
  `;
  const params = [];

  if (tag) {
    params.push(`(${tag})`);
    query += ` AND $${params.length} = ANY(r.subtitulo)`;
  }

  if (netiana) {
    params.push(netiana.toUpperCase());
    query += ` AND UPPER(n.letra) = $${params.length}`;
  }

  query += ' ORDER BY n.letra, r.created_at';

  try {
    const result = await pool.query(query, params);
    res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Database error' });
  }
}

module.exports = { getAll };
