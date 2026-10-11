const pool = require('./pool');

const schema = `
  CREATE TABLE IF NOT EXISTS netianas (
    id          SERIAL PRIMARY KEY,
    letra       CHAR(1) NOT NULL UNIQUE,         -- A, B, C ... N
    alias       VARCHAR(50) NOT NULL,             -- Artivista, Buscadora ...
    nombre_libro VARCHAR(100) NOT NULL,            -- Pertenecientes a Microsoft ...
    descripcion TEXT NOT NULL,
    cuerpo      TEXT NOT NULL,
    tags        TEXT[] NOT NULL DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS referentes (
    id          SERIAL PRIMARY KEY,
    netiana_id  INTEGER REFERENCES netianas(id) ON DELETE CASCADE,
    titulo      VARCHAR(150) NOT NULL,
    subtitulo   TEXT[] NOT NULL DEFAULT '{}',     -- tags like (latinoamericana), (artista)...
    cuerpo      TEXT NOT NULL,
    imagen      VARCHAR(200),
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS sugerencias (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    link        VARCHAR(300),
    netianas    TEXT[] NOT NULL,                  -- e.g. ['(C) Cyborg', '(B) Buscadora']
    por_que     TEXT NOT NULL,
    tags        TEXT[] DEFAULT '{}',
    tags_nuevos TEXT[] DEFAULT '{}',
    contacto    VARCHAR(150),
    estado      VARCHAR(20) DEFAULT 'pendiente'   -- pendiente | aprobada | rechazada
      CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_sugerencias_estado ON sugerencias(estado);
  CREATE INDEX IF NOT EXISTS idx_referentes_netiana ON referentes(netiana_id);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running migrations...');
    await client.query(schema);
    console.log('✓ Tables created successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
