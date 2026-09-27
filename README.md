# Nordgrad Storkök – webbshop för köksmaskiner

Next.js 14 (App Router) · TypeScript · Tailwind · Supabase · Vercel

## Det här ingår

- **Butik**: startsida, kategorier, sök, sortering, produktsidor med teknisk data, varukorg, kassa och tack-sida
- **Cookies**: banner med Godkänn alla / Endast nödvändiga / Anpassa (statistik, marknadsföring). Valet sparas 180 dagar och kan ändras via ”Cookie-inställningar” i footern
- **Admin** (`/admin`): lägg till, redigera och ta bort produkter, ladda upp bilder, markera ”Mest köpta”, se ordrar och ändra status, läsa offertförfrågningar
- **Sidor**: Om oss, Kontakt/offert, Köpvillkor, Integritet & cookies
- 4 startprodukter (diskmaskiner): 2 fristående frontmatade, 1 huvdiskmaskin, 1 glasdiskmaskin

**Admin-inloggning:** `admin@admin.se` / `test123` (ändras via miljövariabler, se nedan).

## 1. Ladda upp till GitHub

1. Packa upp zip-filen.
2. GitHub → **New repository** → t.ex. `nordgrad-storkok` → Create.
3. Klicka **uploading an existing file** och dra in *innehållet* i mappen (inte själva mappen). Commit.

## 2. Deploy på Vercel

1. Vercel → **Add New → Project** → välj repot → **Deploy**.
2. Sidan fungerar direkt i **demoläge** (startprodukterna visas, admin går att logga in i) men ändringar sparas inte förrän Supabase är kopplat.

## 3. Koppla Supabase (för att admin ska kunna spara)

1. Skapa ett projekt på supabase.com.
2. **SQL Editor → New query** → klistra in hela `supabase/schema.sql` → **Run**. Det skapar tabeller, bildbucket och de 4 produkterna.
3. **Project Settings → API**: kopiera Project URL och `service_role`-nyckeln.
4. Vercel → projektet → **Settings → Environment Variables**, lägg till:

| Namn | Värde |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role-nyckeln |
| `ADMIN_EMAIL` | admin@admin.se |
| `ADMIN_PASSWORD` | test123 (byt innan skarp lansering) |
| `AUTH_SECRET` | lång slumpsträng, minst 32 tecken |

5. **Deployments → ⋯ → Redeploy**.

## Ändra butikens namn och uppgifter

Allt samlat i `lib/site.ts`: namn, telefon, e-post, adress, org.nr, USP:er och kategorier.

## Bra att veta

- Priser lagras **exkl. moms**; inkl. moms räknas ut (25 %).
- Kassan skapar en order som betalas via faktura/betallänk efteråt. Kortbetalning direkt i kassan (Stripe/Klarna) kan kopplas på senare.
- Service role-nyckeln används bara på servern och når aldrig webbläsaren. Tabellerna har RLS påslaget utan publika policies.
