import Link from 'next/link';
import Logo from './Logo';
import CookieSettingsLink from './CookieSettingsLink';
import { site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-28 bg-ink text-[15px] text-white/65">
      <div className="wrap border-b border-white/10 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-[28px] font-bold leading-tight tracking-tightest text-white sm:text-[34px]">
            Ska köket bytas ut eller byggas nytt? Vi räknar på det åt dig.
          </p>
          <Link href="/kontakt" className="btn shrink-0 bg-white text-ink hover:bg-steel-100">Be om offert</Link>
        </div>
      </div>

      <div className="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-xs leading-relaxed">Köksmaskiner och storköksutrustning till restauranger, caféer, skolkök och hotell i hela Sverige.</p>
        </div>
        <div>
          <h3 className="mb-4 text-[13px] font-semibold text-white">Sortiment</h3>
          <ul className="space-y-2">
            {site.categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produkter?kategori=${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-[13px] font-semibold text-white">Kundtjänst</h3>
          <ul className="space-y-2">
            <li><Link href="/om-oss" className="hover:text-white">Om oss</Link></li>
            <li><Link href="/kontakt" className="hover:text-white">Kontakt & offert</Link></li>
            <li><Link href="/villkor" className="hover:text-white">Köpvillkor</Link></li>
            <li><Link href="/integritet" className="hover:text-white">Integritet & cookies</Link></li>
            <li><CookieSettingsLink /></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-[13px] font-semibold text-white">Kontakt</h3>
          <ul className="space-y-2">
            <li className="text-[20px] font-bold tracking-tight text-white">{site.phone}</li>
            <li>{site.hours}</li>
            <li className="select-all">{site.email}</li>
            <li className="pt-2">{site.address.join(', ')}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-4 py-6 text-[13px] md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-2">
            {site.payments.map((p) => (
              <li key={p} className="rounded-sm border border-white/15 px-2.5 py-1 text-white/80">{p}</li>
            ))}
          </ul>
          <p>© {new Date().getFullYear()} {site.name} · Org.nr {site.orgnr} · Priser exkl. moms</p>
        </div>
      </div>
    </footer>
  );
}
