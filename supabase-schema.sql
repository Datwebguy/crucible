-- Run this in your Supabase SQL Editor before launching

-- Analyses table
create table analyses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id),
  wallet_address text,
  input text not null,
  bias_output text,
  bear_output text,
  assumption_output text,
  audit_output text,
  reasoning_score integer,
  is_public boolean default false
);

-- Usage tracking for free tier
create table usage (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  identifier text not null,
  date date default current_date,
  count integer default 1,
  unique(identifier, date)
);

-- RLS
alter table analyses enable row level security;
alter table usage enable row level security;

create policy "Users can read own analyses"
  on analyses for select using (
    auth.uid() = user_id or
    wallet_address = current_setting('app.wallet_address', true)
  );

create policy "Users can insert own analyses"
  on analyses for insert with check (true);

create policy "Service role manages usage"
  on usage for all using (true);
