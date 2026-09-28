import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import { listMessages, listOrders, listProducts } from '@/lib/products';
import { kr } from '@/lib/format';
import { categoryName } from '@/lib/site';
import { deleteProduct, toggleFeatured } from '../actions';

export default async function AdminProducts({ searchParams }: { searchParams: { sparad?: string; borttagen?: string } }) {
  const [products, orders, messages] = await Promise.all([listProducts(), listOrders(), listMessages()]);
  const newOrders = orders.filter((o) => o.status === 'ny' || o.status === 'betald').length;
  const lowStock = products.filter((p) => p.stock <= 3).length;

  return (
    <div className="space-y-6">
      {searchParams.sparad && <Flash>Produkten sparades.</Flash>}
      {searchParams.borttagen && <Flash>Produkten togs bort.</Flash>}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Produkter" value={products.length} />
        <Stat label="Nya ordrar" value={newOrders} href="/admin/ordrar" highlight={newOrders > 0} />
        <Stat label="Lågt lager (≤3)" value={lowStock} highlight={lowStock > 0} />
        <Stat label="Meddelanden" value={messages.length} href="/admin/meddelanden" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Produkter</h1>
        <Link href="/admin/produkter/ny" className="btn-primary py-2.5">+ Lägg till produkt</Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-steel-200 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-steel-200 bg-steel-50 text-left">
            <tr className="eyebrow">
              <th className="px-4 py-3 font-medium">Produkt</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 text-right font-medium">Pris exkl.</th>
              <th className="px-4 py-3 text-right font-medium">Lager</th>
              <th className="px-4 py-3 font-medium">Mest köpt</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100">
            {products.map((p) => (
              <tr key={p.id} className="align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded bg-steel-50 p-1">
                      <ProductImage product={p} />
                    </div>
                    <div>
                      <Link href={`/admin/produkter/${p.id}`} className="font-semibold hover:text-accent">{p.name}</Link>
                      <p className="text-xs text-ink-mute">{p.subcategory}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{categoryName(p.category)}</td>
                <td className="tabular px-4 py-3 text-right font-medium">{kr(p.price)}</td>
                <td className={`tabular px-4 py-3 text-right ${p.stock <= 3 ? 'font-semibold text-warn' : ''}`}>{p.stock}</td>
                <td className="px-4 py-3">
                  <form action={toggleFeatured}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="next" value={String(!p.featured)} />
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${p.featured ? 'bg-accent-tint text-accent' : 'bg-steel-100 text-ink-mute'}`}
                      title="Visa under Mest köpta på startsidan"
                    >
                      {p.featured ? 'Ja' : 'Nej'}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/produkt/${p.slug}`} target="_blank" className="rounded px-2 py-1 text-xs text-ink-mute hover:text-ink">Visa</Link>
                    <Link href={`/admin/produkter/${p.id}`} className="rounded border border-steel-300 px-2.5 py-1 text-xs font-semibold hover:border-ink">Redigera</Link>
                    <details className="relative">
                      <summary className="cursor-pointer list-none rounded px-2 py-1 text-xs text-red-700 hover:bg-red-50">Ta bort</summary>
                      <div className="absolute right-0 z-10 mt-1 w-52 rounded-md border border-steel-200 bg-white p-3 shadow-lg">
                        <p className="text-xs">Ta bort {p.name}? Det går inte att ångra.</p>
                        <form action={deleteProduct} className="mt-2">
                          <input type="hidden" name="id" value={p.id} />
                          <button className="w-full rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Ja, ta bort</button>
                        </form>
                      </div>
                    </details>
                  </div>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-mute">Inga produkter ännu.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, href, highlight }: { label: string; value: number; href?: string; highlight?: boolean }) {
  const inner = (
    <div className={`rounded-lg border bg-white p-4 ${highlight ? 'border-accent' : 'border-steel-200'}`}>
      <p className="eyebrow">{label}</p>
      <p className={`tabular mt-1 font-display text-3xl font-bold ${highlight ? 'text-accent' : ''}`}>{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function Flash({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{children}</p>;
}
