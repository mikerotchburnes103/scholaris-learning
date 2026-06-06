create table if not exists public.site_config (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.site_config to anon, authenticated;
grant all on public.site_config to service_role;
alter table public.site_config enable row level security;
drop policy if exists "public read site_config" on public.site_config;
create policy "public read site_config" on public.site_config for select using (true);
insert into public.site_config(key, value) values
  ('patch_notes', E'# Welcome to Scholaris Arcade\n\nLatest updates appear here. Admins can edit from the admin panel.'),
  ('auto_patch_notes', '1'),
  ('patch_version', '1')
on conflict (key) do nothing;