create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  currency text not null default 'INR',
  created_at timestamptz not null default now()
);

create type public.app_role as enum ('owner','admin','staff','customer');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  full_name text,
  phone text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, slug text not null, active boolean not null default true,
  unique(tenant_id, slug)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  sku text not null, name text not null, description text, unit text not null default 'piece',
  base_price numeric(12,2) not null default 0 check(base_price >= 0), active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(tenant_id, sku)
);

create table if not exists public.customer_prices (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  price numeric(12,2) not null check(price >= 0), min_qty integer not null default 1 check(min_qty > 0),
  unique(customer_id, product_id, min_qty)
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid, quantity numeric(14,3) not null default 0, reserved numeric(14,3) not null default 0,
  updated_at timestamptz not null default now(), unique(product_id, warehouse_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null references public.profiles(id), status text not null default 'pending' check(status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  total numeric(14,2) not null default 0, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id), product_name text not null, sku text not null,
  quantity numeric(14,3) not null check(quantity > 0), unit_price numeric(12,2) not null check(unit_price >= 0), line_total numeric(14,2) generated always as (quantity * unit_price) stored
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(), tenant_id uuid references public.tenants(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null, action text not null, entity_type text not null, entity_id uuid, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create index if not exists products_tenant_active_idx on public.products(tenant_id, active);
create index if not exists orders_customer_idx on public.orders(customer_id, created_at desc);
create index if not exists inventory_product_idx on public.inventory(product_id);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.customer_prices enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('owner','admin','staff'));
$$;

create or replace function public.my_tenant() returns uuid language sql stable security definer set search_path = public as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

create policy profiles_self_or_staff on public.profiles for select using (id = auth.uid() or (tenant_id = public.my_tenant() and public.is_staff()));
create policy products_tenant_read on public.products for select using (tenant_id = public.my_tenant() and active = true or (tenant_id = public.my_tenant() and public.is_staff()));
create policy products_staff_write on public.products for all using (tenant_id = public.my_tenant() and public.is_staff()) with check (tenant_id = public.my_tenant());
create policy categories_tenant_read on public.categories for select using (tenant_id = public.my_tenant());
create policy categories_staff_write on public.categories for all using (tenant_id = public.my_tenant() and public.is_staff()) with check (tenant_id = public.my_tenant());
create policy inventory_tenant_read on public.inventory for select using (tenant_id = public.my_tenant());
create policy inventory_staff_write on public.inventory for all using (tenant_id = public.my_tenant() and public.is_staff()) with check (tenant_id = public.my_tenant());
create policy customer_prices_customer_read on public.customer_prices for select using (customer_id = auth.uid() or (tenant_id = public.my_tenant() and public.is_staff()));
create policy customer_prices_staff_write on public.customer_prices for all using (tenant_id = public.my_tenant() and public.is_staff()) with check (tenant_id = public.my_tenant());
create policy orders_customer_read on public.orders for select using (customer_id = auth.uid() or (tenant_id = public.my_tenant() and public.is_staff()));
create policy orders_customer_create on public.orders for insert with check (customer_id = auth.uid() and tenant_id = public.my_tenant());
create policy orders_staff_update on public.orders for update using (tenant_id = public.my_tenant() and public.is_staff()) with check (tenant_id = public.my_tenant());
create policy order_items_customer_read on public.order_items for select using (exists(select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or (o.tenant_id = public.my_tenant() and public.is_staff()))));
create policy order_items_customer_create on public.order_items for insert with check (exists(select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));
create policy audit_staff_read on public.audit_logs for select using (tenant_id = public.my_tenant() and public.is_staff());

create or replace function public.create_order(p_items jsonb, p_notes text default null) returns uuid language plpgsql security definer set search_path = public as $$
declare v_order uuid; v_item jsonb; v_product public.products%rowtype; v_qty numeric; v_price numeric; v_total numeric := 0; v_tenant uuid := public.my_tenant();
begin
  if auth.uid() is null or v_tenant is null then raise exception 'Unauthorized'; end if;
  insert into public.orders(tenant_id, customer_id, notes) values(v_tenant, auth.uid(), p_notes) returning id into v_order;
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid and tenant_id = v_tenant and active = true for update;
    if not found then raise exception 'Product unavailable'; end if;
    v_qty := (v_item->>'quantity')::numeric;
    if v_qty <= 0 then raise exception 'Invalid quantity'; end if;
    select coalesce((select cp.price from public.customer_prices cp where cp.customer_id = auth.uid() and cp.product_id = v_product.id and cp.min_qty <= v_qty order by cp.min_qty desc limit 1), v_product.base_price) into v_price;
    if not exists(select 1 from public.inventory i where i.product_id = v_product.id and i.tenant_id = v_tenant and (i.quantity - i.reserved) >= v_qty) then raise exception 'Insufficient stock for %', v_product.name; end if;
    update public.inventory set reserved = reserved + v_qty, updated_at = now() where product_id = v_product.id and tenant_id = v_tenant;
    insert into public.order_items(order_id, product_id, product_name, sku, quantity, unit_price) values(v_order, v_product.id, v_product.name, v_product.sku, v_qty, v_price);
    v_total := v_total + (v_qty * v_price);
  end loop;
  update public.orders set total = v_total where id = v_order;
  return v_order;
end; $$;
