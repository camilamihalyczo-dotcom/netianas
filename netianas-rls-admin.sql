-- ══════════════════════════════════════════════════════════
-- N(H)ACER MUJER EN INTERNET — Políticas RLS para admin
-- Ejecutar en: Supabase → SQL Editor → New query
-- ══════════════════════════════════════════════════════════
-- Estas políticas permiten que los usuarios autenticados
-- (creados en Authentication → Users) tengan acceso total
-- a las tablas desde el admin.html, sin necesitar la
-- service_role key en el código.
-- ══════════════════════════════════════════════════════════

-- ── TABLA: sugerencias ──────────────────────────────────
-- Usuarios autenticados pueden leer, actualizar y borrar
drop policy if exists "sugerencias_select_admin" on sugerencias;
create policy "sugerencias_select_admin"
  on sugerencias for select
  to authenticated
  using (true);

drop policy if exists "sugerencias_update_admin" on sugerencias;
create policy "sugerencias_update_admin"
  on sugerencias for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "sugerencias_delete_admin" on sugerencias;
create policy "sugerencias_delete_admin"
  on sugerencias for delete
  to authenticated
  using (true);

-- ── TABLA: referentes ───────────────────────────────────
-- Usuarios autenticados pueden hacer todo (CRUD)
drop policy if exists "referentes_select_admin" on referentes;
create policy "referentes_select_admin"
  on referentes for select
  to authenticated
  using (true);

drop policy if exists "referentes_insert_admin" on referentes;
create policy "referentes_insert_admin"
  on referentes for insert
  to authenticated
  with check (true);

drop policy if exists "referentes_update_admin" on referentes;
create policy "referentes_update_admin"
  on referentes for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "referentes_delete_admin" on referentes;
create policy "referentes_delete_admin"
  on referentes for delete
  to authenticated
  using (true);

-- ── STORAGE: imagenes-referentes ────────────────────────
-- Usuarios autenticados pueden subir y borrar imágenes
drop policy if exists "storage_admin_insert" on storage.objects;
create policy "storage_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'imagenes-referentes');

drop policy if exists "storage_admin_delete" on storage.objects;
create policy "storage_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'imagenes-referentes');

-- ── LISTO ───────────────────────────────────────────────
-- Después de ejecutar esto:
-- 1. Ir a Authentication → Users → Invite user
-- 2. Crear el usuario con tu email y contraseña
-- 3. Confirmar el usuario si pide confirmación por mail
-- 4. Abrir admin.html e iniciar sesión
