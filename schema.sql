-- entries table
create table entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  content text not null,
  type text not null, -- 'note', 'doc', or 'faq'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- row level security
alter table entries enable row level security;

create policy "Users can only access their own entries"
on entries for all
using (auth.uid() = user_id);

-- full text search
alter table entries add column fts tsvector
  generated always as (to_tsvector('english', title || ' ' || content)) stored;

create index entries_fts_idx on entries using gin(fts);