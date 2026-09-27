import type { Product, Spec } from '@/lib/types';

const FALLBACK: Record<Product['art'], [number, number]> = {
  front: [600, 820],
  hood: [680, 1480],
  glass: [450, 700],
  generic: [600, 850],
};

const LABEL: Record<Product['art'], string> = {
  front: 'Frontvy',
  hood: 'Frontvy, huv stängd',
  glass: 'Frontvy',
  generic: 'Frontvy',
};

// Läser "600 × 600 × 820 mm" ur specifikationen "Mått (B×D×H)".
function dims(art: Product['art'], specs?: Spec[]): [number, number] {
  const m = specs?.find((s) => /mått/i.test(s.label))?.value.match(/(\d{3,4})\D+(\d{3,4})\D+(\d{3,4})/);
  if (m) return [Number(m[1]), Number(m[3])];
  return FALLBACK[art];
}

/**
 * Teknisk frontritning med måttlinjer, i stil med en tillverkares produktblad.
 * Visas när produkten saknar foto.
 */
export default function MachineArt({
  variant,
  specs,
  className = '',
  detailed = false,
}: {
  variant: Product['art'];
  specs?: Spec[];
  className?: string;
  detailed?: boolean;
}) {
  const [wMm, hMm] = dims(variant, specs);
  const V = 320;
  const maxH = 196;
  const maxW = 150;
  const s = Math.min(maxH / hMm, maxW / wMm);
  const w = wMm * s;
  const h = hMm * s;
  const base = 262;
  const x = 150 - w / 2;
  const y = base - h;

  const ink = '#151816';
  const thin = '#5e6660';
  const fill = '#ffffff';
  const panel = '#eceeeb';
  const green = '#0e5a44';

  const stroke = { stroke: ink, strokeWidth: 1.3, fill, vectorEffect: 'non-scaling-stroke' as const };

  let body: JSX.Element;
  if (variant === 'hood') {
    const cab = h * 0.46;
    const cabY = base - cab;
    body = (
      <g>
        {/* bänkar */}
        <rect x={x - 46} y={cabY} width={46} height={5} {...stroke} fill={panel} />
        <rect x={x + w} y={cabY} width={46} height={5} {...stroke} fill={panel} />
        <line x1={x - 40} x2={x - 40} y1={cabY + 5} y2={base} stroke={thin} strokeWidth={1} strokeDasharray="3 3" />
        <line x1={x + w + 40} x2={x + w + 40} y1={cabY + 5} y2={base} stroke={thin} strokeWidth={1} strokeDasharray="3 3" />
        {/* huv */}
        <rect x={x + 2} y={y + 6} width={w - 4} height={h - cab - 6} {...stroke} />
        <rect x={x + w * 0.3} y={y} width={w * 0.4} height={6} {...stroke} fill={ink} />
        <line x1={x + 8} x2={x + w - 8} y1={y + (h - cab) * 0.55} y2={y + (h - cab) * 0.55} stroke={thin} strokeWidth={1} />
        {/* skåp */}
        <rect x={x} y={cabY} width={w} height={cab - 6} {...stroke} />
        <rect x={x + 8} y={cabY + 8} width={w - 16} height={14} {...stroke} fill={panel} />
        <rect x={x + 14} y={cabY + 12} width={20} height={6} fill={ink} />
        <circle cx={x + w - 20} cy={cabY + 15} r={3} fill={green} />
        <rect x={x + 4} y={base - 6} width={6} height={6} fill={ink} />
        <rect x={x + w - 10} y={base - 6} width={6} height={6} fill={ink} />
      </g>
    );
  } else {
    const panelH = Math.max(14, h * 0.13);
    body = (
      <g>
        <rect x={x} y={y} width={w} height={h - 6} {...stroke} />
        <rect x={x} y={y} width={w} height={panelH} {...stroke} fill={panel} />
        <rect x={x + 8} y={y + panelH / 2 - 3.5} width={Math.min(26, w * 0.24)} height={7} fill={ink} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={x + w - 12 - i * 11} cy={y + panelH / 2} r={3} fill="none" stroke={ink} strokeWidth={1.2} />
        ))}
        <circle cx={x + w - 12} cy={y + panelH / 2} r={3} fill={green} />
        {/* lucka */}
        <rect x={x + 6} y={y + panelH + 6} width={w - 12} height={h - panelH - 18} {...stroke} />
        <rect x={x + w * 0.25} y={y + panelH + 12} width={w * 0.5} height={4} fill={ink} />
        {variant === 'glass'
          ? [0, 1, 2].map((i) => {
              const gx = x + w * 0.24 + i * (w * 0.2);
              const gy = base - 34;
              return <path key={i} d={`M${gx} ${gy} h${w * 0.12} l-2 16 h${-(w * 0.12) + 4} z`} fill="none" stroke={thin} strokeWidth={1} />;
            })
          : [0, 1, 2, 3].map((i) => (
              <line key={i} x1={x + 16} x2={x + w - 16} y1={base - 20 - i * 9} y2={base - 20 - i * 9} stroke={thin} strokeWidth={0.8} strokeDasharray="2 3" />
            ))}
        <rect x={x + 4} y={base - 6} width={6} height={6} fill={ink} />
        <rect x={x + w - 10} y={base - 6} width={6} height={6} fill={ink} />
      </g>
    );
  }

  // Måttlinjer
  const dimY = base + 22;
  const dimX = x + w + (variant === 'hood' ? 58 : 22);
  const tick = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={thin} strokeWidth={1} />
  );

  return (
    <svg viewBox={`0 0 ${V} ${V}`} className={className} role="img" aria-label={`Ritning, ${wMm} × ${hMm} mm`}>
      <text x="14" y="22" fontFamily="var(--font-mono), monospace" fontSize="8.5" letterSpacing="1" fill={thin}>
        {LABEL[variant].toUpperCase()}
      </text>
      {detailed && (
        <text x={V - 14} y="22" textAnchor="end" fontFamily="var(--font-mono), monospace" fontSize="8.5" letterSpacing="1" fill={thin}>
          MÅTT I MM
        </text>
      )}
      <line x1="14" x2={V - 14} y1={base} y2={base} stroke={ink} strokeWidth={1.3} />
      {body}
      {/* bredd */}
      {tick(x, base + 6, x, dimY + 5)}
      {tick(x + w, base + 6, x + w, dimY + 5)}
      <line x1={x} x2={x + w} y1={dimY} y2={dimY} stroke={thin} strokeWidth={1} markerStart="url(#a)" markerEnd="url(#a)" />
      <rect x={150 - 17} y={dimY - 7} width={34} height={13} fill="#f6f7f5" />
      <text x={150} y={dimY + 3.5} textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="10" fontWeight="500" fill={ink}>
        {wMm}
      </text>
      {/* höjd */}
      {tick(x + w + 4, y, dimX + 5, y)}
      {tick(x + w + 4, base, dimX + 5, base)}
      <line x1={dimX} x2={dimX} y1={y} y2={base} stroke={thin} strokeWidth={1} markerStart="url(#a)" markerEnd="url(#a)" />
      <g transform={`translate(${dimX}, ${(y + base) / 2}) rotate(-90)`}>
        <rect x={-19} y={-7} width={38} height={13} fill="#f6f7f5" />
        <text x={0} y={3.5} textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="10" fontWeight="500" fill={ink}>
          {hMm}
        </text>
      </g>
      <defs>
        <marker id="a" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M4 1 L4 7 M1.5 5.5 L6.5 2.5" stroke={ink} strokeWidth="1" fill="none" />
        </marker>
      </defs>
    </svg>
  );
}
