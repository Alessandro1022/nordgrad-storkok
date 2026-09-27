/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import Logo from './Logo';
import CartButton from './CartButton';
import MobileNav from './MobileNav';
import { site } from '@/lib/site';

export default function Header() {
  return (
    <header className="relative z-40 bg-white">
      {/* Kundtjänstrad */}
      <div className="bg-ink text-[13px] text-white/75">
        <div className="wrap flex h-9 items-center justify-between gap-6">
          <p className="truncate">
            Kundtjänst <span className="font-semibold text-white">{site.phone}</span>
            <span className="hidden sm:inline"> · {site.hours}</span>
          </p>
          <ul className="hidden items-center gap-5 md:flex">
            {site.usps.map((u) => (
              <li key={u} className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#f2c230" strokeWidth="2.4">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                {u}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Logo, sök, varukorg */}
      <div className="border-b border-steel-200">
        <div className="wrap flex h-[76px] items-center gap-4 lg:gap-10">
          <MobileNav />
          <Logo />
          <form action="/produkter" className="hidden flex-1 md:flex" role="search">
            <label htmlFor="header-search" className="sr-only">Sök bland produkter</label>
            <input
              id="header-search"
              name="q"
              placeholder="Sök produkt, märke eller art.nr"
              className="h-11 w-full rounded-l-md border border-r-0 border-steel-300 bg-steel-50 px-4 text-[15px] placeholder:text-ink-mute focus:border-ink focus:bg-white focus:outline-none"
            />
            <button className="h-11 rounded-r-md bg-ink px-5 text-[15px] font-semibold text-white hover:bg-ink-soft">Sök</button>
          </form>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link href="/kontakt" className="hidden whitespace-nowrap px-3 py-2 text-[15px] font-semibold underline decoration-steel-300 underline-offset-4 hover:decoration-ink xl:block">
              Begär offert
            </Link>
            <CartButton />
          </div>
        </div>
      </div>

      {/* Kategorier med megameny */}
      <nav className="hidden border-b border-steel-200 lg:block" aria-label="Kategorier">
        <ul className="wrap flex items-stretch text-[15px] [&>li:first-child>a]:pl-0">
          {site.categories.map((c) => (
            <li key={c.slug} className="group">
              <Link
                href={`/produkter?kategori=${c.slug}`}
                className="flex h-12 items-center gap-1 border-b-2 border-transparent px-4 font-medium group-hover:border-accent group-focus-within:border-accent"
              >
                {c.name}
                <svg width="10" height="10" viewBox="0 0 10 10" className="text-ink-mute" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 3.5l3 3 3-3" />
                </svg>
              </Link>
              <div className="invisible absolute inset-x-0 top-full border-y border-steel-200 bg-white opacity-0 shadow-[0_24px_40px_-24px_rgba(21,24,22,0.25)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="wrap grid grid-cols-[1fr_1fr_360px] gap-10 py-8">
                  <div>
                    <p className="text-[13px] font-semibold text-ink-mute">{c.name}</p>
                    <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1">
                      {c.subs.map((s) => (
                        <li key={s}>
                          <Link href={`/produkter?kategori=${c.slug}&q=${encodeURIComponent(s.split(' ')[0])}`} className="block py-1.5 hover:text-accent">
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/produkter?kategori=${c.slug}`} className="mt-4 inline-block font-semibold text-accent hover:underline">
                      Allt inom {c.name.toLowerCase()} →
                    </Link>
                  </div>
                  <div className="border-l border-steel-200 pl-10">
                    <p className="text-[13px] font-semibold text-ink-mute">Osäker på storlek?</p>
                    <p className="mt-3 max-w-xs leading-relaxed text-ink-soft">
                      Berätta hur många kuvert ni gör per pass så föreslår vi rätt kapacitet och anslutning.
                    </p>
                    <p className="mt-3 font-semibold">{site.phone}</p>
                  </div>
                  <Link href={`/produkter?kategori=${c.slug}`} className="relative block h-44 overflow-hidden rounded-md">
                    <img src={c.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    <span className="absolute bottom-3 left-3 rounded-sm bg-white px-2.5 py-1 text-[13px] font-semibold">{c.blurb}</span>
                  </Link>
                </div>
              </div>
            </li>
          ))}
          <li className="ml-auto flex items-center gap-6 text-ink-soft">
            <Link href="/om-oss" className="hover:text-ink">Om oss</Link>
            <Link href="/kontakt" className="hover:text-ink">Kontakt</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
