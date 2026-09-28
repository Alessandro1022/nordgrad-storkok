/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import Reveal from '@/components/Reveal';
import { listProducts } from '@/lib/products';
import { kr } from '@/lib/format';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word">
          <span style={{ animationDelay: `${start + i * 70}ms` }}>{w}</span>
          {' '}
        </span>
      ))}
    </>
  );
}

export default async function HomePage() {
  const products = await listProducts({ featured: true });
  const [lead, ...rest] = products;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <img src={site.images.hero} alt="" className="kenburns absolute inset-0 -z-10 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink/70 to-transparent" />

        <div className="wrap grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:py-32">
          <div>
            <p className="fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-white/85 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Köksmaskiner för restaurang & café
            </p>
            <h1 className="mt-6 text-[48px] font-bold leading-[0.95] tracking-tightest sm:text-[76px]">
              <Words text="Maskiner som klarar" />
              <br className="hidden sm:block" />
              <span className="text-signal">
                <Words text="rusningen." start={210} />
              </span>
            </h1>
            <p className="fade-up mt-7 max-w-md text-[18px] leading-relaxed text-white/75" style={{ animationDelay: '450ms' }}>
              Fritöser, diskmaskiner, ugnar och kylbänkar. Vi levererar på 1–3 dagar och kopplar in dem åt dig.
            </p>
            <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: '600ms' }}>
              <a href="#populart" className="btn group bg-white px-6 py-3.5 text-ink hover:bg-signal">
                Se maskinerna
                <svg className="transition-transform group-hover:translate-y-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v10M4 9l4 4 4-4" />
                </svg>
              </a>
              <Link href="/kontakt" className="btn border border-white/25 px-6 py-3.5 text-white hover:border-white hover:bg-white/10">
                Hjälp mig välja
              </Link>
            </div>
          </div>

          {lead && (
            <Link href={`/produkt/${lead.slug}`} className="float group hidden justify-self-end lg:block">
              <div className="w-[360px] rounded-3xl bg-white p-3 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
                <div className="relative aspect-[4/3] rounded-2xl bg-steel-100 p-6">
                  <ProductImage product={lead} className="transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-white">Mest såld</span>
                </div>
                <div className="flex items-end justify-between gap-4 px-3 pb-2 pt-4">
                  <div>
                    <p className="font-semibold leading-tight">{lead.name}</p>
                    <p className="mt-1 text-[13px] text-ink-mute">{lead.subcategory}</p>
                  </div>
                  <p className="tabular shrink-0 text-[22px] font-bold tracking-tight">{kr(lead.price)}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* ---------- Löften som rullar ---------- */}
      <div className="overflow-hidden border-b border-steel-200 bg-white py-4" aria-label="Våra löften">
        <ul className="marquee flex w-max">
          {[...site.usps, ...site.usps].map((u, i) => (
            <li key={i} aria-hidden={i >= site.usps.length} className="flex items-center gap-8 whitespace-nowrap pr-8 text-[15px] font-medium">
              {u}
              <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- Populärast ---------- */}
      <section id="populart" className="wrap scroll-mt-24 pt-20 sm:pt-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[36px] font-bold leading-none tracking-tightest sm:text-[52px]">Populärast just nu</h2>
            <p className="mt-4 max-w-lg text-[17px] text-ink-soft">Det här köper restauranger och caféer mest av. Alla priser exkl. moms.</p>
          </div>
          <Link href="/produkter" className="group flex items-center gap-2 pb-1 text-[15px] font-semibold">
            Alla maskiner
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-steel-100 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>

        {products.length ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
            {lead && (
              <Reveal className="md:col-span-2 lg:row-span-2">
                <ProductCard product={lead} large badge="Mest såld" />
              </Reveal>
            )}
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 90 + Math.floor(i / 2) * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-ink-mute">Inga produkter ännu. Lägg till i admin.</p>
        )}
      </section>

      {/* ---------- Så går det till ---------- */}
      <section className="wrap pt-24 sm:pt-32">
        <Reveal>
          <h2 className="text-[36px] font-bold leading-none tracking-tightest sm:text-[52px]">Så enkelt är det</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ['Välj maskin', 'Lägg den i varukorgen, eller ring oss om du är osäker på vilken storlek som passar.'],
            ['Vi levererar', `Lagervaror är hos dig inom 1–3 arbetsdagar. Fri frakt över ${site.freeShippingFrom.toLocaleString('sv-SE')} kr.`],
            ['Vi kopplar in', 'Vill du ha hjälp ansluter vår tekniker el, vatten och avlopp och provkör maskinen.'],
          ].map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 110} className="relative overflow-hidden rounded-2xl bg-steel-100 p-7 pt-24">
              <span className="tabular absolute -right-2 -top-6 text-[140px] font-bold leading-none tracking-tightest text-white" aria-hidden="true">
                {i + 1}
              </span>
              <p className="relative text-[13px] font-semibold text-accent">Steg {i + 1}</p>
              <h3 className="relative mt-1 text-[24px] font-bold tracking-tight">{t}</h3>
              <p className="relative mt-2 leading-relaxed text-ink-soft">{d}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------- Ring oss ---------- */}
      <section className="wrap pt-24 sm:pt-32">
        <Reveal className="relative overflow-hidden rounded-3xl bg-accent px-7 py-12 text-white sm:px-14 sm:py-16">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
          <div className="absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-white/5" aria-hidden="true" />
          <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-[32px] font-bold leading-[1.05] tracking-tightest sm:text-[46px]">Osäker på vilken maskin du behöver?</h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-white/80">
                Berätta vad du lagar och hur många gäster du har. Vi föreslår rätt storlek på fem minuter.
              </p>
            </div>
            <div className="lg:text-right">
              <p className="text-[14px] text-white/70">{site.hours}</p>
              <p className="tabular mt-1 select-all text-[36px] font-bold tracking-tight sm:text-[44px]">{site.phone}</p>
              <Link href="/kontakt" className="btn mt-4 bg-white text-ink hover:bg-signal">Eller skriv till oss</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
