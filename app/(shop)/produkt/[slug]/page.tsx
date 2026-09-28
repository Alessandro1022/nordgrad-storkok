import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AddToCart from '@/components/AddToCart';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import Reveal from '@/components/Reveal';
import { getProductBySlug, listProducts } from '@/lib/products';
import { inclVat, kr } from '@/lib/format';
import { discountPct, keyFacts } from '@/lib/product-utils';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  return p ? { title: p.name, description: p.short } : { title: 'Produkten hittades inte' };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const others = (await listProducts({ featured: true })).filter((p) => p.id !== product.id).slice(0, 3);
  const off = discountPct(product);
  const inStock = product.stock > 0;

  return (
    <div className="pt-8">
      <div className="wrap">
        <Link href="/produkter" className="group inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft hover:text-ink">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Alla maskiner
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="fade-up">
            <div className="drafting relative aspect-square overflow-hidden rounded-3xl border border-steel-200 p-4 sm:p-10">
              <ProductImage product={product} detailed />
              {off > 0 && (
                <span className="tabular absolute left-5 top-5 rounded-full bg-signal px-3.5 py-1.5 text-[14px] font-bold">Spara {off} %</span>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="fade-up text-[14px] text-ink-mute">{product.subcategory} · Art.nr {product.sku || '—'}</p>
            <h1 className="fade-up mt-2 text-[38px] font-bold leading-[1.02] tracking-tightest sm:text-[48px]" style={{ animationDelay: '60ms' }}>
              {product.name}
            </h1>
            <p className="fade-up mt-4 text-[18px] leading-relaxed text-ink-soft" style={{ animationDelay: '120ms' }}>{product.short}</p>

            <dl className="fade-up mt-7 grid grid-cols-3 gap-2" style={{ animationDelay: '180ms' }}>
              {keyFacts(product).map((f) => (
                <div key={f.label} className="rounded-xl bg-steel-100 px-4 py-3">
                  <dt className="text-[12px] text-ink-mute">{f.label}</dt>
                  <dd className="tabular mt-0.5 font-semibold">{f.value.replace(/^ca /, '')}</dd>
                </div>
              ))}
            </dl>

            <div className="fade-up mt-8" style={{ animationDelay: '240ms' }}>
              <div className="flex items-end gap-3">
                <p className="tabular text-[44px] font-bold leading-none tracking-tightest">{kr(product.price)}</p>
                {off > 0 && <p className="tabular pb-1.5 text-[18px] text-ink-mute line-through">{kr(product.compare_price!)}</p>}
              </div>
              <p className="tabular mt-2 text-[14px] text-ink-mute">exkl. moms · {kr(inclVat(product.price))} inkl. moms</p>
            </div>

            <div className="fade-up mt-6" style={{ animationDelay: '300ms' }}>
              <AddToCart product={product} />
            </div>

            <ul className="fade-up mt-6 space-y-2.5 text-[15px]" style={{ animationDelay: '360ms' }}>
              <li className={`flex items-center gap-2.5 font-medium ${inStock ? 'text-ok' : 'text-warn'}`}>
                <span className="relative flex h-2.5 w-2.5">
                  {inStock && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-40" />}
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${inStock ? 'bg-ok' : 'bg-warn'}`} />
                </span>
                {inStock ? 'I lager, levereras inom 1–3 dagar' : 'Beställningsvara, 2–4 veckor'}
              </li>
              <li className="flex items-center gap-2.5 text-ink-soft">
                <Check />
                {product.price >= site.freeShippingFrom ? 'Fri frakt' : `Fri frakt över ${site.freeShippingFrom.toLocaleString('sv-SE')} kr`}
              </li>
              <li className="flex items-center gap-2.5 text-ink-soft">
                <Check />
                Delbetala från <span className="tabular font-medium text-ink">{kr(inclVat(product.price) / 36)}/mån</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="wrap mt-24 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="text-[28px] font-bold tracking-tightest">Om maskinen</h2>
          <div className="prose-sv mt-5 max-w-[62ch]">
            {product.description.split(/\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
        {product.specs.length > 0 && (
          <Reveal delay={100}>
            <h2 className="text-[28px] font-bold tracking-tightest">Teknisk data</h2>
            <dl className="mt-5 overflow-hidden rounded-2xl border border-steel-200">
              {product.specs.map((s, i) => (
                <div key={s.label} className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 px-5 py-3.5 text-[15px] ${i % 2 ? 'bg-steel-50' : 'bg-white'}`}>
                  <dt className="text-ink-soft">{s.label}</dt>
                  <dd className="tabular font-mono text-[13.5px] font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>

      {others.length > 0 && (
        <section className="wrap mt-24">
          <Reveal>
            <h2 className="text-[28px] font-bold tracking-tightest">Andra populära maskiner</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0e5a44" strokeWidth="2.4" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}
