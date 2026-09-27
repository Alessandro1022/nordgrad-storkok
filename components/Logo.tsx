import Link from 'next/link';
import { site } from '@/lib/site';

export default function Logo({ light = false }: { light?: boolean }) {
  const fg = light ? '#ffffff' : '#151816';
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${site.name}, startsida`}>
      {/* Märket: en GN 1/1-kantin sedd uppifrån, 530 × 325 */}
      <svg width="34" height="22" viewBox="0 0 53 32.5" aria-hidden="true">
        <rect x="1" y="1" width="51" height="30.5" rx="3" fill="none" stroke={fg} strokeWidth="2" />
        <rect x="6" y="6" width="41" height="20.5" rx="1.5" fill={fg} />
        <rect x="6" y="6" width="13" height="20.5" rx="1.5" fill="#0e5a44" />
      </svg>
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="text-[22px] font-bold tracking-tightest" style={{ color: fg }}>
          {site.short.toLowerCase()}
        </span>
        <span className={`text-[13px] font-medium ${light ? 'text-white/60' : 'text-ink-mute'}`}>storkök</span>
      </span>
    </Link>
  );
}
