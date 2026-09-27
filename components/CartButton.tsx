'use client';

import { useCart } from './CartProvider';

export default function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-steel-100"
      aria-label={`Varukorg, ${count} varor`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.7a2 2 0 002-1.5L21 8H6.2" />
        <circle cx="10" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
      </svg>
      <span className="hidden sm:inline">Varukorg</span>
      {count > 0 && (
        <span className="tabular absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] text-white sm:static">
          {count}
        </span>
      )}
    </button>
  );
}
