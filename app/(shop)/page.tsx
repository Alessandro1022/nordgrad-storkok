/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import ProductCard, { ProductGrid } from '@/components/ProductCard';
import { listProducts } from '@/lib/products';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featured = await listProducts({ featured: true });
  const [big1, big2, ...small] = site.categories;

  return (
    <>
      {/* Hero */}
      <section className="bg-ink">
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col justify-between gap-10 px-4 py-12 sm:px-8 lg:py-16 lg:pl-[max(2rem,calc((100vw-1320px)/2+2rem))] lg:pr-12">
            <div>
              <p className="text-[14px] font-medium text-signal">Köksmaskiner för restaurang & storkök</p>
              <h1 className="mt-5 text-[44px] font-bold leading-[0.98] tracking-tightest text-white sm:text-[64px]">
                Maskinerna bakom varje service.
              </h1>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-white/70">
                Diskmaskiner, varmkök och kyl för restauranger, pizzerior och storkök. Vi hjälper dig välja rätt storlek, levererar och
                installerar.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/produkter" className="btn bg-white text-ink hover:bg-steel-100">Se hela sortimentet</Link>
              <Link href="/kontakt" className="btn border border-white/25 text-white hover:border-white">Be om offert</Link>
            </div>
          </div>
          <div className="relative min-h-[300px] sm:min-h-[420px] lg:min-h-[560px]">
            <img src={site.images.hero} alt="Kockar som arbetar i ett restaurangkök" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute bottom-0 left-0 hidden bg-white p-5 pr-8 sm:block">
              <p className="text-[13px] text-ink-mute">Rådgivning av storköksteknik</p>
              <p className="mt-0.5 text-[20px] font-bold tracking-tight">{site.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Löften */}
      <section className="border-b border-steel-200">
        <div className="wrap">
          <ul className="grid grid-cols-2 gap-px bg-steel-200 lg:grid-cols-4">
            {[
              ['1–3 dagar', 'leveranstid på lagervaror'],
              ['Fri frakt', `över ${site.freeShippingFrom.toLocaleString('sv-SE')} kr exkl. moms`],
              ['12–36 mån', 'delbetalning för företag'],
              ['Prisgaranti', 'hittar du lägre pris matchar vi'],
            ].map(([a, b]) => (
              <li key={a} className="bg-white py-6 pr-4 [&:nth-child(even)]:pl-5 lg:[&:not(:first-child)]:pl-6">
                <p className="text-[20px] font-bold tracking-tight">{a}</p>
                <p className="mt-0.5 text-[14px] text-ink-mute">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Kategorier */}
      <section className="wrap pt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[32px] font-bold tracking-tightest sm:text-[40px]">Sortiment</h2>
          <Link href="/produkter" className="pb-1.5 text-[15px] font-semibold underline decoration-steel-300 underline-offset-4 hover:decoration-ink">
            Alla produkter
          </Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[big1, big2].map((c) => (
            <CategoryTile key={c.slug} c={c} large />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {small.map((c) => (
            <CategoryTile key={c.slug} c={c} />
          ))}
        </div>
      </section>

      {/* Mest köpta */}
      <section className="wrap pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-bold tracking-tightest sm:text-[40px]">Mest köpta</h2>
            <p className="mt-2 text-ink-mute">Det restauranger och caféer beställer oftast just nu.</p>
          </div>
          <p className="text-[14px] text-ink-mute">Alla priser exkl. moms</p>
        </div>
        <div className="mt-6">
          {featured.length ? (
            <ProductGrid>
              {featured.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ProductGrid>
          ) : (
            <p className="text-ink-mute">Inga utvalda produkter ännu.</p>
          )}
        </div>
      </section>

      {/* Helhetslösning */}
      <section className="wrap pt-20">
        <div className="grid overflow-hidden rounded-lg bg-steel-100 lg:grid-cols-2">
          <div className="relative min-h-[280px]">
            <img src={site.images.complete} alt="Nyinstallerat storkök i rostfritt" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="p-8 sm:p-12 lg:p-14">
            <h2 className="text-[30px] font-bold leading-tight tracking-tightest sm:text-[36px]">Nytt kök från ritning till första servering</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              Skicka en skiss eller beskriv lokalen. Vi ritar upp köket, föreslår maskiner och rostfri inredning och tar hand om leverans och
              installation.
            </p>
            <ul className="mt-6 space-y-2.5 text-[15px]">
              {['Planritning och maskinförslag utan kostnad', 'Rostfria bänkar och kåpor efter mått', 'Behöriga installatörer för el, vatten och avlopp', 'Service och reservdelar efter öppning'].map((t) => (
                <li key={t} className="flex gap-3">
                  <svg className="mt-1 shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0e5a44" strokeWidth="2.4"><path d="M3 8.5l3 3 7-7" /></svg>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kontakt" className="btn-primary">Be om offert</Link>
              <Link href="/om-oss" className="btn-ghost">Så arbetar vi</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verksamheter */}
      <section className="wrap pt-20">
        <h2 className="text-[32px] font-bold tracking-tightest sm:text-[40px]">Vi utrustar</h2>
        <div className="mt-6 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {site.segments.map((s) => (
            <Link key={s.name} href={s.href} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-steel-100">
                <img src={s.image} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" loading="lazy" />
              </div>
              <h3 className="mt-4 text-[20px] font-bold tracking-tight group-hover:text-accent">{s.name}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function CategoryTile({ c, large = false }: { c: (typeof site.categories)[number]; large?: boolean }) {
  return (
    <Link
      href={`/produkter?kategori=${c.slug}`}
      className={`group relative block overflow-hidden rounded-md bg-ink ${large ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
    >
      <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.04]" loading="lazy" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
        <div>
          <h3 className={`font-bold tracking-tight text-white ${large ? 'text-[26px] sm:text-[32px]' : 'text-[18px] sm:text-[22px]'}`}>{c.name}</h3>
          {large && <p className="mt-1 text-[15px] text-white/80">{c.blurb}</p>}
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </span>
      </div>
    </Link>
  );
}
