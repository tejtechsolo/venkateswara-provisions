create extension if not exists pgcrypto;

create type public.app_role as enum ('owner','admin','staff','customer');

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  full_name text,
  phone text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  slug text not null,
  unique (tenant_id, slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  sku text not null,
  name text not null,
  description text,
  unit text not null default 'pcs',
  base_price numeric(12,2) not null default 0 check (base_price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, sku)
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  warehouse_id uuid,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity numeric(12,3) not null default 0 check (quantity >= 0),
  reorder_level numeric(12,3) not null default 0,
  unique (tenant_id, warehouse_id, product_id)
);

create table public.customer_prices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  price numeric(12,2) not null check (price >= 0),
  unique (customer_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null references public.profiles(id),
  status text not null default 'pending' check (status in ('pending','confirmed','processing','dispatched','delivered','cancelled')),
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity numeric(12,3) not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) generated always as (quantity * unit_price) stored
);

create table public.integration_configs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider text not null check (provider in ('airtable','notion','github','vercel','canva')),
  enabled boolean not null default false,
  last_sync_at timestamptz,
  status text not null default 'not_configured',
  unique (tenant_id, provider)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.customer_prices enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.integration_configs enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('owner','admin','staff'));
$$;

create policy "tenant products read" on public.products for select using (tenant_id = (select tenant_id from public.profiles where id = auth.uid()));
create policy "tenant categories read" on public.categories for select using (tenant_id = (select tenant_id from public.profiles where id = auth.uid()));
create policy "admins manage products" on public.products for all using (public.is_admin() and tenant_id = (select tenant_id from public.profiles where id = auth.uid())) with check (public.is_admin() and tenant_id = (select tenant_id from public.profiles where id = auth.uid()));
create policy "admins manage categories" on public.categories for all using (public.is_admin() and tenant_id = (select tenant_id from public.profiles where id = auth.uid())) with check (public.is_admin() and tenant_id = (select tenant_id from public.profiles where id = auth.uid()));
create policy "customers see own orders" on public.orders for select using (customer_id = auth.uid() or public.is_admin());
create policy "customers create own orders" on public.orders for insert with check (customer_id = auth.uid());
create policy "admins manage orders" on public.orders for all using (public.is_admin());
