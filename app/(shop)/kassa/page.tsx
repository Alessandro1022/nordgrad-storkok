'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useCart } from '@/components/CartProvider';
import ProductImage from '@/components/ProductImage';
import { inclVat, kr } from '@/lib/format';
import { site } from '@/lib/site';
import { placeOrder, type CheckoutState } from './actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary w-full py-3.5 text-base" disabled={pending}>
      {pending ? 'Skickar beställning…' : 'Slutför beställning'}
    </button>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [state, action] = useFormState<CheckoutState, FormData>(placeOrder, { ok: false });

  useEffect(() => {
    if (state.ok && state.orderId) {
      clear();
      router.push(`/tack?order=${state.orderId}`);
    }
  }, [state, clear, router]);

  const shipping = subtotal >= site.freeShippingFrom || subtotal === 0 ? 0 : 895;
  const vat = (subtotal + shipping) * site.vatRate;

  if (!items.length && !state.ok) {
    return (
      <div className="wrap py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">Kassan</h1>
        <p className="mt-3 text-ink-mute">Varukorgen är tom.</p>
        <Link href="/produkter" className="btn-dark mt-6">Se sortimentet</Link>
      </div>
    );
  }

  return (
    <div className="wrap py-10">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Kassa</h1>
      <form action={action} className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <input type="hidden" name="cart" value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty })))} />

        <div className="space-y-8">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-4 font-display text-xl font-bold">Företag & kontakt</legend>
            <Field id="company" label="Företag" autoComplete="organization" />
            <Field id="orgnr" label="Org.nr" />
            <Field id="name" label="Namn *" autoComplete="name" required />
            <Field id="phone" label="Telefon *" type="tel" autoComplete="tel" required />
            <div className="sm:col-span-2">
              <Field id="email" label="E-post *" type="email" autoComplete="email" required />
            </div>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-[2fr_1fr_1.4fr]">
            <legend className="mb-4 font-display text-xl font-bold">Leveransadress</legend>
            <div className="sm:col-span-3">
              <Field id="address" label="Gatuadress *" autoComplete="street-address" required />
            </div>
            <Field id="zip" label="Postnummer *" autoComplete="postal-code" required />
            <div className="sm:col-span-2">
              <Field id="city" label="Ort *" autoComplete="address-level2" required />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-display text-xl font-bold">Betalning</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['faktura', 'Faktura 30 dagar', 'För företag, efter kreditkontroll'],
                ['delbetalning', 'Delbetalning', 'Dela upp på 12–36 månader'],
                ['kort', 'Kort / Swish', 'Vi skickar betallänk efter bekräftelse'],
                ['forskott', 'Förskott', 'Betala mot förskottsfaktura'],
              ].map(([v, t, d], i) => (
                <label key={v} className="flex cursor-pointer gap-3 rounded-lg border border-steel-300 p-4 has-[:checked]:border-accent has-[:checked]:bg-accent-tint">
                  <input type="radio" name="payment" value={v} defaultChecked={i === 0} className="mt-1 accent-accent" />
                  <span>
                    <span className="block text-sm font-semibold">{t}</span>
                    <span className="block text-xs text-ink-mute">{d}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="note" className="label">Meddelande (t.ex. leveranstid eller installation)</label>
            <textarea id="note" name="note" rows={3} className="input" />
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border border-steel-200 bg-steel-50 p-5 lg:sticky lg:top-40">
          <h2 className="font-display text-lg font-bold">Din order</h2>
          <ul className="divide-y divide-steel-200">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-3">
                <div className="h-14 w-14 shrink-0 rounded bg-white p-1">
                  <ProductImage product={i} />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium leading-snug">{i.name}</p>
                  <p className="tabular text-xs text-ink-mute">{i.qty} st</p>
                </div>
                <span className="tabular text-sm font-semibold">{kr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="tabular space-y-1.5 border-t border-steel-200 pt-4 text-sm">
            <Row k="Delsumma" v={kr(subtotal)} />
            <Row k="Frakt" v={shipping ? kr(shipping) : 'Fri frakt'} />
            <Row k="Moms 25 %" v={kr(vat)} />
            <div className="flex justify-between border-t border-steel-200 pt-2 text-base font-bold">
              <dt>Att betala</dt>
              <dd>{kr(inclVat(subtotal + shipping))}</dd>
            </div>
          </dl>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="terms" id="terms" className="mt-1 accent-accent" />
            <span>
              Jag godkänner <Link href="/villkor" className="underline">köpvillkoren</Link> och att mina uppgifter behandlas enligt{' '}
              <Link href="/integritet" className="underline">integritetspolicyn</Link>.
            </span>
          </label>
          {state.error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
          <Submit />
        </aside>
      </form>
    </div>
  );
}

function Field({ id, label, type = 'text', required, autoComplete }: { id: string; label: string; type?: string; required?: boolean; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} name={id} type={type} required={required} autoComplete={autoComplete} className="input" />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-mute">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
