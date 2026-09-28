import { listOrders } from '@/lib/products';
import { dateTime, kr } from '@/lib/format';
import { setOrderStatus } from '../../actions';

const STATUSES = [
  ['ny', 'Ny', 'bg-accent-tint text-accent'],
  ['vantar', 'Väntar på betalning', 'bg-steel-100 text-ink-mute'],
  ['betald', 'Betald', 'bg-green-100 text-green-800'],
  ['bekraftad', 'Bekräftad', 'bg-amber-50 text-amber-800'],
  ['skickad', 'Skickad', 'bg-green-50 text-green-800'],
  ['avbruten', 'Avbruten', 'bg-steel-100 text-ink-mute'],
  ['misslyckad', 'Betalning misslyckad', 'bg-red-50 text-red-700'],
] as const;

// Knapparna admin kan välja manuellt (betalstatus sätts automatiskt).
const MANUAL = ['ny', 'bekraftad', 'skickad', 'avbruten'];
const METHOD: Record<string, string> = { card: 'Kort', klarna: 'Klarna', paypal: 'PayPal', invoice: 'Faktura' };

export default async function OrdersPage() {
  const orders = await listOrders();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Ordrar</h1>
      {!orders.length && <p className="rounded-lg border border-dashed border-steel-300 bg-white p-10 text-center text-ink-mute">Inga ordrar ännu.</p>}
      <ul className="space-y-3">
        {orders.map((o) => {
          const st = STATUSES.find((s) => s[0] === o.status) ?? STATUSES[0];
          return (
            <li key={o.id} className="rounded-lg border border-steel-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="tabular font-mono text-xs text-ink-mute">#{o.id.slice(0, 8).toUpperCase()} · {dateTime(o.created_at)}</p>
                  <p className="mt-1 font-semibold">{o.customer.company || o.customer.name}</p>
                  <p className="text-sm text-ink-soft">
                    {o.customer.name} · <span className="select-all">{o.customer.email}</span> · {o.customer.phone}
                  </p>
                  <p className="text-sm text-ink-soft">{o.customer.address}, {o.customer.zip} {o.customer.city}</p>
                  <p className="mt-1 text-xs text-ink-mute">
                    Betalning: {METHOD[o.payment_method ?? ''] ?? o.customer.payment ?? '–'}
                    {o.payment_provider && o.payment_provider !== 'manual' ? ` via ${o.payment_provider}` : ''}
                    {o.payment_ref ? ` · ref ${o.payment_ref}` : ''}
                    {o.customer.orgnr ? ` · Org.nr ${o.customer.orgnr}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${st[2]}`}>{st[1]}</span>
                  <p className="tabular mt-2 text-lg font-bold">{kr(o.total)}</p>
                  <p className="text-xs text-ink-mute">inkl. moms</p>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-steel-100 rounded-md border border-steel-100 text-sm">
                {o.items.map((i) => (
                  <li key={i.id} className="tabular flex justify-between gap-3 px-3 py-2">
                    <span>{i.qty} × {i.name}</span>
                    <span>{kr(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              {o.customer.note && <p className="mt-3 rounded-md bg-steel-50 p-3 text-sm">”{o.customer.note}”</p>}
              <form action={setOrderStatus} className="mt-4 flex flex-wrap gap-2">
                <input type="hidden" name="id" value={o.id} />
                {STATUSES.filter(([v]) => MANUAL.includes(v)).map(([v, l]) => (
                  <button key={v} name="status" value={v} disabled={o.status === v} className="rounded-md border border-steel-300 px-3 py-1.5 text-xs font-semibold hover:border-ink disabled:border-ink disabled:bg-ink disabled:text-white">
                    {l}
                  </button>
                ))}
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
