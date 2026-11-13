-- ============================================================
-- OUR LADY OF ASSUMPTION CHURCH, PALLIKKUNNU - SUPABASE SCHEMA
-- ============================================================
-- Execute this entire script in the Supabase SQL Editor.
-- (https://supabase.com/dashboard/project/_/sql)

create extension if not exists "uuid-ossp";

-- 1. Holy Mass Timings
create table if not exists public.mass_timings (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('Sunday', 'Weekday', 'Saturday Anticipated', 'Special')),
  day_name text not null,
  time_display text not null,
  sort_order int default 10,
  language text not null default 'Malayalam',
  church text not null default 'Main Church',
  celebrant text not null default 'Fr. Vicar',
  intention_note text,
  created_at timestamptz default now()
);

-- 2. Parish Feasts & Events
create table if not exists public.parish_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Feast / Thirunal',
  start_date date not null default current_date,
  end_date date,
  date_display text not null,
  time_display text not null default '05:00 PM',
  venue text not null default 'Main Church',
  description text,
  image_url text,
  is_highlight boolean default false,
  status text not null default 'Published' check (status in ('Draft', 'Published')),
  created_at timestamptz default now()
);

-- 3. Clergy & Priests Directory
create table if not exists public.clergy (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'Vicar',
  designation text not null,
  photo_url text,
  phone text,
  email text,
  visiting_hours text,
  bio text,
  sort_order int default 10,
  created_at timestamptz default now()
);

-- 4. Parish Metadata (Singleton)
create table if not exists public.parish_profile (
  id int primary key default 1,
  name text not null,
  tagline text,
  patron_saint text,
  established text,
  liturgical_season text default 'Ordinary Time',
  address text,
  phone text,
  email text,
  bulletin_note text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- 5. Altar Prayer Intentions
create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  intention text not null,
  status text not null default 'Unread' check (status in ('Unread', 'Offered', 'Archived')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.mass_timings enable row level security;
alter table public.parish_events enable row level security;
alter table public.clergy enable row level security;
alter table public.parish_profile enable row level security;
alter table public.prayer_requests enable row level security;

-- Public READ
create policy "Public read mass timings" on public.mass_timings for select using (true);
create policy "Public read parish events" on public.parish_events for select using (status = 'Published');
create policy "Public read clergy" on public.clergy for select using (true);
create policy "Public read profile" on public.parish_profile for select using (true);
create policy "Public submit prayers" on public.prayer_requests for insert with check (true);

-- Authenticated (Admin) FULL
create policy "Admin full mass timings" on public.mass_timings for all to authenticated using (true);
create policy "Admin full parish events" on public.parish_events for all to authenticated using (true);
create policy "Admin full clergy" on public.clergy for all to authenticated using (true);
create policy "Admin full profile" on public.parish_profile for all to authenticated using (true);
create policy "Admin full prayers" on public.prayer_requests for all to authenticated using (true);

-- Initial Seed for Assumption Church, Pallikkunnu
insert into public.parish_profile (id, name, tagline, patron_saint, established, liturgical_season, address, phone, email, bulletin_note)
values (
  1,
  'Our Lady of Assumption Church, Pallikkunnu',
  'A vibrant Catholic faith community anchored in Marian devotion and Eucharistic grace',
  'Our Lady of the Assumption (സ്വർഗ്ഗാരോപിത മാതാവ്)',
  '1875',
  'Ordinary Time',
  'Pallikkunnu, Varandarappilly P.O., Thrissur District, Kerala - 680303',
  '+91 480 276 1234',
  'office@assumptionchurchpallikkunnu.org',
  'Solemn Annual Feast of Our Lady of the Assumption (സ്വർഗ്ഗാരോപണ തിരുനാൾ): Novena prayers begin Friday at 5:00 PM followed by solemn Holy Qurbana. All parishioners and pilgrims are warmly welcome.'
) on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  patron_saint = excluded.patron_saint,
  established = excluded.established,
  address = excluded.address,
  phone = excluded.phone,
  email = excluded.email,
  bulletin_note = excluded.bulletin_note;

-- Seed Mass Timings
insert into public.mass_timings (type, day_name, time_display, sort_order, language, church, celebrant, intention_note)
values
  ('Sunday', 'Sunday Morning', '06:30 AM', 1, 'Malayalam', 'Main Church', 'Fr. Vicar', 'Parishioners Intention'),
  ('Sunday', 'Sunday Morning (Solemn High Mass)', '08:30 AM', 2, 'Malayalam', 'Main Church', 'Fr. Vicar & Concelebrants', 'High Mass with Choir & Catechism Students'),
  ('Sunday', 'Sunday English Youth Mass', '10:15 AM', 3, 'English', 'Parish Hall Chapel', 'Fr. Assistant Vicar', 'Dedicated to Youth (KCYM) & Students'),
  ('Sunday', 'Sunday Evening Mass', '05:30 PM', 4, 'Malayalam', 'Main Church', 'Visiting Priest', 'Evening Mass & Novena Prayers'),
  ('Saturday Anticipated', 'Saturday Evening Anticipated Mass', '05:30 PM', 5, 'Malayalam', 'Main Church', 'Fr. Assistant Vicar', 'Anticipated Sunday Holy Mass & Novena'),
  ('Weekday', 'Monday to Friday Morning', '06:30 AM', 6, 'Malayalam', 'Adoration Chapel', 'Fr. Vicar', 'Morning Praise & Holy Qurbana'),
  ('Weekday', 'Tuesday & Friday Evening', '05:30 PM', 7, 'Malayalam', 'Main Church', 'Fr. Assistant Vicar', 'Marian Shrine Intercessory Mass'),
  ('Special', 'First Friday of the Month', '05:00 PM', 8, 'Malayalam', 'Main Church', 'Fr. Vicar & Clergy Team', 'Sacred Heart Eucharistic Adoration & Holy Mass');

-- Seed Parish Events
insert into public.parish_events (title, category, start_date, end_date, date_display, time_display, venue, description, is_highlight, status)
values
  ('Annual Feast of Our Lady of the Assumption (സ്വർഗ്ഗാരോപണ തിരുനാൾ)', 'Feast / Thirunal', '2026-08-10', '2026-08-15', 'Aug 10 - Aug 15, 2026', '05:00 PM Daily', 'Main Church Altar & Grounds', 'Solemn annual parish festival featuring Kodiyettam (flag hoisting), daily novena prayers, festive concelebrated Holy Qurbana with honored guest prelates, grand evening procession, and community fellowship.', true, 'Published'),
  ('24-Hour Eucharistic Adoration & Marian Vigil', 'Novenas & Adoration', '2026-08-01', null, 'First Saturday of Every Month', '06:00 AM to 06:00 AM', 'Adoration Chapel', 'Continuous Eucharistic adoration for family peace, vocations, and parish blessings. Family ward units take 1-hour turns.', false, 'Published'),
  ('Sunday Catechism Academic Year Inauguration', 'Catechism', '2026-06-07', null, 'Sunday, June 07', '08:30 AM Mass & 10:00 AM Assembly', 'Parish Auditorium', 'Blessing of school children, books, and commissioning of Sunday School catechists by Fr. Vicar.', false, 'Published');

-- Seed Clergy
insert into public.clergy (name, role, designation, phone, email, visiting_hours, bio, sort_order)
values
  ('Fr. Davis Chittilappilly', 'Vicar / Parish Priest', 'Vicar & Parish Priest', '+91 94470 12345', 'vicar@assumptionchurchpallikkunnu.org', 'Tue - Sat: 09:30 AM - 12:30 PM & 04:30 PM - 06:30 PM', 'Serving Our Lady of Assumption Church, Pallikkunnu with pastoral dedication, family prayer ministry, and community unity.', 1),
  ('Fr. Jijo Menachery', 'Assistant Vicar', 'Assistant Parish Priest & Youth Director', '+91 98461 67890', 'asst.vicar@assumptionchurchpallikkunnu.org', 'Mon - Fri: 10:00 AM - 01:00 PM', 'Coordinates Sunday School catechism, altar servers guild, and youth movement (KCYM) across the parish wards.', 2);
