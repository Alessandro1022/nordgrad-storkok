'use server';

import { getProductsByIds } from '@/lib/products';
import { getSupabase } from '@/lib/supabase';
import { site } from '@/lib/site';

export type CheckoutState = { ok: boolean; error?: string; orderId?: string };

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
    payment: get('payment'),
    note: get('note'),
  };

  if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.zip || !customer.city) {
    return { ok: false, error: 'Fyll i namn, e-post, telefon och leveransadress.' };
  }
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) return { ok: false, error: 'E-postadressen ser inte rätt ut.' };
  if (form.get('terms') !== 'on') return { ok: false, error: 'Du behöver godkänna köpvillkoren.' };

  let cart: { id: string; qty: number }[] = [];
  try {
    cart = JSON.parse(get('cart'));
  } catch {
    return { ok: false, error: 'Varukorgen kunde inte läsas. Ladda om sidan och försök igen.' };
  }
  cart = cart.filter((c) => c && c.id && Number(c.qty) > 0);
  if (!cart.length) return { ok: false, error: 'Varukorgen är tom.' };

  // Priser hämtas från databasen, aldrig från webbläsaren.
  const products = await getProductsByIds(cart.map((c) => c.id));
  const items = cart
    .map((c) => {
      const p = products.find((x) => x.id === c.id);
      return p ? { id: p.id, name: p.name, price: p.price, qty: Math.min(99, Math.floor(Number(c.qty))) } : null;
    })
    .filter(Boolean) as { id: string; name: string; price: number; qty: number }[];
  if (!items.length) return { ok: false, error: 'Produkterna i varukorgen finns inte längre.' };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.round(subtotal * (1 + site.vatRate));

  const sb = getSupabase();
  if (!sb) {
    // Demo-läge utan databas: ordern sparas inte.
    return { ok: true, orderId: 'DEMO-' + Date.now().toString().slice(-6) };
  }
  const { data, error } = await sb.from('orders').insert({ customer, items, total, status: 'ny' }).select('id').single();
  if (error) {
    console.error('placeOrder', error.message);
    return { ok: false, error: 'Beställningen kunde inte sparas. Försök igen eller ring oss.' };
  }
  return { ok: true, orderId: String(data.id).slice(0, 8).toUpperCase() };
}
