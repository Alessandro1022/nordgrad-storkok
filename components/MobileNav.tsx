'use client';

import Link from 'next/link';
import { useState } from 'react';
import { site } from '@/lib/site';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        className="rounded-md p-2 hover:bg-steel-100"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Meny"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full z-40 border-b border-steel-200 bg-white shadow-lg">
          <ul className="wrap divide-y divide-steel-100 py-2">
            <li>
              <Link href="/produkter" onClick={() => setOpen(false)} className="block py-3 font-semibold">
                Alla produkter
              </Link>
            </li>
            {site.categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produkter?kategori=${c.slug}`} onClick={() => setOpen(false)} className="block py-3">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/om-oss" onClick={() => setOpen(false)} className="block py-3">
                Om oss
              </Link>
            </li>
            <li>
              <Link href="/kontakt" onClick={() => setOpen(false)} className="block py-3">
                Kontakt & offert
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
