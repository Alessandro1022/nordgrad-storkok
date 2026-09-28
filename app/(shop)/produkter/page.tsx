import Link from 'next/link';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { listProducts } from '@/lib/products';
import { categoryName, site } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Maskiner' };

type Props = { searchParams: { q?: string; kategori?: string } };

export default async function ProductsPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() || '';
  const category = searchParams.kategori || '';
  const all = await listProducts({ q });
  const products = category ? all.filter((p) => p.category === category) : all;
  const present = site.categories.filter((c) => all.some((p) => p.category === c.slug));

  return (
    <div className="wrap pt-12 sm:pt-16">
      <h1 className="fade-up text-[44px] font-bold leading-none tracking-tightest sm:text-[64px]">
        {category ? categoryName(category) : q ? `”${q}”` : 'Alla maskiner'}
      </h1>
      <p className="fade-up mt-4 text-[17px] text-ink-soft" style={{ animationDelay: '80ms' }}>
        {products.length} {products.length === 1 ? 'maskin' : 'maskiner'} · priser exkl. moms
      </p>

      {present.length > 1 && (
        <nav className="fade-up mt-8 flex flex-wrap gap-2" style={{ animationDelay: '160ms' }} aria-label="Filtrera">
          <Chip href="/produkter" active={!category}>Alla</Chip>
          {present.map((c) => (
            <Chip key={c.slug} href={`/produkter?kategori=${c.slug}`} active={category === c.slug}>
              {c.name}
              <span className="tabular ml-1.5 opacity-60">{all.filter((p) => p.category === c.slug).length}</span>
            </Chip>
          ))}
        </nav>
      )}

      {products.length ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl bg-steel-100 px-6 py-16 text-center">
          <p className="text-[22px] font-bold tracking-tight">Här finns inget ännu</p>
          <p className="mx-auto mt-2 max-w-sm text-ink-soft">Vi tar in fler maskiner på beställning. Berätta vad du letar efter så återkommer vi med pris.</p>
          <Link href="/kontakt" className="btn-dark mt-6">Skicka förfrågan</Link>
        </div>
      )}
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors ${active ? 'bg-ink text-white' : 'bg-steel-100 text-ink-soft hover:bg-steel-200 hover:text-ink'}`}
    >
      {children}
    </Link>
  );
}
