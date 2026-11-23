-- =====================================================================
-- AUTONOM — Migração 0001: fundação
-- Organizações, perfis, permissões (roles), leads e atividades.
-- Como aplicar: Supabase > SQL Editor > colar este arquivo > Run.
-- Todas as tabelas têm RLS ativado: sem política, ninguém acessa nada.
-- =====================================================================

-- ---------- Tabelas ----------------------------------------------------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  created_at timestamptz not null default now()
);

-- Papéis: owner > admin > agent (equipe interna); client = acesso ao Client Portal
create table public.memberships (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'agent', 'client')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index memberships_user_idx on public.memberships (user_id);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  category text check (char_length(category) <= 120),
  phone text check (char_length(phone) <= 40),
  address text check (char_length(address) <= 300),
  website text check (char_length(website) <= 300),
  instagram text check (char_length(instagram) <= 120),
  source text not null default 'manual' check (char_length(source) <= 60),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'negotiating', 'won', 'lost')),
  score integer check (score between 0 and 100),
  notes text check (char_length(notes) <= 5000),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_org_status_idx on public.leads (org_id, status);
-- Evita duplicação de leads dentro da mesma organização
create unique index leads_org_phone_uniq
  on public.leads (org_id, phone) where phone is not null and phone <> '';
create unique index leads_org_website_uniq
  on public.leads (org_id, lower(website)) where website is not null and website <> '';

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  type text not null check (char_length(type) <= 60),
  description text not null check (char_length(description) <= 500),
  entity_type text check (char_length(entity_type) <= 60),
  entity_id uuid,
  created_at timestamptz not null default now()
);
create index activities_org_created_idx on public.activities (org_id, created_at desc);

-- ---------- Funções auxiliares ----------------------------------------

-- Verifica se o usuário logado tem um dos papéis na organização.
-- SECURITY DEFINER evita recursão de RLS ao consultar memberships.
create or replace function public.has_org_role(p_org uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    where m.org_id = p_org
      and m.user_id = (select auth.uid())
      and m.role = any (p_roles)
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- No cadastro, cria perfil + organização + vínculo de dono automaticamente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_org uuid;
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.organizations (name)
  values (coalesce(nullif(split_part(new.email, '@', 1), ''), 'Minha empresa'))
  returning id into new_org;

  insert into public.memberships (org_id, user_id, role)
  values (new_org, new.id, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Row Level Security ----------------------------------------

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.leads enable row level security;
alter table public.activities enable row level security;

-- organizations: membros veem; só dono/admin editam. Criação só via trigger.
create policy organizations_select on public.organizations
  for select to authenticated
  using (public.has_org_role(id, array['owner', 'admin', 'agent', 'client']));
create policy organizations_update on public.organizations
  for update to authenticated
  using (public.has_org_role(id, array['owner', 'admin']))
  with check (public.has_org_role(id, array['owner', 'admin']));

-- profiles: cada usuário lê e edita apenas o próprio perfil
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- memberships: o usuário vê os próprios vínculos; dono/admin veem os da organização.
-- Escrita bloqueada para clientes (gestão de usuários será feita no servidor).
create policy memberships_select on public.memberships
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.has_org_role(org_id, array['owner', 'admin'])
  );

-- leads: equipe interna (owner/admin/agent) lê, cria e edita; só owner/admin apagam
create policy leads_select on public.leads
  for select to authenticated
  using (public.has_org_role(org_id, array['owner', 'admin', 'agent']));
create policy leads_insert on public.leads
  for insert to authenticated
  with check (public.has_org_role(org_id, array['owner', 'admin', 'agent']));
create policy leads_update on public.leads
  for update to authenticated
  using (public.has_org_role(org_id, array['owner', 'admin', 'agent']))
  with check (public.has_org_role(org_id, array['owner', 'admin', 'agent']));
create policy leads_delete on public.leads
  for delete to authenticated
  using (public.has_org_role(org_id, array['owner', 'admin']));

-- activities: equipe interna lê; só registra em nome de si mesma. Imutável (sem update/delete).
create policy activities_select on public.activities
  for select to authenticated
  using (public.has_org_role(org_id, array['owner', 'admin', 'agent']));
create policy activities_insert on public.activities
  for insert to authenticated
  with check (
    public.has_org_role(org_id, array['owner', 'admin', 'agent'])
    and actor_id = (select auth.uid())
  );
