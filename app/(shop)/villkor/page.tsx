import { site } from '@/lib/site';

export const metadata = { title: 'Köpvillkor' };

export default function TermsPage() {
  return (
    <div className="wrap max-w-3xl py-12">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Köpvillkor</h1>
      <div className="prose-sv mt-6">
        <p>Dessa villkor gäller för köp hos {site.name} (org.nr {site.orgnr}). Försäljning sker i första hand till företag.</p>
        <h2>Priser</h2>
        <p>Alla priser anges exklusive moms om inget annat står. Moms tillkommer med 25 %. Vi reserverar oss för tryckfel och slutförsäljning.</p>
        <h2>Beställning och bekräftelse</h2>
        <p>När du lagt en beställning får du en orderbekräftelse via e-post. Avtalet är bindande först när vi har bekräftat ordern.</p>
        <h2>Leverans</h2>
        <p>Lagervaror skickas normalt inom 1–3 arbetsdagar. Frakt är fri över {site.freeShippingFrom.toLocaleString('sv-SE')} kr exkl. moms. Kontrollera godset vid leverans och anteckna synliga skador på fraktsedeln.</p>
        <h2>Betalning</h2>
        <p>Vi erbjuder faktura 30 dagar efter godkänd kreditprövning, delbetalning, kort, Swish och förskott.</p>
        <h2>Garanti och reklamation</h2>
        <p>Maskiner omfattas av tillverkarens garanti, normalt 12 månader. Reklamationer görs till {site.email}. Garantin gäller inte vid felaktig installation, bristande avkalkning eller normalt slitage.</p>
        <h2>Ångerrätt</h2>
        <p>Ångerrätt enligt distansavtalslagen gäller konsumenter. För företagsköp gäller öppet köp endast efter skriftlig överenskommelse.</p>
      </div>
    </div>
  );
}
