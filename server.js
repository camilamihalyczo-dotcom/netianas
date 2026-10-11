require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const routes  = require('./routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS ──────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PATCH'],
}));

app.use(express.json());

// ── HEALTH CHECK ──────────────────────────
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    project: 'netianas-api',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── API ROUTES ────────────────────────────
app.use('/api', routes);

// ── 404 ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, error: `Route ${req.method} ${req.path} not found` });
});

// ── GLOBAL ERROR HANDLER ──────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message?.startsWith('CORS')) {
    return res.status(403).json({ ok: false, error: err.message });
  }
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

// ── START ─────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`netianas-api running on http://localhost:${PORT}`);
  console.log(`ENV: ${process.env.NODE_ENV || 'development'}`);
});

// ── GRACEFUL SHUTDOWN ─────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
