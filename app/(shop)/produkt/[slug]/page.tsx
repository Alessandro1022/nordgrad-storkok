import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import AddToCart from '@/components/AddToCart';
import ProductCard from '@/components/ProductCard';
import ProductImage from '@/components/ProductImage';
import { getProductBySlug, listProducts } from '@/lib/products';
import { inclVat, kr } from '@/lib/format';
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
  const onSale = product.compare_price && product.compare_price > product.price;

  return (
    <div className="wrap py-10">
      <nav className="text-xs text-ink-mute" aria-label="Brödsmulor">
        <Link href="/" className="hover:text-ink">Hem</Link> /{' '}
        <Link href={`/produkter?kategori=${product.category}`} className="hover:text-ink">{categoryName(product.category)}</Link> /{' '}
        <span>{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square rounded-xl border border-steel-200 bg-steel-50 p-10">
          <ProductImage product={product} />
          {onSale && (
            <span className="absolute left-4 top-4 rounded bg-accent px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Kampanj
            </span>
          )}
        </div>

        <div>
          <p className="eyebrow">{product.brand} · {product.subcategory}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{product.short}</p>

          <div className="mt-6 border-y border-steel-200 py-5">
            <div className="flex items-baseline gap-3">
              <span className="tabular text-3xl font-bold">{kr(product.price)}</span>
              {onSale && <span className="tabular text-lg text-ink-mute line-through">{kr(product.compare_price!)}</span>}
            </div>
            <p className="tabular mt-1 text-sm text-ink-mute">exkl. moms · {kr(inclVat(product.price))} inkl. moms</p>
            <p className={`mt-3 flex items-center gap-2 text-sm font-medium ${product.stock > 0 ? 'text-ok' : 'text-warn'}`}>
              <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-ok' : 'bg-warn'}`} />
              {product.stock > 5 ? 'I lager, skickas inom 1–3 dagar' : product.stock > 0 ? `Endast ${product.stock} kvar i lager` : 'Tillfälligt slut – beställningsvara'}
            </p>
          </div>

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
            {site.usps.map((u) => (
              <li key={u} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0a5bd8" strokeWidth="2">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                {u}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="font-display text-2xl font-bold">Beskrivning</h2>
          <div className="prose-sv mt-4 max-w-[65ch]">
            {product.description.split(/\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
        {product.specs.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold">Teknisk data</h2>
            <dl className="mt-4 divide-y divide-steel-200 rounded-lg border border-steel-200">
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[1fr_1.3fr] gap-4 px-4 py-3 text-sm">
                  <dt className="text-ink-mute">{s.label}</dt>
                  <dd className="tabular font-mono text-[13px] font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Andra köpte också</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
