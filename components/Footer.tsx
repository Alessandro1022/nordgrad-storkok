import Link from 'next/link';
import Logo from './Logo';
import CookieSettingsLink from './CookieSettingsLink';
import { site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-steel-300">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed">
            Köksmaskiner och storköksutrustning för restauranger, caféer, skolkök och hotell. Vi levererar och installerar i hela Sverige.
          </p>
        </div>
        <div>
          <h3 className="eyebrow mb-4 text-steel-300">Sortiment</h3>
          <ul className="space-y-2 text-sm">
            {site.categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produkter?kategori=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-4 text-steel-300">Kundtjänst</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/om-oss" className="hover:text-white">Om oss</Link></li>
            <li><Link href="/kontakt" className="hover:text-white">Kontakt & offert</Link></li>
            <li><Link href="/villkor" className="hover:text-white">Köpvillkor</Link></li>
            <li><Link href="/integritet" className="hover:text-white">Integritet & cookies</Link></li>
            <li><CookieSettingsLink /></li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow mb-4 text-steel-300">Kontakt</h3>
          <ul className="space-y-2 text-sm">
            {site.address.map((a) => (
              <li key={a}>{a}</li>
            ))}
            <li className="pt-2">Tel: <span className="text-white">{site.phone}</span></li>
            <li><span className="text-white">{site.email}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name} · Org.nr {site.orgnr}</p>
          <p>Alla priser visas exkl. moms om inget annat anges.</p>
        </div>
      </div>
    </footer>
  );
}
