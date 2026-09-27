import Link from 'next/link';
import Logo from '@/components/Logo';
import { hasDatabase } from '@/lib/supabase';
import { logout } from '../actions';

export const dynamic = 'force-dynamic';

const nav = [
  { href: '/admin', label: 'Produkter' },
  { href: '/admin/produkter/ny', label: 'Ny produkt' },
  { href: '/admin/ordrar', label: 'Ordrar' },
  { href: '/admin/meddelanden', label: 'Meddelanden' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const db = hasDatabase();
  return (
    <div className="min-h-screen bg-steel-50">
      <header className="border-b border-steel-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Logo />
          <span className="rounded bg-ink px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">Admin</span>
          <nav className="order-last flex w-full gap-1 overflow-x-auto text-sm sm:order-none sm:w-auto">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-md px-3 py-2 font-medium text-ink-soft hover:bg-steel-100 hover:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" target="_blank" className="rounded-md px-3 py-2 text-sm text-ink-soft hover:bg-steel-100">
              Visa butiken ↗
            </Link>
            <form action={logout}>
              <button className="btn-ghost py-2 text-xs">Logga ut</button>
            </form>
          </div>
        </div>
      </header>
      {!db && (
        <div className="border-b border-amber-200 bg-amber-50">
          <p className="mx-auto max-w-6xl px-4 py-3 text-sm text-amber-900 sm:px-6">
            <strong>Demoläge:</strong> Supabase är inte kopplat. Butiken visar startprodukterna men ändringar, ordrar och meddelanden sparas
            inte. Lägg in miljövariablerna i Vercel enligt README.
          </p>
        </div>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
