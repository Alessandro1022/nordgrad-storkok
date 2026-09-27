'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import type { Product } from '@/lib/types';

export default function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const out = product.stock <= 0;
  const item = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image_url: product.image_url,
    art: product.art,
  };

  const flash = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  if (compact) {
    return (
      <button
        className="flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-[14px] font-semibold text-white transition-colors hover:bg-accent-dark disabled:bg-steel-300"
        disabled={out}
        onClick={() => {
          add(item, 1);
          flash();
        }}
        aria-label={`Köp ${product.name}`}
      >
        {added ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 8.5l3 3 7-7" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v10M3 8h10" /></svg>
        )}
        Köp
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-14 items-center rounded-md border border-steel-300">
        <button className="h-full px-4 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Minska antal">−</button>
        <input
          id="qty"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="tabular w-10 border-0 bg-transparent text-center font-semibold focus:outline-none"
          aria-label="Antal"
        />
        <button className="h-full px-4 text-lg" onClick={() => setQty((q) => q + 1)} aria-label="Öka antal">+</button>
      </div>
      <button
        className="btn-primary h-14 flex-1 text-base"
        disabled={out}
        onClick={() => {
          add(item, qty);
          flash();
        }}
      >
        {out ? 'Slut i lager' : added ? 'Tillagd i varukorgen' : 'Lägg i varukorgen'}
      </button>
    </div>
  );
}
