create table if not exists rooms (id uuid primary key default gen_random_uuid(), room_code text unique not null, host_player_id uuid, status text not null default 'waiting', theme text not null, difficulty text not null, story_data jsonb, public_surface text, created_at timestamptz default now());
create table if not exists players (id uuid primary key default gen_random_uuid(), room_id uuid references rooms(id) on delete cascade, nickname text not null, is_host boolean default false, joined_at timestamptz default now(), last_seen_at timestamptz default now());
create table if not exists questions (id uuid primary key default gen_random_uuid(), room_id uuid references rooms(id) on delete cascade, player_id uuid references players(id), content text not null, answer_type text, answer_text text, created_at timestamptz default now());
create table if not exists game_events (id bigint generated always as identity primary key, room_id uuid references rooms(id) on delete cascade, event_type text not null, payload jsonb, created_at timestamptz default now());
alter table rooms enable row level security; alter table players enable row level security; alter table questions enable row level security; alter table game_events enable row level security;

-- Run once after creating tables to enable instant browser updates.
alter publication supabase_realtime add table rooms, players, questions, game_events;
