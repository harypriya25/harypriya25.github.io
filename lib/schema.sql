-- ============================================================
-- FoodLogic Database Schema
-- Run this once in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text not null,
  full_name     text not null,
  title         text,
  country       text,
  bio           text,
  role          text not null default 'student' check (role in ('student','professional','admin')),
  specialist_area text check (specialist_area in ('food_science','engineering','career')),
  is_verified   boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- ============================================================
-- QUESTIONS
-- ============================================================
create table if not exists questions (
  id          uuid primary key default uuid_generate_v4(),
  author_id   uuid references profiles(id) on delete cascade not null,
  title       text not null,
  body        text not null,
  category    text not null check (category in ('food_science','engineering','career')),
  is_answered boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table questions enable row level security;

create policy "Questions are viewable by everyone"
  on questions for select using (true);

create policy "Authenticated users can insert questions"
  on questions for insert with check (auth.uid() = author_id);

create policy "Question authors can update their questions"
  on questions for update using (auth.uid() = author_id);

-- ============================================================
-- ANSWERS
-- ============================================================
create table if not exists answers (
  id          uuid primary key default uuid_generate_v4(),
  question_id uuid references questions(id) on delete cascade not null,
  author_id   uuid references profiles(id) on delete cascade not null,
  body        text not null,
  is_accepted boolean not null default false,
  upvote_count int not null default 0,
  created_at  timestamptz not null default now()
);

alter table answers enable row level security;

create policy "Answers are viewable by everyone"
  on answers for select using (true);

create policy "Verified professionals can insert answers"
  on answers for insert with check (
    auth.uid() = author_id
    and exists (
      select 1 from profiles
      where id = auth.uid() and is_verified = true
    )
  );

create policy "Answer authors can update their answers"
  on answers for update using (auth.uid() = author_id);

-- ============================================================
-- MENTOR REQUESTS
-- ============================================================
create table if not exists mentor_requests (
  id            uuid primary key default uuid_generate_v4(),
  from_user_id  uuid references profiles(id) on delete cascade not null,
  to_mentor_id  uuid references profiles(id) on delete cascade not null,
  message       text not null,
  status        text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at    timestamptz not null default now(),
  unique(from_user_id, to_mentor_id)
);

alter table mentor_requests enable row level security;

create policy "Users can view their own mentor requests"
  on mentor_requests for select
  using (auth.uid() = from_user_id or auth.uid() = to_mentor_id);

create policy "Authenticated users can send mentor requests"
  on mentor_requests for insert with check (auth.uid() = from_user_id);

create policy "Mentors can update request status"
  on mentor_requests for update using (auth.uid() = to_mentor_id);

-- ============================================================
-- ANSWER UPVOTES
-- ============================================================
create table if not exists answer_upvotes (
  id        uuid primary key default uuid_generate_v4(),
  answer_id uuid references answers(id) on delete cascade not null,
  user_id   uuid references profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(answer_id, user_id)
);

alter table answer_upvotes enable row level security;

create policy "Upvotes are viewable by everyone"
  on answer_upvotes for select using (true);

create policy "Authenticated users can upvote"
  on answer_upvotes for insert with check (auth.uid() = user_id);

create policy "Users can remove their own upvotes"
  on answer_upvotes for delete using (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, is_verified)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- FUNCTION: increment upvote count
-- ============================================================
create or replace function increment_upvote(answer_id uuid)
returns void as $$
  update answers set upvote_count = upvote_count + 1 where id = answer_id;
$$ language sql security definer;

create or replace function decrement_upvote(answer_id uuid)
returns void as $$
  update answers set upvote_count = greatest(0, upvote_count - 1) where id = answer_id;
$$ language sql security definer;
