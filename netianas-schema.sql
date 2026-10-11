-- ══════════════════════════════════════════════
-- N(H)ACER MUJER EN INTERNET — Schema Supabase
-- Ejecutar en: Supabase → SQL Editor → New query
-- ══════════════════════════════════════════════

-- ── TABLA: sugerencias ──────────────────────────────────────
-- Recibe los envíos del formulario público (form_sugerencias.html)
create table if not exists sugerencias (
  id          bigserial primary key,
  nombre      text not null,
  link        text,
  netianas    text[] not null default '{}',
  por_que     text not null,
  tags        text[] not null default '{}',
  tags_nuevos text[] not null default '{}',
  contacto    text,
  estado      text not null default 'pendiente'
              check (estado in ('pendiente','aprobada','rechazada')),
  created_at  timestamptz not null default now()
);

-- ── TABLA: referentes ───────────────────────────────────────
-- Las referentes publicadas en el sitio (cargadas desde admin)
create table if not exists referentes (
  id              bigserial primary key,
  netiana_idx     smallint not null check (netiana_idx between 0 and 13),
  netiana_letra   char(1) not null,
  titulo          text not null,
  subtitulo       text not null default '',
  texto           text not null default '',
  url_fuente      text,
  img_url         text,           -- URL pública del Storage bucket
  img_nombre      text,           -- nombre del archivo en Storage
  tags            text[] not null default '{}',
  publicada       boolean not null default true,
  origen          text not null default 'admin'
                  check (origen in ('admin','sugerida','seed')),
  sugerencia_id   bigint references sugerencias(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── ÍNDICES ─────────────────────────────────────────────────
create index if not exists idx_sugerencias_estado    on sugerencias(estado);
create index if not exists idx_sugerencias_created   on sugerencias(created_at desc);
create index if not exists idx_referentes_netiana    on referentes(netiana_idx);
create index if not exists idx_referentes_publicada  on referentes(publicada);
create index if not exists idx_referentes_created    on referentes(created_at desc);

-- ── TRIGGER: updated_at automático ──────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_referentes_updated on referentes;
create trigger trg_referentes_updated
  before update on referentes
  for each row execute function set_updated_at();

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
-- sugerencias: cualquiera puede insertar (formulario público),
--              nadie puede leer/editar sin ser admin (lo manejamos
--              desde el admin con la service_role key en el cliente)
alter table sugerencias enable row level security;
alter table referentes  enable row level security;

-- Política pública: INSERT en sugerencias (formulario público)
drop policy if exists "sugerencias_insert_public" on sugerencias;
create policy "sugerencias_insert_public"
  on sugerencias for insert
  to anon
  with check (true);

-- Política pública: SELECT en referentes publicadas (el sitio las lee)
drop policy if exists "referentes_select_public" on referentes;
create policy "referentes_select_public"
  on referentes for select
  to anon
  using (publicada = true);

-- ── STORAGE BUCKET ──────────────────────────────────────────
-- Ejecutar también esto (crea el bucket si no existe):
insert into storage.buckets (id, name, public)
values ('imagenes-referentes', 'imagenes-referentes', true)
on conflict (id) do nothing;

-- Política de storage: lectura pública
drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'imagenes-referentes');

-- ── LISTO ───────────────────────────────────────────────────
-- Después de ejecutar esto, el admin.html usa la service_role key
-- (guardada solo en sessionStorage) para leer/escribir todo.
