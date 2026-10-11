-- Odpowiedzi z zaproszenia na randkę.
-- Uruchom w Supabase -> SQL Editor.

create table if not exists public.date_responses (
  id uuid primary key,
  day text,
  time text,
  vibe text,
  place text,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.date_responses enable row level security;

-- Prosta aplikacja bez logowania: klucz anon może czytać, zapisywać i czyścić.
create policy "date_responses: anon select" on public.date_responses for select using (true);
create policy "date_responses: anon insert" on public.date_responses for insert with check (true);
create policy "date_responses: anon update" on public.date_responses for update using (true) with check (true);
create policy "date_responses: anon delete" on public.date_responses for delete using (true);
