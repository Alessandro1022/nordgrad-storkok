import { site } from '@/lib/site';
import CookieSettingsLink from '@/components/CookieSettingsLink';

export const metadata = { title: 'Integritet & cookies' };

export default function PrivacyPage() {
  return (
    <div className="wrap max-w-3xl py-12">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Integritetspolicy & cookies</h1>
      <div className="prose-sv mt-6">
        <p>{site.name} är personuppgiftsansvarig för de uppgifter du lämnar hos oss. Vi behandlar uppgifterna enligt dataskyddsförordningen (GDPR).</p>
        <h2>Vilka uppgifter vi sparar</h2>
        <p>Namn, företag, kontaktuppgifter och leveransadress när du beställer eller skickar en förfrågan. Uppgifterna används för att leverera, fakturera och besvara dig, och sparas så länge bokföringslagen kräver.</p>
        <h2>Cookies</h2>
        <p><strong>Nödvändiga</strong> cookies sparar din varukorg, ditt cookieval och inloggning. De kräver inget samtycke.</p>
        <p><strong>Statistik</strong> och <strong>marknadsföring</strong> används bara om du godkänt dem. Du kan ändra ditt val när som helst.</p>
        <h2>Dina rättigheter</h2>
        <p>Du har rätt att få ut, rätta eller radera dina uppgifter. Kontakta {site.email}. Du kan även lämna klagomål till Integritetsskyddsmyndigheten (IMY).</p>
      </div>
      <div className="mt-2 inline-block rounded-md border border-steel-300 px-4 py-2 text-sm font-semibold">
        <CookieSettingsLink />
      </div>
    </div>
  );
}
