'use client';

import { useCart } from './CartProvider';
import { kr } from '@/lib/format';

export default function CartButton() {
  const { count, subtotal, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="group flex items-center gap-3 rounded-full py-1 pl-3 pr-1 transition-colors hover:bg-steel-100"
      aria-label={`Varukorg, ${count} varor`}
    >
      <span className="hidden text-right leading-tight sm:block">
        <span className="block text-[12px] text-ink-mute">Varukorg</span>
        <span className="tabular block text-[15px] font-semibold">{kr(subtotal)}</span>
      </span>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16l-1.4 11.2a2 2 0 01-2 1.8H7.4a2 2 0 01-2-1.8L4 7z" />
          <path d="M9 7V5.5a3 3 0 016 0V7" />
        </svg>
        {count > 0 && (
          <span className="tabular absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-signal px-1 text-[11px] font-bold text-ink">
            {count}
          </span>
        )}
      </span>
    </button>
  );
}
