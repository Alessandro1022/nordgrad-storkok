import { site } from './site';

const fmt = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 });

export function kr(n: number) {
  return `${fmt.format(Math.round(n))} kr`;
}

export function inclVat(n: number) {
  return n * (1 + site.vatRate);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/å|ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function dateTime(iso: string) {
  return new Date(iso).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
}
