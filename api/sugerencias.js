// Vercel Serverless Function — POST /api/sugerencias
// Guarda una sugerencia de referente en la tabla `suggestions` de Supabase.

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

module.exports = async function handler(req, res) {
  // CORS — permite el origen de producción y localhost para desarrollo
  const allowed = [
    'https://netianas.vercel.app',
    'http://localhost:5500',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
  ];
  const origin = req.headers.origin || '';
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Validación básica
  const { nombre, link, netianas, por_que, tags, tags_nuevos, contacto } = req.body || {};

  if (!nombre?.trim()) {
    return res.status(400).json({ ok: false, error: 'nombre is required' });
  }
  if (!netianas?.length) {
    return res.status(400).json({ ok: false, error: 'at least one netiana is required' });
  }
  if (!por_que?.trim() || por_que.trim().length < 20) {
    return res.status(400).json({ ok: false, error: 'por_que must be at least 20 characters' });
  }

  // Supabase
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars');
    return res.status(500).json({ ok: false, error: 'Server configuration error' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data, error } = await supabase
    .from('suggestions')
    .insert({
      nombre:      nombre.trim(),
      link:        link?.trim() || null,
      netianas:    Array.isArray(netianas) ? netianas : [netianas],
      por_que:     por_que.trim(),
      tags:        Array.isArray(tags) ? tags : (tags ? [tags] : []),
      tags_nuevos: Array.isArray(tags_nuevos) ? tags_nuevos : (tags_nuevos ? [tags_nuevos] : []),
      contacto:    contacto?.trim() || null,
    })
    .select('id, nombre, netianas, estado, created_at')
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ ok: false, error: 'Database error' });
  }

  return res.status(201).json({
    ok: true,
    message: 'Sugerencia recibida. Será revisada antes de incorporarse al rizoma.',
    data,
  });
};
