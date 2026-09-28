# Nordgrad Storkök – webbshop för köksmaskiner

Next.js 14 (App Router) · TypeScript · Tailwind · Supabase · Vercel

## Det här ingår

- **Butik**: startsida, kategorier, sök, sortering, produktsidor med teknisk data, varukorg, kassa och tack-sida
- **Cookies**: banner med Godkänn alla / Endast nödvändiga / Anpassa (statistik, marknadsföring). Valet sparas 180 dagar och kan ändras via ”Cookie-inställningar” i footern
- **Admin** (`/admin`): lägg till, redigera och ta bort produkter, ladda upp bilder, markera ”Mest köpta”, se ordrar och ändra status, läsa offertförfrågningar
- **Sidor**: Om oss, Kontakt/offert, Köpvillkor, Integritet & cookies
- 5 startprodukter: 2 fritöser, 1 diskmaskin, 1 konvektionsugn, 1 kylbänk
- **Betalning**: Stripe (kort, Apple Pay, Google Pay, Klarna, PayPal), Klarna direkt, PayPal direkt och faktura, styrt från admin

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
2. **SQL Editor → New query** → klistra in hela `supabase/schema.sql` → **Run**. Det skapar tabeller, bildbucket och startprodukterna. Filen går att köra igen efter uppdateringar.
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

## 4. Betalning: Stripe, Klarna och PayPal

Allt styrs från **Admin → Betalning**. Du klistrar in nycklarna, slår på det du vill ha och trycker Spara. Anslutningen testas direkt och du ser om den fungerar.

**Enklast: allt via Stripe.** Ett konto ger kort, Apple Pay, Google Pay, Klarna och PayPal.
1. Skapa konto på stripe.com och gå till **Developers → API keys**. Kopiera *Secret key* (`sk_test_…` för test, `sk_live_…` skarpt).
2. I Stripe: **Settings → Payment methods**, slå på Klarna och PayPal.
3. I admin: slå på Stripe, klistra in nyckeln och bocka i Kort, Klarna och PayPal.
4. Webhook (rekommenderas): **Developers → Webhooks → Add endpoint**. Adressen visas i admin (`https://din-sajt/api/webhooks/stripe`). Välj händelserna `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed` och `checkout.session.expired`. Klistra in *Signing secret* (`whsec_…`) i admin.

**Eget avtal med Klarna eller PayPal?** Slå på dem separat i admin, så går betalningen direkt till dem i stället för via Stripe.
- Klarna: användarnamn och lösenord från Klarna Merchant Portal → Settings → API credentials. Ordern skapas i Klarna när kunden betalat. Aktivera den i portalen när du skickar varan.
- PayPal: Client ID och Secret från developer.paypal.com → Apps & Credentials (Business-konto).

**Faktura** kan slås av och på. Den visas alltid om inget annat betalsätt är aktivt.

Ordrar som betalas online får status *Betald* automatiskt. Avbrutna betalningar får *Väntar på betalning* eller *Betalning misslyckad*.

Testa alltid med testnycklar (Stripe test, Klarna Playground, PayPal Sandbox) innan du byter till live.

## Ändra butikens namn och uppgifter

Allt samlat i `lib/site.ts`: namn, telefon, e-post, adress, org.nr, USP:er och kategorier.

## Bra att veta

- Priser lagras **exkl. moms**; inkl. moms räknas ut (25 %).
- Service role-nyckeln används bara på servern och når aldrig webbläsaren. Tabellerna har RLS påslaget utan publika policies.
