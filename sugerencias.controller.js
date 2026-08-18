const pool = require('../db/pool');

// POST /api/sugerencias
async function create(req, res) {
  const { nombre, link, netianas, por_que, tags, tags_nuevos, contacto } = req.body;

  // Validation
  if (!nombre?.trim()) {
    return res.status(400).json({ ok: false, error: 'nombre is required' });
  }
  if (!netianas?.length) {
    return res.status(400).json({ ok: false, error: 'at least one netiana is required' });
  }
  if (!por_que?.trim() || por_que.trim().length < 20) {
    return res.status(400).json({ ok: false, error: 'por_que must be at least 20 characters' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO sugerencias
        (nombre, link, netianas, por_que, tags, tags_nuevos, contacto)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nombre, netianas, estado, created_at`,
      [
        nombre.trim(),
        link?.trim() || null,
        Array.isArray(netianas) ? netianas : [netianas],
        por_que.trim(),
        Array.isArray(tags) ? tags : tags ? [tags] : [],
        Array.isArray(tags_nuevos) ? tags_nuevos : tags_nuevos ? [tags_nuevos] : [],
        contacto?.trim() || null,
      ]
    );

    res.status(201).json({
      ok: true,
      message: 'Sugerencia recibida. Será revisada antes de incorporarse al rizoma.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Database error' });
  }
}

// GET /api/sugerencias — internal panel
async function getAll(req, res) {
  const { estado = 'pendiente' } = req.query;

  const validEstados = ['pendiente', 'aprobada', 'rechazada'];
  if (!validEstados.includes(estado)) {
    return res.status(400).json({ ok: false, error: 'Invalid estado filter' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM sugerencias WHERE estado = $1 ORDER BY created_at DESC`,
      [estado]
    );
    res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Database error' });
  }
}

// PATCH /api/sugerencias/:id — approve or reject
async function updateEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body;

  const validEstados = ['aprobada', 'rechazada'];
  if (!validEstados.includes(estado)) {
    return res.status(400).json({ ok: false, error: 'estado must be aprobada or rechazada' });
  }

  try {
    const result = await pool.query(
      `UPDATE sugerencias SET estado = $1 WHERE id = $2 RETURNING *`,
      [estado, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: 'Sugerencia not found' });
    }
    res.json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Database error' });
  }
}

module.exports = { create, getAll, updateEstado };
