import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AddToCart from '@/components/AddToCart';
import ProductCard, { ProductGrid } from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import { getProductBySlug, listProducts } from '@/lib/products';
import { inclVat, kr } from '@/lib/format';
import { discountPct } from '@/lib/product-utils';
import { categoryName, site } from '@/lib/site';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  return p ? { title: p.name, description: p.short } : { title: 'Produkten hittades inte' };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = (await listProducts({ category: product.category })).filter((p) => p.id !== product.id).slice(0, 4);
  const off = discountPct(product);

  return (
    <div className="pb-6 pt-8">
      <div className="wrap">
        <nav className="text-[13px] text-ink-mute" aria-label="Brödsmulor">
          <Link href="/" className="hover:text-ink">Start</Link>
          <span className="mx-2">/</span>
          <Link href={`/produkter?kategori=${product.category}`} className="hover:text-ink">{categoryName(product.category)}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          {/* Bild / ritning */}
          <div>
            <div className="drafting relative aspect-square border border-steel-200 p-4 sm:p-10">
              <ProductImage product={product} detailed />
              {off > 0 && (
                <span className="tabular absolute right-0 top-6 bg-signal py-1.5 pl-3 pr-4 text-[15px] font-bold text-ink [clip-path:polygon(10px_0,100%_0,100%_100%,10px_100%,0_50%)]">
                  −{off} %
                </span>
              )}
            </div>
            {!product.image_url && (
              <p className="mt-2 text-[13px] text-ink-mute">Måttskiss. Kontrollera mått mot tillverkarens produktblad före installation.</p>
            )}
          </div>

          {/* Köpruta */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <p className="artnr">Art.nr {product.sku || '—'} · {product.brand}</p>
            <h1 className="mt-2 text-[34px] font-bold leading-[1.05] tracking-tightest sm:text-[42px]">{product.name}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">{product.short}</p>

            <div className="mt-7 flex items-end gap-4">
              <p className="tabular text-[40px] font-bold leading-none tracking-tightest">{kr(product.price)}</p>
              {off > 0 && <p className="tabular pb-1 text-[17px] text-ink-mute line-through">{kr(product.compare_price!)}</p>}
            </div>
            <p className="tabular mt-2 text-[14px] text-ink-mute">exkl. moms · {kr(inclVat(product.price))} inkl. moms</p>

            <div className="mt-7">
              <AddToCart product={product} />
            </div>

            <dl className="mt-7 divide-y divide-steel-200 border-y border-steel-200 text-[15px]">
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-ink-mute">Lager</dt>
                <dd className={`flex items-center gap-2 font-medium ${product.stock > 0 ? 'text-ok' : 'text-warn'}`}>
                  <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-ok' : 'bg-warn'}`} />
                  {product.stock > 5 ? 'I lager' : product.stock > 0 ? `${product.stock} st kvar` : 'Beställningsvara'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-ink-mute">Leverans</dt>
                <dd className="font-medium">{product.stock > 0 ? '1–3 arbetsdagar' : '2–4 veckor'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-ink-mute">Frakt</dt>
                <dd className="font-medium">{product.price >= site.freeShippingFrom ? 'Fri frakt' : 'Från 895 kr'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-ink-mute">Delbetalning</dt>
                <dd className="tabular font-medium">från {kr(inclVat(product.price) / 36)}/mån</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-md bg-steel-100 p-4">
              <div>
                <p className="font-semibold">Behöver du installation?</p>
                <p className="text-[14px] text-ink-soft">Vi ansluter el, vatten och avlopp.</p>
              </div>
              <Link href="/kontakt" className="shrink-0 text-[14px] font-semibold text-accent hover:underline">Få pris →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Beskrivning + produktblad */}
      <div className="wrap mt-20 grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
        <section>
          <h2 className="text-[28px] font-bold tracking-tightest">Om maskinen</h2>
          <div className="prose-sv mt-5 max-w-[62ch]">
            {product.description.split(/\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
        {product.specs.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
              <h2 className="text-[28px] font-bold tracking-tightest">Produktblad</h2>
              <span className="artnr">{product.sku}</span>
            </div>
            <dl>
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 border-b border-steel-200 py-3 text-[15px]">
                  <dt className="text-ink-soft">{s.label}</dt>
                  <dd className="tabular font-mono text-[13.5px] font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="wrap mt-24">
          <h2 className="mb-6 text-[28px] font-bold tracking-tightest">Fler i {categoryName(product.category).toLowerCase()}</h2>
          <ProductGrid>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </section>
      )}
    </div>
  );
}
