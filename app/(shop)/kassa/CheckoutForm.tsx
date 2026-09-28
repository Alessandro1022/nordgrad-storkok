'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useCart } from '@/components/CartProvider';
import ProductImage from '@/components/ProductImage';
import { inclVat, kr } from '@/lib/format';
import { shippingFor } from '@/lib/pricing';
import { site } from '@/lib/site';
import { placeOrder, type CheckoutState } from './actions';

export type PublicOption = { id: string; label: string; description: string };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary w-full py-3.5 text-base" disabled={pending}>
      {pending ? 'Skickar dig vidare…' : 'Till betalning'}
    </button>
  );
}

export default function CheckoutForm({ options, cancelled }: { options: PublicOption[]; cancelled: boolean }) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [state, action] = useFormState<CheckoutState, FormData>(placeOrder, { ok: false });

  useEffect(() => {
    if (!state.ok || !state.redirect) return;
    if (state.external) {
      // Till Stripe, Klarna eller PayPal. Varukorgen töms när betalningen är klar.
      window.location.href = state.redirect;
    } else {
      clear();
      router.push(state.redirect);
    }
  }, [state, clear, router]);

  const shipping = shippingFor(subtotal);
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
            {cancelled && (
              <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="status">
                Betalningen avbröts. Varukorgen är kvar, välj betalsätt och försök igen.
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((o, i) => (
                <label
                  key={o.id}
                  className="flex cursor-pointer gap-3 rounded-xl border border-steel-300 p-4 transition-colors has-[:checked]:border-ink has-[:checked]:bg-steel-50"
                >
                  <input type="radio" name="payment" value={o.id} defaultChecked={i === 0} className="mt-1 accent-ink" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[15px] font-semibold">{o.label}</span>
                      <MethodMark id={o.id} />
                    </span>
                    <span className="mt-0.5 block text-[13px] text-ink-mute">{o.description}</span>
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

function MethodMark({ id }: { id: string }) {
  const style: Record<string, string> = {
    card: 'bg-ink text-white',
    klarna: 'bg-[#ffb3c7] text-[#0b051d]',
    paypal: 'bg-[#003087] text-white',
    invoice: 'bg-steel-200 text-ink',
  };
  const text: Record<string, string> = { card: 'Kort', klarna: 'Klarna', paypal: 'PayPal', invoice: 'Faktura' };
  return <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${style[id] ?? style.invoice}`}>{text[id] ?? id}</span>;
}
