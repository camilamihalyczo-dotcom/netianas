# netianas-api

REST API for **N(H)ACER MUJER EN INTERNET** — [netianas.vercel.app](https://netianas.vercel.app)

Backend for the net.art project based on Remedios Zafra's *Netianas* (2005).  
Built with **Node.js + Express + PostgreSQL**.

---

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Runtime  | Node.js 18+                 |
| Framework| Express 4                   |
| Database | PostgreSQL (via `pg`)        |
| Deploy   | Railway / Render            |
| Frontend | netianas.vercel.app (Vercel) |

---

## Setup local

```bash
# 1. Clone and install
git clone https://github.com/camilamihalyczo-dotcom/netianas-api
cd netianas-api
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# 3. Run migrations (creates tables)
npm run migrate

# 4. Start dev server
npm run dev
```

---

## Endpoints

### Health
```
GET /health
```

### Netianas
```
GET /api/netianas             → all 14 netianas
GET /api/netianas/:letra      → one netiana + its referentes
                                e.g. /api/netianas/C
```

### Referentes
```
GET /api/referentes                      → all referentes
GET /api/referentes?tag=latinoamericana  → filter by tag
GET /api/referentes?netiana=C            → filter by netiana
```

### Sugerencias
```
POST  /api/sugerencias          → submit suggestion (public)
GET   /api/sugerencias          → list pending (internal)
GET   /api/sugerencias?estado=aprobada
PATCH /api/sugerencias/:id      → approve or reject (internal)
```

#### POST /api/sugerencias — body
```json
{
  "nombre":     "Cornelia Sollfrank",
  "link":       "https://example.com",
  "netianas":   ["(G) Geek", "(H) Hacktivista"],
  "por_que":    "Hackea concursos de net.art con software propio...",
  "tags":       ["artista", "net.art", "europea"],
  "tags_nuevos": [],
  "contacto":   "opcional@mail.com"
}
```

---

## Deploy en Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and init
railway login
railway init

# 3. Add PostgreSQL plugin in Railway dashboard

# 4. Set env vars in Railway dashboard:
#    DATABASE_URL  (auto-filled by Railway plugin)
#    NODE_ENV=production
#    ALLOWED_ORIGINS=https://netianas.vercel.app

# 5. Deploy
railway up

# 6. Run migrations on production
railway run npm run migrate
```

---

## Project structure

```
netianas-api/
├── src/
│   ├── server.js              # Entry point
│   ├── routes/
│   │   └── index.js           # All routes
│   ├── controllers/
│   │   ├── netianas.controller.js
│   │   ├── referentes.controller.js
│   │   └── sugerencias.controller.js
│   └── db/
│       ├── pool.js            # PostgreSQL connection
│       └── migrate.js         # Schema migrations
├── tests/
│   └── api.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Related

- Frontend: [netianas.vercel.app](https://netianas.vercel.app)
- Frontend repo: [github.com/camilamihalyczo-dotcom/netianas](https://github.com/camilamihalyczo-dotcom/netianas)

---

## Auth

Internal endpoints (`GET /api/sugerencias`, `PATCH /api/sugerencias/:id`) require an API key.

Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```
ADMIN_API_KEY=your-generated-key
```

Pass in requests:
```
Authorization: Bearer your-generated-key
```

---

## Running the seed

After migrating, load the 14 netianas and their referentes:

```bash
npm run seed
```

This is idempotent — it clears and reloads all data. Safe to run multiple times.

---

## Full workflow

```bash
npm run migrate   # 1. Create tables
npm run seed      # 2. Load netianas + referentes
npm run dev       # 3. Start server

# In another terminal:
npm test          # 4. Run tests (server must be running)
```

---

## Connecting the frontend form

Once deployed, update `form_sugerencias.html` — replace the EmailJS block with:

```javascript
const res = await fetch('https://your-api.railway.app/api/sugerencias', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
const data = await res.json();
if (data.ok) showSuccess(payload);
```
