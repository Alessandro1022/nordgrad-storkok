-- Kör hela filen i Supabase: SQL Editor -> New query -> Run

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text default '',
  category text not null default 'diskmaskiner',
  subcategory text default '',
  short text default '',
  description text default '',
  price numeric not null default 0,
  compare_price numeric,
  stock integer not null default 0,
  featured boolean not null default false,
  image_url text,
  art text not null default 'generic',
  specs jsonb not null default '[]'::jsonb,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'ny',
  total numeric not null default 0,
  customer jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text not null
);

-- RLS på utan policies = bara servern (service role) kommer åt tabellerna.
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;

-- Publik bucket för produktbilder
insert into storage.buckets (id, name, public)
values ('produkter', 'produkter', true)
on conflict (id) do nothing;

-- De fyra startprodukterna
insert into public.products (slug, name, brand, category, subcategory, short, description, price, compare_price, stock, featured, art, specs, sort_order) values
('nordgrad-fd-50-frontmatad-diskmaskin', 'FD-50 Frontmatad diskmaskin', 'Nordgrad', 'diskmaskiner', 'Fristående / underbänk',
 'Vår mest sålda diskmaskin. Klarar lunchrusningen i café, pizzeria och mindre restaurang.',
 'FD-50 är en fristående frontmatad diskmaskin för kök med 40–80 kuvert per pass. Den får plats under en vanlig bänk och tar standardkorgar 500×500 mm. Tre program täcker allt från glas till kastruller, och sköljpumpen håller sköljtemperaturen jämn på 85 °C även när maskinen körs tätt. Diskmedels- och sköljmedelsdosering är inbyggd.',
 24900, 28900, 14, true, 'front',
 '[{"label":"Korgstorlek","value":"500 × 500 mm"},{"label":"Kapacitet","value":"30–40 korgar/tim"},{"label":"Program","value":"90 / 120 / 180 s"},{"label":"Instickshöjd","value":"330 mm"},{"label":"Sköljtemperatur","value":"85 °C"},{"label":"Anslutning","value":"400V 3N~ / 6,7 kW"},{"label":"Mått (B×D×H)","value":"600 × 600 × 820 mm"}]', 1),
('nordgrad-fd-50s-frontmatad-diskmaskin-avhardare', 'FD-50S Frontmatad diskmaskin med avhärdare', 'Nordgrad', 'diskmaskiner', 'Fristående / underbänk',
 'Samma arbetshäst som FD-50, med inbyggd avhärdare och avloppspump.',
 'FD-50S är för kök med hårt vatten eller där avloppet sitter högt. Den inbyggda avhärdaren skyddar elementen mot kalk och ger fläckfria glas utan eftertorkning. Avloppspumpen gör att maskinen kan placeras fritt i köket. Dubbelväggig isolerad lucka håller ljudnivån nere och värmen inne.',
 31900, null, 8, true, 'front',
 '[{"label":"Korgstorlek","value":"500 × 500 mm"},{"label":"Kapacitet","value":"30–40 korgar/tim"},{"label":"Program","value":"90 / 120 / 180 s"},{"label":"Instickshöjd","value":"330 mm"},{"label":"Avhärdare","value":"Inbyggd"},{"label":"Avloppspump","value":"Ja"},{"label":"Anslutning","value":"400V 3N~ / 6,7 kW"},{"label":"Mått (B×D×H)","value":"600 × 620 × 850 mm"}]', 2),
('nordgrad-hd-60-huvdiskmaskin', 'HD-60 Huvdiskmaskin', 'Nordgrad', 'diskmaskiner', 'Huvdiskmaskin',
 'Hög kapacitet för restauranger, skolkök och hotell. Lyft huven, skjut in korgen, klart.',
 'HD-60 är en genomskjutsmaskin som byggs ihop med till- och frånbänk till en diskstation. Huven startar programmet automatiskt när den fälls ned. Med 60 korgar i timmen och 440 mm instickshöjd tar den både GN-kantiner och bakplåtar. Dubbla diskarmar i rostfritt ger jämnt resultat i hela korgen.',
 49900, 54900, 5, true, 'hood',
 '[{"label":"Korgstorlek","value":"500 × 500 mm"},{"label":"Kapacitet","value":"upp till 60 korgar/tim"},{"label":"Program","value":"60 / 90 / 180 s"},{"label":"Instickshöjd","value":"440 mm"},{"label":"Start","value":"Automatisk vid stängd huv"},{"label":"Anslutning","value":"400V 3N~ / 9,8 kW"},{"label":"Mått (B×D×H)","value":"680 × 760 × 1480 mm (öppen huv 1930 mm)"}]', 3),
('nordgrad-gd-40-glasdiskmaskin', 'GD-40 Glasdiskmaskin', 'Nordgrad', 'diskmaskiner', 'Glasdiskmaskin',
 'Kompakt glasdiskare för bar och café. Får plats under bardisken.',
 'GD-40 är byggd för glas och koppar. Lägre disktemperatur och mjukt sköljtryck skonar glasen, och ett 120-sekundersprogram gör att baren aldrig står utan rena glas. Kompakta mått på 450 mm bredd gör den lätt att placera under en bardisk.',
 16900, null, 20, true, 'glass',
 '[{"label":"Korgstorlek","value":"400 × 400 mm"},{"label":"Kapacitet","value":"30 korgar/tim"},{"label":"Program","value":"120 / 180 s"},{"label":"Instickshöjd","value":"270 mm"},{"label":"Anslutning","value":"230V 1N~ / 3,1 kW"},{"label":"Mått (B×D×H)","value":"450 × 530 × 700 mm"}]', 4)
on conflict (slug) do nothing;
