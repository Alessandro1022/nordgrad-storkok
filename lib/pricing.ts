import { site } from './site';

export const SHIPPING_FEE = 895; // exkl. moms

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= site.freeShippingFrom ? 0 : SHIPPING_FEE;
}

/** Pris exkl. moms i kronor → pris inkl. moms i öre (det betalleverantörerna vill ha). */
export function toOre(exkl: number) {
  return Math.round(exkl * (1 + site.vatRate) * 100);
}

export type OrderLine = { id: string; name: string; price: number; qty: number };

/** Rader inkl. moms i öre, med frakt som egen rad. */
export function paymentLines(items: OrderLine[], shipping: number) {
  const lines = items.map((i) => ({ reference: i.id, name: i.name, quantity: i.qty, unit: toOre(i.price) }));
  if (shipping > 0) lines.push({ reference: 'frakt', name: 'Frakt', quantity: 1, unit: toOre(shipping) });
  const total = lines.reduce((s, l) => s + l.unit * l.quantity, 0);
  return { lines, total };
}

export function shortId(uuid: string) {
  return uuid.slice(0, 8).toUpperCase();
}
