import Link from 'next/link';
import { site } from '@/lib/site';

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name}, startsida`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="6" fill={light ? '#ffffff' : '#101c26'} />
        <path d="M8 22V10l8 12V10" stroke={light ? '#101c26' : '#ffffff'} strokeWidth="2.6" fill="none" strokeLinejoin="round" />
        <circle cx="23" cy="11" r="2.4" fill="#0a5bd8" />
      </svg>
      <span className="leading-none">
        <span className={`block font-display text-[19px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink'}`} style={{ fontStretch: '115%' }}>
          {site.short.toUpperCase()}
        </span>
        <span className={`block font-mono text-[9.5px] font-medium tracking-[0.3em] ${light ? 'text-steel-300' : 'text-ink-mute'}`}>
          STORKÖK
        </span>
      </span>
    </Link>
  );
}
