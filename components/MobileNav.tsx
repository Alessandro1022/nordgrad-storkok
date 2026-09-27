'use client';

import Link from 'next/link';
import { useState } from 'react';
import { site } from '@/lib/site';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-md hover:bg-steel-100"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Meny"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
        </svg>
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full z-40 max-h-[80vh] overflow-y-auto border-b border-steel-200 bg-white shadow-lg">
          <form action="/produkter" className="wrap flex pt-4" role="search">
            <label htmlFor="m-search" className="sr-only">Sök</label>
            <input id="m-search" name="q" placeholder="Sök produkt eller art.nr" className="input rounded-r-none" />
            <button className="rounded-r-md bg-ink px-4 font-semibold text-white">Sök</button>
          </form>
          <ul className="wrap py-2">
            {site.categories.map((c) => (
              <li key={c.slug} className="border-b border-steel-100">
                <details>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-semibold">
                    {c.name}
                    <span className="text-ink-mute">+</span>
                  </summary>
                  <ul className="pb-3 pl-3">
                    <li>
                      <Link href={`/produkter?kategori=${c.slug}`} onClick={() => setOpen(false)} className="block py-2 font-medium text-accent">
                        Allt inom {c.name.toLowerCase()}
                      </Link>
                    </li>
                    {c.subs.map((s) => (
                      <li key={s}>
                        <Link
                          href={`/produkter?kategori=${c.slug}&q=${encodeURIComponent(s.split(' ')[0])}`}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-ink-soft"
                        >
                          {s}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
            <li><Link href="/om-oss" onClick={() => setOpen(false)} className="block py-3.5">Om oss</Link></li>
            <li><Link href="/kontakt" onClick={() => setOpen(false)} className="block py-3.5">Kontakt & offert</Link></li>
          </ul>
        </nav>
      )}
    </div>
  );
}
