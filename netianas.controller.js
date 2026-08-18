const pool = require('../db/pool');

// GET /api/netianas
async function getAll(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, letra, alias, nombre_libro, descripcion, tags FROM netianas ORDER BY letra'
    );
    res.json({ ok: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Database error' });
  }
}

// GET /api/netianas/:letra
async function getOne(req, res) {
  const { letra } = req.params;
  try {
    const netiana = await pool.query(
      'SELECT * FROM netianas WHERE UPPER(letra) = UPPER($1)',
      [letra]
    );
    if (netiana.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Netiana not found' });
    }

    const referentes = await pool.query(
      'SELECT * FROM referentes WHERE netiana_id = $1 ORDER BY created_at',
      [netiana.rows[0].id]
    );

    res.json({
      ok: true,
      data: {
        ...netiana.rows[0],
        referentes: referentes.rows,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Database error' });
  }
}

module.exports = { getAll, getOne };
