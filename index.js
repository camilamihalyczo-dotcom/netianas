const { Router } = require('express');
const router = Router();

const netianas    = require('../controllers/netianas.controller');
const referentes  = require('../controllers/referentes.controller');
const sugerencias = require('../controllers/sugerencias.controller');
const { requireAuth } = require('../middleware/auth');

// ── NETIANAS ──────────────────────────────
// GET  /api/netianas          → all 14 netianas
// GET  /api/netianas/:letra   → one netiana + its referentes
router.get('/netianas',        netianas.getAll);
router.get('/netianas/:letra', netianas.getOne);

// ── REFERENTES ────────────────────────────
// GET  /api/referentes                     → all referentes
// GET  /api/referentes?tag=latinoamericana → filter by tag
// GET  /api/referentes?netiana=C           → filter by netiana
router.get('/referentes', referentes.getAll);

// ── SUGERENCIAS ───────────────────────────
// POST  /api/sugerencias           → submit suggestion (PUBLIC)
// GET   /api/sugerencias           → list suggestions  (INTERNAL — requires auth)
// PATCH /api/sugerencias/:id       → approve/reject    (INTERNAL — requires auth)
router.post  ('/sugerencias',      sugerencias.create);
router.get   ('/sugerencias',      requireAuth, sugerencias.getAll);
router.patch ('/sugerencias/:id',  requireAuth, sugerencias.updateEstado);

module.exports = router;
