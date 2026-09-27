import Link from 'next/link';
import Logo from './Logo';
import CartButton from './CartButton';
import MobileNav from './MobileNav';
import { site } from '@/lib/site';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="bg-ink text-steel-200">
        <ul className="wrap flex items-center justify-center gap-x-8 overflow-x-auto whitespace-nowrap py-2 text-[12px] sm:justify-between">
          {site.usps.map((u, i) => (
            <li key={u} className={`flex items-center gap-2 ${i > 0 ? 'hidden sm:flex' : ''}`}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#6ea2ff" strokeWidth="2">
                <path d="M3 8.5l3 3 7-7" />
              </svg>
              {u}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative border-b border-steel-200">
        <div className="wrap flex items-center gap-4 py-3">
          <MobileNav />
          <Logo />
          <form action="/produkter" className="ml-auto hidden max-w-md flex-1 md:block" role="search">
            <label htmlFor="header-search" className="sr-only">
              Sök produkter
            </label>
            <div className="relative">
              <input
                id="header-search"
                name="q"
                placeholder="Sök diskmaskin, kylbänk, pizzaugn…"
                className="input rounded-full bg-steel-50 py-2.5 pl-10"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </div>
          </form>
          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Link href="/kontakt" className="hidden rounded-md px-3 py-2 text-sm font-semibold hover:bg-steel-100 lg:block">
              Begär offert
            </Link>
            <CartButton />
          </div>
        </div>

        <nav className="hidden border-t border-steel-100 lg:block" aria-label="Kategorier">
          <ul className="wrap flex items-center gap-1 text-sm">
            <li>
              <Link href="/produkter" className="block px-3 py-3 font-semibold hover:text-accent">
                Alla produkter
              </Link>
            </li>
            {site.categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produkter?kategori=${c.slug}`} className="block px-3 py-3 text-ink-soft hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link href="/om-oss" className="block px-3 py-3 text-ink-soft hover:text-accent">
                Om oss
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="block px-3 py-3 text-ink-soft hover:text-accent">
                Kontakt
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
