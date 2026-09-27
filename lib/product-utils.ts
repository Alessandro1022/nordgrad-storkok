import type { Product } from './types';

// Plockar fram de 2–3 siffror en storkökskund jämför först.
const PRIORITY = [/kapacitet/i, /korgstorlek/i, /anslutning/i, /volym/i, /effekt/i];

export function keySpecs(p: Pick<Product, 'specs'>, n = 3) {
  const out: string[] = [];
  for (const re of PRIORITY) {
    const s = p.specs.find((x) => re.test(x.label));
    if (s) out.push(re.source.includes('anslutning') ? s.value.split('/')[0].trim() : s.value);
    if (out.length >= n) break;
  }
  if (!out.length) return p.specs.slice(0, n).map((s) => s.value);
  return out;
}

export function discountPct(p: Pick<Product, 'price' | 'compare_price'>) {
  if (!p.compare_price || p.compare_price <= p.price) return 0;
  return Math.round((1 - p.price / p.compare_price) * 100);
}
