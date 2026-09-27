import type { Product } from '@/lib/types';

// Ritade maskinillustrationer som visas när en produkt saknar foto.
export default function MachineArt({ variant, className = '' }: { variant: Product['art']; className?: string }) {
  const steel = '#dfe4e8';
  const edge = '#9aa6b0';
  const dark = '#2b3a47';
  const panel = '#101c26';
  const accent = '#0a5bd8';

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id="brushed" x1="0" x2="1">
          <stop offset="0" stopColor="#eef1f3" />
          <stop offset="0.5" stopColor="#d7dde2" />
          <stop offset="1" stopColor="#eef1f3" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="222" rx="86" ry="6" fill="#101c26" opacity="0.08" />
      {variant === 'hood' && (
        <g>
          <rect x="22" y="118" width="40" height="8" rx="2" fill={steel} stroke={edge} />
          <rect x="178" y="118" width="40" height="8" rx="2" fill={steel} stroke={edge} />
          <rect x="62" y="30" width="116" height="92" rx="4" fill="url(#brushed)" stroke={edge} />
          <rect x="72" y="42" width="96" height="10" rx="2" fill={steel} stroke={edge} />
          <rect x="112" y="22" width="16" height="10" rx="2" fill={dark} />
          <rect x="62" y="122" width="116" height="92" rx="3" fill="url(#brushed)" stroke={edge} />
          <rect x="74" y="132" width="92" height="22" rx="2" fill={panel} />
          <circle cx="86" cy="143" r="4" fill={accent} />
          <rect x="96" y="140" width="40" height="6" rx="1" fill="#3f5566" />
          <circle cx="152" cy="143" r="5" fill="#3f5566" />
          <rect x="66" y="210" width="8" height="10" fill={dark} />
          <rect x="166" y="210" width="8" height="10" fill={dark} />
        </g>
      )}
      {variant === 'front' && (
        <g>
          <rect x="54" y="42" width="132" height="172" rx="5" fill="url(#brushed)" stroke={edge} />
          <rect x="54" y="42" width="132" height="30" rx="5" fill={panel} />
          <circle cx="72" cy="57" r="5" fill={accent} />
          <rect x="84" y="53" width="44" height="8" rx="2" fill="#3f5566" />
          <circle cx="152" cy="57" r="4" fill="#3f5566" />
          <circle cx="168" cy="57" r="4" fill="#3f5566" />
          <rect x="66" y="82" width="108" height="112" rx="3" fill={steel} stroke={edge} />
          <rect x="84" y="88" width="72" height="6" rx="3" fill={dark} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1="74" x2="166" y1={112 + i * 12} y2={112 + i * 12} stroke="#c6cdd3" strokeWidth="1.5" />
          ))}
          <rect x="60" y="210" width="10" height="10" fill={dark} />
          <rect x="170" y="210" width="10" height="10" fill={dark} />
        </g>
      )}
      {variant === 'glass' && (
        <g>
          <rect x="68" y="76" width="104" height="138" rx="5" fill="url(#brushed)" stroke={edge} />
          <rect x="68" y="76" width="104" height="26" rx="5" fill={panel} />
          <circle cx="84" cy="89" r="4.5" fill={accent} />
          <rect x="96" y="86" width="34" height="7" rx="2" fill="#3f5566" />
          <rect x="78" y="110" width="84" height="88" rx="3" fill={steel} stroke={edge} />
          <rect x="94" y="116" width="52" height="5" rx="2.5" fill={dark} />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${92 + i * 20} 150 h12 l-2 22 a4 4 0 0 1 -8 0 z`}
              fill="#ffffff"
              stroke={edge}
              strokeWidth="1.2"
            />
          ))}
          <rect x="74" y="210" width="8" height="10" fill={dark} />
          <rect x="158" y="210" width="8" height="10" fill={dark} />
        </g>
      )}
      {variant === 'generic' && (
        <g>
          <rect x="50" y="60" width="140" height="154" rx="6" fill="url(#brushed)" stroke={edge} />
          <rect x="50" y="60" width="140" height="28" rx="6" fill={panel} />
          <circle cx="68" cy="74" r="5" fill={accent} />
          <rect x="80" y="70" width="50" height="8" rx="2" fill="#3f5566" />
          <rect x="64" y="100" width="112" height="98" rx="3" fill={steel} stroke={edge} />
          <rect x="100" y="108" width="40" height="6" rx="3" fill={dark} />
          <rect x="56" y="210" width="10" height="10" fill={dark} />
          <rect x="174" y="210" width="10" height="10" fill={dark} />
        </g>
      )}
    </svg>
  );
}
