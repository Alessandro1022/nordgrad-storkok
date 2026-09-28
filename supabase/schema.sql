-- Kör hela filen i Supabase: SQL Editor -> New query -> Run

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sku text default '',
  name text not null,
  brand text default '',
  category text not null default 'fritoser',
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

alter table public.products add column if not exists sku text default '';

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

-- Betalning (tillagt i version 3)
alter table public.orders add column if not exists shipping numeric not null default 0;
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists payment_provider text;
alter table public.orders add column if not exists payment_ref text;
alter table public.orders add column if not exists paid_at timestamptz;

-- Inställningar från admin (t.ex. betalnycklar). Bara servern kommer åt tabellen.
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;

-- RLS på utan policies = bara servern (service role) kommer åt tabellerna.
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;

-- Publik bucket för produktbilder
insert into storage.buckets (id, name, public)
values ('produkter', 'produkter', true)
on conflict (id) do nothing;

-- Startprodukterna (2 fritöser + 3 populära maskiner)
-- Tar bort äldre demoprodukter från första versionen om de finns
delete from public.products where slug in ('nordgrad-fd-50s-frontmatad-diskmaskin-avhardare', 'nordgrad-hd-60-huvdiskmaskin', 'nordgrad-gd-40-glasdiskmaskin');

insert into public.products (slug, sku, name, brand, category, subcategory, short, description, price, compare_price, stock, featured, art, specs, sort_order) values
('nordgrad-nf-8-bankfritos-8-liter', 'NG-201080', 'NF-8 Bänkfritös 8 L', 'Nordgrad', 'fritoser', 'Bänkfritös', 'Den fritös vi säljer mest. Liten nog för bänken, stark nog för en hel kväll med pommes.', 'NF-8 är en bänkfritös för café, food truck och mindre restaurang. Oljekaret på 8 liter och 3,2 kW-elementet ger snabb återhämtning mellan satserna, så att andra korgen blir lika krispig som den första.

Elementet fälls upp för rengöring och karet lyfts ur. Termostaten går mellan 50 och 190 °C, och ett separat överhettningsskydd stänger av om oljan blir för varm. Kopplas i ett vanligt 230V-uttag.', 3490, 3990, 32, true, 'fryer', '[{"label":"Kapacitet","value":"ca 6 kg pommes/tim"},{"label":"Volym","value":"8 L"},{"label":"Effekt","value":"3,2 kW"},{"label":"Temperatur","value":"50–190 °C"},{"label":"Korgar","value":"1"},{"label":"Anslutning","value":"230V 1N~"},{"label":"Mått (B×D×H)","value":"290 × 460 × 340 mm"}]'::jsonb, 1),
('nordgrad-gf-18-golvfritos-18-liter', 'NG-201180', 'GF-18 Golvfritös 18 L', 'Nordgrad', 'fritoser', 'Golvfritös', 'För grill, hamburgerrestaurang och pizzeria där fritösen går hela passet.', 'GF-18 är en fristående golvfritös med 18 liters kar och två korgar, så att du kan köra två portioner parallellt. Med 15 kW återhämtar sig oljan snabbt även när frysta pommes läggs i.

Kallzonen under elementen samlar smulor så att oljan håller längre. Oljan töms via en tappkran i skåpet, direkt i ett uppsamlingskärl.', 18900, null, 9, true, 'fryer', '[{"label":"Kapacitet","value":"ca 30 kg pommes/tim"},{"label":"Volym","value":"18 L"},{"label":"Effekt","value":"15 kW"},{"label":"Temperatur","value":"50–190 °C"},{"label":"Korgar","value":"2"},{"label":"Anslutning","value":"400V 3N~"},{"label":"Mått (B×D×H)","value":"400 × 700 × 900 mm"}]'::jsonb, 2),
('nordgrad-fd-50-frontmatad-diskmaskin', 'NG-104500', 'FD-50 Frontmatad diskmaskin', 'Nordgrad', 'diskmaskiner', 'Frontmatad / underbänk', 'Får plats under bänken och klarar lunchrusningen i café, pizzeria och mindre restaurang.', 'FD-50 är en frontmatad diskmaskin för kök med 40–80 kuvert per pass. Den tar standardkorgar 500 × 500 mm och har tre program för allt från glas till kastruller.

Sköljpumpen håller sköljvattnet på 85 °C även när maskinen körs tätt, och doseringen av disk- och sköljmedel är inbyggd.', 24900, 28900, 14, true, 'front', '[{"label":"Kapacitet","value":"30–40 korgar/tim"},{"label":"Korgstorlek","value":"500 × 500 mm"},{"label":"Effekt","value":"6,7 kW"},{"label":"Program","value":"90 / 120 / 180 s"},{"label":"Instickshöjd","value":"330 mm"},{"label":"Sköljtemperatur","value":"85 °C"},{"label":"Anslutning","value":"400V 3N~"},{"label":"Mått (B×D×H)","value":"600 × 600 × 820 mm"}]'::jsonb, 3),
('nordgrad-ku-4-konvektionsugn-4-plat', 'NG-301040', 'KU-4 Konvektionsugn med ånga', 'Nordgrad', 'ugnar', 'Konvektionsugn', 'Bakar, steker och värmer fyra plåtar samtidigt. Ångan håller kött saftigt och bröd luftigt.', 'KU-4 tar fyra GN 1/1 eller bakplåtar 600 × 400 mm. Två fläktar med automatisk riktningsväxling ger jämn värme på alla plåtar, så du slipper vända dem.

Befuktningen stängs på och av med en knapp. Luckan har dubbelglas som håller utsidan sval, och den öppnas sidledes så att den inte tar plats framför ugnen.', 21900, null, 6, true, 'oven', '[{"label":"Kapacitet","value":"4 × GN 1/1"},{"label":"Effekt","value":"6,4 kW"},{"label":"Temperatur","value":"50–270 °C"},{"label":"Plåtavstånd","value":"75 mm"},{"label":"Befuktning","value":"Ja"},{"label":"Anslutning","value":"400V 3N~"},{"label":"Mått (B×D×H)","value":"780 × 720 × 580 mm"}]'::jsonb, 4),
('nordgrad-kb-2-kylbank-2-dorrar', 'NG-401360', 'KB-2 Kylbänk 2 dörrar', 'Nordgrad', 'kyl', 'Kylbänk', 'Arbetsbänk och kyl i ett. Råvarorna ligger kalla precis där du jobbar.', 'KB-2 har två dörrar för GN 1/1 och en arbetsyta i rostfritt stål. Kylaggregatet går med det naturliga köldmediet R290, drar lite ström och håller +2 till +8 °C även när dörrarna öppnas ofta.

Dörrarna stänger själva, och listerna går att byta utan verktyg. Kopplas i ett vanligt 230V-uttag.', 14900, 16900, 11, true, 'fridge', '[{"label":"Volym","value":"260 L"},{"label":"Temperatur","value":"+2 till +8 °C"},{"label":"Effekt","value":"0,35 kW"},{"label":"Dörrar","value":"2"},{"label":"Köldmedium","value":"R290"},{"label":"Anslutning","value":"230V 1N~"},{"label":"Mått (B×D×H)","value":"1360 × 700 × 850 mm"}]'::jsonb, 5)
on conflict (slug) do update set sku = excluded.sku, name = excluded.name, category = excluded.category, subcategory = excluded.subcategory, short = excluded.short, description = excluded.description, specs = excluded.specs, art = excluded.art, sort_order = excluded.sort_order;
