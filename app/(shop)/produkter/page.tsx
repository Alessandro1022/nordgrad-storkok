import Link from 'next/link';
import type { Metadata } from 'next';
import ProductCard, { ProductGrid } from '@/components/ProductCard';
import { listProducts } from '@/lib/products';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Produkter' };

type Props = { searchParams: { q?: string; kategori?: string; sort?: string } };

export default async function ProductsPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() || '';
  const category = searchParams.kategori || '';
  const sort = searchParams.sort || '';
  let products = await listProducts({ q, category });
  if (sort === 'pris-upp') products = [...products].sort((a, b) => a.price - b.price);
  if (sort === 'pris-ned') products = [...products].sort((a, b) => b.price - a.price);

  const cat = site.categories.find((c) => c.slug === category);
  const title = cat ? cat.name : q ? `Sök: ${q}` : 'Alla produkter';
  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (category) p.set('kategori', category);
    if (q) p.set('q', q);
    for (const [k, v] of Object.entries(extra)) v ? p.set(k, v) : p.delete(k);
    const s = p.toString();
    return `/produkter${s ? `?${s}` : ''}`;
  };

  return (
    <div className="wrap pb-10 pt-8">
      <nav className="text-[13px] text-ink-mute" aria-label="Brödsmulor">
        <Link href="/" className="hover:text-ink">Start</Link>
        <span className="mx-2">/</span>
        {cat ? (
          <>
            <Link href="/produkter" className="hover:text-ink">Produkter</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{cat.name}</span>
          </>
        ) : (
          <span className="text-ink">Produkter</span>
        )}
      </nav>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-5">
        <div>
          <h1 className="text-[40px] font-bold leading-none tracking-tightest sm:text-[52px]">{title}</h1>
          {cat && <p className="mt-3 text-ink-soft">{cat.blurb}.</p>}
        </div>
        <p className="tabular text-[15px] text-ink-mute">{products.length} {products.length === 1 ? 'produkt' : 'produkter'}</p>
      </div>

      {cat && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {cat.subs.map((s) => {
            const term = s.split(' ')[0];
            const active = q.toLowerCase() === term.toLowerCase();
            return (
              <li key={s}>
                <Link
                  href={active ? `/produkter?kategori=${cat.slug}` : `/produkter?kategori=${cat.slug}&q=${encodeURIComponent(term)}`}
                  className={`block rounded-full border px-4 py-2 text-[14px] ${active ? 'border-ink bg-ink text-white' : 'border-steel-300 hover:border-ink'}`}
                >
                  {s}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <p className="text-[13px] font-semibold text-ink-mute">Kategorier</p>
          <ul className="mt-3 space-y-0.5 text-[15px]">
            <li>
              <Link href="/produkter" className={`block py-1.5 ${!category ? 'font-semibold' : 'text-ink-soft hover:text-ink'}`}>
                Alla produkter
              </Link>
            </li>
            {site.categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produkter?kategori=${c.slug}`} className={`flex items-center gap-2 py-1.5 ${category === c.slug ? 'font-semibold' : 'text-ink-soft hover:text-ink'}`}>
                  {category === c.slug && <span className="h-4 w-0.5 bg-accent" />}
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-steel-200 pt-6">
            <p className="font-semibold">Hittar du inte rätt maskin?</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">Vi tar in hela sortimentet från de stora tillverkarna.</p>
            <Link href="/kontakt" className="mt-3 inline-block text-[14px] font-semibold text-accent hover:underline">Fråga oss →</Link>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[14px]">
            <span className="text-ink-mute">Sortera:</span>
            {[
              ['', 'Populärast'],
              ['pris-upp', 'Lägsta pris'],
              ['pris-ned', 'Högsta pris'],
            ].map(([v, l]) => (
              <Link key={v} href={qs({ sort: v })} className={`rounded-full px-3 py-1.5 ${sort === v ? 'bg-steel-100 font-semibold' : 'text-ink-soft hover:text-ink'}`}>
                {l}
              </Link>
            ))}
          </div>

          {products.length ? (
            <ProductGrid cols={3}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ProductGrid>
          ) : (
            <div className="border border-dashed border-steel-300 px-6 py-16 text-center">
              <p className="text-[20px] font-bold tracking-tight">Inga produkter här ännu</p>
              <p className="mx-auto mt-2 max-w-sm text-ink-soft">
                Vi säljer mer än det som ligger ute. Berätta vad du letar efter så återkommer vi med pris.
              </p>
              <Link href="/kontakt" className="btn-dark mt-6">Skicka förfrågan</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
