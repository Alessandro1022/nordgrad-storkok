import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-sm text-ink-mute">404</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold">Sidan hittades inte</h1>
      <p className="mt-3 text-ink-soft">Produkten kan ha tagits bort eller bytt namn.</p>
      <Link href="/produkter" className="btn-dark mt-6">Till sortimentet</Link>
    </div>
  );
}
