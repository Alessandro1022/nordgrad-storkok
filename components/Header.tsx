import Link from 'next/link';
import Logo from './Logo';
import CartButton from './CartButton';
import MobileNav from './MobileNav';
import { navCategories, site } from '@/lib/site';

export default function Header() {
  return (
    <header className="sticky z-40 border-b border-steel-200/70 bg-white/80 backdrop-blur-lg" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="wrap flex h-[68px] items-center gap-4">
        <MobileNav />
        <Logo />
        <nav className="ml-8 hidden items-center gap-1 lg:flex" aria-label="Kategorier">
          {navCategories.map((c) => (
            <Link key={c.slug} href={`/produkter?kategori=${c.slug}`} className="rounded-full px-4 py-2 text-[15px] font-medium text-ink-soft transition-colors hover:bg-steel-100 hover:text-ink">
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right leading-tight md:block">
            <p className="text-[12px] text-ink-mute">Frågor? Ring oss</p>
            <p className="text-[15px] font-semibold">{site.phone}</p>
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
