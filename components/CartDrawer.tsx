'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from './CartProvider';
import ProductImage from './ProductImage';
import { inclVat, kr } from '@/lib/format';
import { site } from '@/lib/site';

export default function CartDrawer() {
  const { items, open, setOpen, subtotal, setQty, remove } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  const left = site.freeShippingFrom - subtotal;

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Varukorg"
      >
        <div className="flex items-center justify-between border-b border-steel-200 px-5 py-4">
          <h2 className="font-display text-lg font-bold">Varukorg</h2>
          <button onClick={() => setOpen(false)} className="rounded p-2 text-ink-mute hover:text-ink" aria-label="Stäng">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-ink-mute">Varukorgen är tom.</p>
            <Link href="/produkter" className="btn-dark" onClick={() => setOpen(false)}>
              Se sortimentet
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-steel-200 bg-steel-50 px-5 py-3 text-xs text-ink-soft">
              {left > 0 ? (
                <>Handla för <strong className="tabular">{kr(left)}</strong> till för fri frakt.</>
              ) : (
                <>Du har fri frakt.</>
              )}
            </div>
            <ul className="flex-1 divide-y divide-steel-200 overflow-y-auto px-5">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 py-4">
                  <div className="h-20 w-20 shrink-0 rounded-md bg-steel-50 p-1">
                    <ProductImage product={i} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Link
                      href={`/produkt/${i.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-semibold leading-snug hover:text-accent"
                    >
                      {i.name}
                    </Link>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-md border border-steel-300">
                        <button className="px-2.5 py-1" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Minska antal">
                          −
                        </button>
                        <span className="tabular w-8 text-center text-sm">{i.qty}</span>
                        <button className="px-2.5 py-1" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Öka antal">
                          +
                        </button>
                      </div>
                      <span className="tabular text-sm font-semibold">{kr(i.price * i.qty)}</span>
                    </div>
                    <button onClick={() => remove(i.id)} className="self-start text-xs text-ink-mute underline hover:text-ink">
                      Ta bort
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-steel-200 px-5 py-5">
              <div className="flex justify-between text-sm">
                <span className="text-ink-mute">Delsumma exkl. moms</span>
                <span className="tabular font-semibold">{kr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-mute">Inkl. moms</span>
                <span className="tabular">{kr(inclVat(subtotal))}</span>
              </div>
              <Link href="/kassa" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Till kassan
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
