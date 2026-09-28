'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navCategories, site } from '@/lib/site';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="lg:hidden">
      <button
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-steel-100"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Meny"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h10" />}
        </svg>
      </button>
      {open && (
        <nav className="fade-up absolute inset-x-0 top-full z-40 border-b border-steel-200 bg-white shadow-xl">
          <ul className="wrap py-3">
            <li>
              <Link href="/produkter" onClick={close} className="block py-3.5 text-[20px] font-semibold tracking-tight">Alla maskiner</Link>
            </li>
            {navCategories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produkter?kategori=${c.slug}`} onClick={close} className="block py-3.5 text-[20px] font-semibold tracking-tight">
                  {c.name}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-steel-200 pt-2">
              <Link href="/kontakt" onClick={close} className="block py-3 text-ink-soft">Kontakt & offert</Link>
            </li>
            <li>
              <Link href="/om-oss" onClick={close} className="block py-3 text-ink-soft">Om oss</Link>
            </li>
            <li className="py-3 text-ink-soft">Ring <span className="font-semibold text-ink">{site.phone}</span></li>
          </ul>
        </nav>
      )}
    </div>
  );
}
