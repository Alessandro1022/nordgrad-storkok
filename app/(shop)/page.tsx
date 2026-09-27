import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import { listProducts } from '@/lib/products';
import { inclVat, kr } from '@/lib/format';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featured = await listProducts({ featured: true });
  const hero = featured[0];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-steel-200 bg-steel-50">
        <div className="wrap grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">Storköksutrustning · Leverans i hela Sverige</p>
            <h1
              className="mt-4 font-display text-[40px] font-extrabold leading-[1.02] tracking-tight sm:text-[56px]"
              style={{ fontStretch: '112%' }}
            >
              Köksmaskiner för kök som aldrig tar paus.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              Diskmaskiner, varmkök och kyl för restaurang, café och storkök. Vi hjälper dig välja rätt kapacitet, levererar och
              installerar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/produkter" className="btn-primary">
                Utforska sortimentet
              </Link>
              <Link href="/kontakt" className="btn-ghost">
                Begär offert på helhetslösning
              </Link>
            </div>
          </div>

          {hero && (
            <Link
              href={`/produkt/${hero.slug}`}
              className="group relative block rounded-xl border border-steel-200 bg-white p-6 transition hover:border-steel-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-accent">Mest säljande</p>
                  <p className="mt-1 font-display text-xl font-bold">{hero.name}</p>
                </div>
                <div className="text-right">
                  <p className="tabular text-xl font-bold">{kr(hero.price)}</p>
                  <p className="tabular text-xs text-ink-mute">{kr(inclVat(hero.price))} inkl. moms</p>
                </div>
              </div>
              <div className="mx-auto my-4 aspect-square max-w-[300px]">
                <ProductImage product={hero} className="transition duration-300 group-hover:scale-[1.02]" />
              </div>
              <dl className="grid grid-cols-3 divide-x divide-steel-200 rounded-lg border border-steel-200 text-center">
                {hero.specs.slice(0, 3).map((s) => (
                  <div key={s.label} className="px-2 py-3">
                    <dt className="eyebrow text-[10px]">{s.label}</dt>
                    <dd className="tabular mt-1 text-sm font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          )}
        </div>
      </section>

      {/* Kategorier */}
      <section className="wrap py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Handla efter kategori</h2>
          <Link href="/produkter" className="text-sm font-semibold text-accent hover:underline">
            Alla produkter →
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {site.categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/produkter?kategori=${c.slug}`}
                className="group flex h-full flex-col justify-between gap-6 rounded-lg border border-steel-200 p-5 transition hover:border-ink"
              >
                <span className="font-display text-lg font-bold">{c.name}</span>
                <span className="flex items-end justify-between gap-3 text-sm text-ink-mute">
                  {c.blurb}
                  <span className="text-ink transition group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Mest köpta */}
      <section className="wrap pb-6">
        <div className="mb-6">
          <p className="eyebrow">Topplistan</p>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Mest köpta just nu</h2>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-ink-mute">Inga utvalda produkter ännu.</p>
        )}
      </section>

      {/* Process */}
      <section className="wrap py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Från beställning till första disken</h2>
            <p className="mt-3 text-ink-soft">
              Vi tar hand om hela kedjan så att köket står still så kort tid som möjligt.
            </p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-lg border border-steel-200 bg-steel-200 sm:grid-cols-2">
            {[
              ['Rådgivning', 'Vi räknar på kuvert per pass och föreslår rätt kapacitet och anslutning.'],
              ['Leverans', 'Fraktfritt över 10 000 kr. Vi bokar tid som passar köket.'],
              ['Installation', 'Behörig tekniker ansluter el, vatten och avlopp och provkör maskinen.'],
              ['Service', 'Reservdelar i lager och serviceavtal när du vill slippa tänka på det.'],
            ].map(([t, d], i) => (
              <li key={t} className="bg-white p-6">
                <span className="tabular font-mono text-xs text-accent">Steg {i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Offert */}
      <section className="wrap">
        <div className="flex flex-col gap-6 rounded-xl bg-ink p-8 text-white sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Ska du bygga eller byta ut ett helt kök?</h2>
            <p className="mt-3 text-steel-300">
              Skicka en skiss eller beskriv verksamheten. Du får en kostnadsfri offert med maskiner, rostfri inredning och installation.
            </p>
          </div>
          <Link href="/kontakt" className="btn bg-white text-ink hover:bg-steel-100">
            Be om offert
          </Link>
        </div>
      </section>
    </>
  );
}
