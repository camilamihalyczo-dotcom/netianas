// Node built-in test runner — no extra deps needed
// Run: npm test (with server already running)
const { test } = require('node:test');
const assert   = require('node:assert');

const BASE     = `http://localhost:${process.env.PORT || 3000}`;
const API_KEY  = process.env.ADMIN_API_KEY || 'test-key';

// ── HEALTH ────────────────────────────────────────────────────────────────────
test('GET /health returns ok', async () => {
  const res  = await fetch(`${BASE}/health`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.ok, true);
});

// ── NETIANAS ──────────────────────────────────────────────────────────────────
test('GET /api/netianas returns array', async () => {
  const res  = await fetch(`${BASE}/api/netianas`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(body.data));
});

test('GET /api/netianas/C returns cyborg with referentes', async () => {
  const res  = await fetch(`${BASE}/api/netianas/C`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.data.alias, 'Cyborg');
  assert.ok(Array.isArray(body.data.referentes));
});

test('GET /api/netianas/Z returns 404', async () => {
  const res = await fetch(`${BASE}/api/netianas/Z`);
  assert.strictEqual(res.status, 404);
});

// ── REFERENTES ────────────────────────────────────────────────────────────────
test('GET /api/referentes returns array', async () => {
  const res  = await fetch(`${BASE}/api/referentes`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(body.data));
});

test('GET /api/referentes?netiana=A filters correctly', async () => {
  const res  = await fetch(`${BASE}/api/referentes?netiana=A`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  body.data.forEach(r => assert.strictEqual(r.letra, 'A'));
});

// ── SUGERENCIAS — PUBLIC ──────────────────────────────────────────────────────
test('POST /api/sugerencias rejects empty nombre', async () => {
  const res = await fetch(`${BASE}/api/sugerencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: '' }),
  });
  assert.strictEqual(res.status, 400);
});

test('POST /api/sugerencias rejects short por_que', async () => {
  const res = await fetch(`${BASE}/api/sugerencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Test', netianas: ['(C) Cyborg'], por_que: 'corto',
    }),
  });
  assert.strictEqual(res.status, 400);
});

test('POST /api/sugerencias creates successfully', async () => {
  const res = await fetch(`${BASE}/api/sugerencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre:   'Test Referente',
      netianas: ['(C) Cyborg'],
      por_que:  'Esta es una sugerencia de prueba con al menos 20 caracteres.',
      tags:     ['artista', 'net.art'],
    }),
  });
  const body = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(body.ok, true);
  assert.ok(body.data.id);
  assert.strictEqual(body.data.estado, 'pendiente');
});

// ── SUGERENCIAS — INTERNAL (auth) ────────────────────────────────────────────
test('GET /api/sugerencias without token returns 401', async () => {
  const res = await fetch(`${BASE}/api/sugerencias`);
  assert.strictEqual(res.status, 401);
});

test('GET /api/sugerencias with valid token returns array', async () => {
  const res  = await fetch(`${BASE}/api/sugerencias`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(body.data));
});

test('PATCH /api/sugerencias/:id without token returns 401', async () => {
  const res = await fetch(`${BASE}/api/sugerencias/1`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: 'aprobada' }),
  });
  assert.strictEqual(res.status, 401);
});

test('PATCH /api/sugerencias/999 with token returns 404', async () => {
  const res  = await fetch(`${BASE}/api/sugerencias/999`, {
    method: 'PATCH',
    headers: {
      'Content-Type':  'application/json',
      Authorization:   `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ estado: 'aprobada' }),
  });
  assert.strictEqual(res.status, 404);
});
