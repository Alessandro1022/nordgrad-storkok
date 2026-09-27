import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata = { title: 'Om oss' };

export default function AboutPage() {
  return (
    <div className="wrap max-w-3xl py-12">
      <p className="eyebrow">Om oss</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Vi utrustar kök som ska hålla</h1>
      <div className="prose-sv mt-6">
        <p>
          {site.name} säljer köksmaskiner och storköksutrustning till restauranger, pizzerior, caféer, skolkök och hotell. Vi väljer
          maskiner efter hur de klarar ett riktigt pass: kapacitet, reservdelstillgång och hur lätta de är att hålla rena.
        </p>
        <p>
          Du får hjälp att räkna på rätt storlek innan köpet, och vi sköter leverans, installation och service efteråt. Vill du bygga ett
          helt kök tar vi fram en helhetslösning med maskiner, rostfri inredning och ventilation.
        </p>
        <h2>Det här kan du räkna med</h2>
        <p>Prisgaranti på hela sortimentet, delbetalning för företag, fri frakt över 10 000 kr och reservdelar i lager.</p>
      </div>
      <Link href="/kontakt" className="btn-primary mt-4">Kontakta oss</Link>
    </div>
  );
}
