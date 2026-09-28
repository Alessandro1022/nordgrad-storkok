import Link from 'next/link';
import ClearCart from '@/components/ClearCart';
import { site } from '@/lib/site';

export const metadata = { title: 'Tack för din beställning' };

const COPY: Record<string, { title: string; text: string; ok: boolean }> = {
  betald: {
    title: 'Tack, betalningen är klar!',
    text: 'Du får en orderbekräftelse på e-post. Vi hör av oss med leveransdatum inom en arbetsdag.',
    ok: true,
  },
  faktura: {
    title: 'Tack för din beställning!',
    text: 'Vi går igenom ordern och skickar orderbekräftelse, leveransdatum och faktura inom en arbetsdag.',
    ok: true,
  },
  behandlas: {
    title: 'Tack, betalningen behandlas',
    text: 'Betalningen är på väg men inte bekräftad än. Du får ett mejl så fort den är klar.',
    ok: true,
  },
  misslyckad: {
    title: 'Betalningen gick inte igenom',
    text: 'Inga pengar har dragits. Din varukorg finns kvar, så du kan försöka igen eller välja ett annat betalsätt.',
    ok: false,
  },
};

export default function ThanksPage({ searchParams }: { searchParams: { order?: string; status?: string } }) {
  const c = COPY[searchParams.status ?? 'faktura'] ?? COPY.faktura;
  return (
    <div className="wrap max-w-2xl py-20 text-center">
      {c.ok && <ClearCart />}
      <div className={`fade-up mx-auto flex h-16 w-16 items-center justify-center rounded-full ${c.ok ? 'bg-accent-tint' : 'bg-amber-50'}`}>
        {c.ok ? (
          <svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="#0e5a44" strokeWidth="2">
            <path d="M3 8.5l3 3 7-7" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none" stroke="#b4580c" strokeWidth="2">
            <path d="M8 4v5M8 11.5v.5" />
          </svg>
        )}
      </div>
      <h1 className="fade-up mt-6 text-[36px] font-bold tracking-tightest sm:text-[44px]" style={{ animationDelay: '80ms' }}>
        {c.title}
      </h1>
      {searchParams.order && c.ok && (
        <p className="tabular mt-3 font-mono text-sm text-ink-mute">Ordernummer {searchParams.order}</p>
      )}
      <p className="fade-up mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-ink-soft" style={{ animationDelay: '160ms' }}>
        {c.text} Frågor? Ring {site.phone}.
      </p>
      <Link href={c.ok ? '/produkter' : '/kassa'} className="btn-dark mt-8">
        {c.ok ? 'Fortsätt handla' : 'Tillbaka till kassan'}
      </Link>
    </div>
  );
}
