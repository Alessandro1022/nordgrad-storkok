'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import type { Product } from '@/lib/types';

export default function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const out = product.stock <= 0;
  const item = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image_url: product.image_url,
    art: product.art,
  };

  if (compact) {
    return (
      <button className="btn-dark w-full py-2.5" disabled={out} onClick={() => add(item, 1)}>
        {out ? 'Slut i lager' : 'Lägg i varukorg'}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center rounded-md border border-steel-300">
        <button className="px-4 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Minska antal">
          −
        </button>
        <input
          id="qty"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="tabular w-12 border-0 bg-transparent text-center text-sm focus:outline-none"
          aria-label="Antal"
        />
        <button className="px-4 py-3" onClick={() => setQty((q) => q + 1)} aria-label="Öka antal">
          +
        </button>
      </div>
      <button className="btn-primary flex-1" disabled={out} onClick={() => add(item, qty)}>
        {out ? 'Slut i lager' : 'Lägg i varukorg'}
      </button>
    </div>
  );
}
