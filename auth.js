// Simple API key auth for internal endpoints (GET/PATCH sugerencias)
// Add ADMIN_API_KEY=your-secret to .env
// Pass as header: Authorization: Bearer your-secret

function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token || token !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  next();
}

module.exports = { requireAuth };
