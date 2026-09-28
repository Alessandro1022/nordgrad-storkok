'use server';

import { headers } from 'next/headers';
import { getProductsByIds } from '@/lib/products';
import { getSupabase, hasDatabase } from '@/lib/supabase';
import { paymentLines, shippingFor, shortId, type OrderLine } from '@/lib/pricing';
import { checkoutOptions, getPaymentSettings } from '@/lib/payments/settings';
import { createStripeCheckout, stripeErrorMessage } from '@/lib/payments/stripe';
import { createPayPalOrder } from '@/lib/payments/paypal';
import { createKlarnaSession } from '@/lib/payments/klarna';

export type CheckoutState = { ok: boolean; error?: string; redirect?: string; external?: boolean };

function origin() {
  const h = headers();
  const o = h.get('origin');
  if (o) return o;
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

export async function placeOrder(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const get = (k: string) => String(form.get(k) ?? '').trim();
  const customer = {
    company: get('company'),
    orgnr: get('orgnr'),
    name: get('name'),
    email: get('email'),
    phone: get('phone'),
    address: get('address'),
    zip: get('zip'),
    city: get('city'),
    note: get('note'),
  };

  if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.zip || !customer.city) {
    return { ok: false, error: 'Fyll i namn, e-post, telefon och leveransadress.' };
  }
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) return { ok: false, error: 'E-postadressen ser inte rätt ut.' };
  if (form.get('terms') !== 'on') return { ok: false, error: 'Du behöver godkänna köpvillkoren.' };

  // Betalsätt: bara de som är påslagna i admin godtas.
  const settings = await getPaymentSettings();
  const options = checkoutOptions(settings, hasDatabase());
  const option = options.find((o) => o.id === get('payment'));
  if (!option) return { ok: false, error: 'Välj ett betalsätt.' };

  let cart: { id: string; qty: number }[] = [];
  try {
    cart = JSON.parse(get('cart'));
  } catch {
    return { ok: false, error: 'Varukorgen kunde inte läsas. Ladda om sidan och försök igen.' };
  }
  cart = cart.filter((c) => c && c.id && Number(c.qty) > 0);
  if (!cart.length) return { ok: false, error: 'Varukorgen är tom.' };

  // Priser hämtas alltid från databasen, aldrig från webbläsaren.
  const products = await getProductsByIds(cart.map((c) => c.id));
  const items = cart
    .map((c) => {
      const p = products.find((x) => x.id === c.id);
      return p ? { id: p.id, name: p.name, price: p.price, qty: Math.min(99, Math.floor(Number(c.qty))) } : null;
    })
    .filter(Boolean) as OrderLine[];
  if (!items.length) return { ok: false, error: 'Produkterna i varukorgen finns inte längre.' };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = shippingFor(subtotal);
  const { total } = paymentLines(items, shipping);

  const sb = getSupabase();
  if (!sb) {
    return { ok: true, redirect: `/tack?order=DEMO-${Date.now().toString().slice(-6)}&status=faktura` };
  }

  const isInvoice = option.id === 'invoice';
  const { data, error } = await sb
    .from('orders')
    .insert({
      customer,
      items,
      shipping,
      total: total / 100,
      status: isInvoice ? 'ny' : 'vantar',
      payment_method: option.id,
      payment_provider: option.provider,
    })
    .select('id')
    .single();
  if (error || !data) {
    console.error('placeOrder', error?.message);
    return { ok: false, error: 'Beställningen kunde inte sparas. Försök igen eller ring oss.' };
  }
  const orderId = String(data.id);

  if (isInvoice) return { ok: true, redirect: `/tack?order=${shortId(orderId)}&status=faktura` };

  try {
    const o = origin();
    let session: { url: string; ref: string };
    if (option.provider === 'stripe') {
      session = await createStripeCheckout({
        settings,
        method: option.id as 'card' | 'klarna' | 'paypal',
        orderId,
        email: customer.email,
        items,
        shipping,
        origin: o,
      });
    } else if (option.provider === 'paypal') {
      session = await createPayPalOrder({ settings, orderId, items, shipping, origin: o });
    } else {
      session = await createKlarnaSession({ settings, orderId, items, shipping, origin: o });
    }
    await sb.from('orders').update({ payment_ref: session.ref }).eq('id', orderId);
    return { ok: true, redirect: session.url, external: true };
  } catch (e) {
    console.error('payment start', e);
    await sb.from('orders').update({ status: 'misslyckad' }).eq('id', orderId);
    const msg = option.provider === 'stripe' ? stripeErrorMessage(e) : e instanceof Error ? e.message : 'Betalningen kunde inte startas.';
    return { ok: false, error: `${msg} Välj ett annat betalsätt eller ring oss.` };
  }
}
