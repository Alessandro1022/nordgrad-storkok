import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata = { title: 'Tack för din beställning' };

export default function ThanksPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <div className="wrap max-w-2xl py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-tint">
        <svg width="26" height="26" viewBox="0 0 16 16" fill="none" stroke="#0a5bd8" strokeWidth="2">
          <path d="M3 8.5l3 3 7-7" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">Tack för din beställning!</h1>
      {searchParams.order && (
        <p className="tabular mt-3 font-mono text-sm text-ink-mute">Ordernummer: {searchParams.order}</p>
      )}
      <p className="mt-4 text-ink-soft">
        Vi går igenom ordern och återkommer inom en arbetsdag med orderbekräftelse, leveransdatum och betalning. Frågor? Ring{' '}
        {site.phone} eller mejla {site.email}.
      </p>
      <Link href="/produkter" className="btn-dark mt-8">Fortsätt handla</Link>
    </div>
  );
}
