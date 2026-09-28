import type { Product } from './types';

// De siffror en köksägare jämför först, i prioritetsordning.
const PRIORITY: RegExp[] = [/^kapacitet/i, /^volym/i, /^korgstorlek/i, /^effekt/i, /temperatur/i];

export function keyFacts(p: Pick<Product, 'specs'>, n = 3) {
  const out: { label: string; value: string }[] = [];
  for (const re of PRIORITY) {
    const s = p.specs.find((x) => re.test(x.label));
    if (s && !out.includes(s)) out.push(s);
    if (out.length >= n) break;
  }
  return out.length ? out : p.specs.slice(0, n);
}

export function keySpecs(p: Pick<Product, 'specs'>, n = 3) {
  return keyFacts(p, n).map((f) => f.value.replace(/^ca /, ''));
}

export function discountPct(p: Pick<Product, 'price' | 'compare_price'>) {
  if (!p.compare_price || p.compare_price <= p.price) return 0;
  return Math.round((1 - p.price / p.compare_price) * 100);
}
