import Link from 'next/link';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { listProducts } from '@/lib/products';
import { categoryName, site } from '@/lib/site';

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

  const title = q ? `Sökresultat för ”${q}”` : category ? categoryName(category) : 'Alla produkter';

  return (
    <div className="wrap py-10">
      <nav className="text-xs text-ink-mute" aria-label="Brödsmulor">
        <Link href="/" className="hover:text-ink">Hem</Link> / <span>Produkter</span>
      </nav>
      <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <p className="eyebrow mb-3">Kategori</p>
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0.5">
            <li>
              <Link
                href="/produkter"
                className={`block rounded-md px-3 py-2 text-sm ${!category ? 'bg-ink font-semibold text-white' : 'hover:bg-steel-100'}`}
              >
                Alla
              </Link>
            </li>
            {site.categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/produkter?kategori=${c.slug}`}
                  className={`block rounded-md px-3 py-2 text-sm ${category === c.slug ? 'bg-ink font-semibold text-white' : 'hover:bg-steel-100'}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <form className="mb-5 flex flex-wrap items-center gap-3" action="/produkter">
            {category && <input type="hidden" name="kategori" value={category} />}
            <label htmlFor="list-q" className="sr-only">Sök</label>
            <input id="list-q" name="q" defaultValue={q} placeholder="Sök i sortimentet" className="input max-w-xs flex-1" />
            <label htmlFor="list-sort" className="sr-only">Sortera</label>
            <select id="list-sort" name="sort" defaultValue={sort} className="input w-auto">
              <option value="">Populärast</option>
              <option value="pris-upp">Pris: lägst först</option>
              <option value="pris-ned">Pris: högst först</option>
            </select>
            <button className="btn-dark py-2.5">Visa</button>
            <span className="tabular ml-auto text-sm text-ink-mute">{products.length} produkter</span>
          </form>

          {products.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-steel-300 p-10 text-center">
              <p className="font-semibold">Inga produkter här ännu.</p>
              <p className="mt-1 text-sm text-ink-mute">
                Hittar du inte det du söker? <Link href="/kontakt" className="text-accent underline">Kontakta oss</Link> så tar vi fram en offert.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
