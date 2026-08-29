-- Creator Revenue OS core schema
create table if not exists workspaces (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz not null default now());
create table if not exists content_items (id uuid primary key default gen_random_uuid(), workspace_id uuid references workspaces(id) on delete cascade, title text not null, channel text not null, status text not null default 'idea', target_keyword text, primary_cta text, publish_date date, url text, created_at timestamptz not null default now());
create table if not exists revenue_opportunities (id uuid primary key default gen_random_uuid(), workspace_id uuid references workspaces(id) on delete cascade, name text not null, type text not null, status text not null default 'idea', expected_revenue numeric(12,2) default 0, actual_revenue numeric(12,2) default 0, conversion_rate numeric(6,4) default 0, url text, notes text, created_at timestamptz not null default now());
create table if not exists products (id uuid primary key default gen_random_uuid(), workspace_id uuid references workspaces(id) on delete cascade, name text not null, price numeric(12,2) not null default 0, type text not null, status text not null default 'draft', sales integer not null default 0, revenue numeric(12,2) not null default 0, checkout_url text, created_at timestamptz not null default now());
create table if not exists sponsors (id uuid primary key default gen_random_uuid(), workspace_id uuid references workspaces(id) on delete cascade, company text not null, contact_email text, opportunity text, stage text not null default 'prospect', deal_value numeric(12,2) default 0, last_contact date, follow_up_date date, notes text, created_at timestamptz not null default now());
create index if not exists content_workspace_status_idx on content_items(workspace_id,status);
create index if not exists revenue_workspace_status_idx on revenue_opportunities(workspace_id,status);
create index if not exists sponsors_workspace_stage_idx on sponsors(workspace_id,stage);
-- Enable RLS; application policies should be added after auth wiring.
alter table workspaces enable row level security;
alter table content_items enable row level security;
alter table revenue_opportunities enable row level security;
alter table products enable row level security;
alter table sponsors enable row level security;
