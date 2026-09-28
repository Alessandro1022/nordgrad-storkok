import type { Product, Spec } from '@/lib/types';

type Art = Product['art'];

const FALLBACK: Record<Art, [number, number]> = {
  fryer: [290, 340],
  front: [600, 820],
  oven: [780, 580],
  fridge: [1360, 850],
  hood: [680, 1480],
  glass: [450, 700],
  generic: [600, 850],
};

function spec(specs: Spec[] | undefined, re: RegExp) {
  return specs?.find((s) => re.test(s.label))?.value;
}

// Läser bredd och höjd ur "Mått (B×D×H)": "600 × 600 × 820 mm".
function dims(art: Art, specs?: Spec[]): [number, number] {
  const m = spec(specs, /mått/i)?.match(/(\d{3,4})\D+(\d{3,4})\D+(\d{3,4})/);
  return m ? [Number(m[1]), Number(m[3])] : FALLBACK[art];
}

function count(specs: Spec[] | undefined, re: RegExp, fallback: number) {
  const n = parseInt(spec(specs, re) ?? '', 10);
  return Number.isFinite(n) && n > 0 && n < 6 ? n : fallback;
}

const INK = '#151816';
const THIN = '#5e6660';
const FILL = '#ffffff';
const PANEL = '#eceeeb';
const GREEN = '#0e5a44';
const MONO = 'var(--font-mono), ui-monospace, monospace';

/**
 * Teknisk frontritning i stil med en tillverkares produktblad.
 * `detailed` lägger till måttlinjer och vy-etikett (produktsidan).
 */
export default function MachineArt({
  variant,
  specs,
  className = '',
  detailed = false,
}: {
  variant: Art;
  specs?: Spec[];
  className?: string;
  detailed?: boolean;
}) {
  const [wMm, hMm] = dims(variant, specs);
  const V = 320;
  const L = detailed
    ? { maxH: 190, maxW: 210, cx: 148, base: 262 }
    : { maxH: 200, maxW: 250, cx: 160, base: 272 };
  const s = Math.min(L.maxH / hMm, L.maxW / wMm);
  const w = wMm * s;
  const h = hMm * s;
  const base = L.base;
  const x = L.cx - w / 2;
  const y = base - h;
  const sw = { stroke: INK, strokeWidth: 1.4, strokeLinejoin: 'round' as const };
  const feet = (
    <>
      <rect x={x + 5} y={base - 6} width={7} height={6} fill={INK} />
      <rect x={x + w - 12} y={base - 6} width={7} height={6} fill={INK} />
    </>
  );

  let body: JSX.Element;

  if (variant === 'fryer') {
    const n = count(specs, /korgar/i, wMm > 350 ? 2 : 1);
    const tall = h / w > 1.4;
    const panelH = tall ? Math.min(34, h * 0.2) : h * 0.42;
    const bodyH = tall ? h - 6 : h;
    body = (
      <g>
        {/* korghandtag */}
        {Array.from({ length: n }).map((_, i) => {
          const bx = x + (w * (i + 0.5)) / n;
          return (
            <g key={i}>
              <path d={`M${bx - 10} ${y + 2} L${bx - 10} ${y - 14} L${bx + 14} ${y - 22}`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
              <circle cx={bx + 14} cy={y - 22} r={3.2} fill={INK} />
            </g>
          );
        })}
        <rect x={x - 2} y={y} width={w + 4} height={5} fill={PANEL} {...sw} />
        <rect x={x} y={y + 5} width={w} height={bodyH - 5} fill={FILL} {...sw} />
        <rect x={x} y={y + 5} width={w} height={panelH} fill={PANEL} {...sw} />
        {Array.from({ length: n }).map((_, i) => {
          const bx = x + (w * (i + 0.5)) / n;
          const cy = y + 5 + panelH / 2;
          return (
            <g key={i}>
              <circle cx={bx} cy={cy} r={Math.min(9, panelH * 0.3)} fill={FILL} {...sw} />
              <line x1={bx} y1={cy} x2={bx} y2={cy - Math.min(6, panelH * 0.2)} stroke={INK} strokeWidth={1.6} />
              <circle cx={bx + Math.min(18, w / n / 3)} cy={cy} r={2.4} fill={GREEN} />
            </g>
          );
        })}
        {tall ? (
          <>
            <rect x={x + 6} y={y + 5 + panelH + 6} width={w - 12} height={bodyH - panelH - 22} fill={FILL} {...sw} />
            <rect x={x + w * 0.3} y={y + 5 + panelH + 12} width={w * 0.4} height={4} fill={INK} />
            {feet}
          </>
        ) : (
          <>
            {[0, 1, 2].map((i) => (
              <line key={i} x1={x + 8} x2={x + w - 8} y1={y + 5 + panelH + 10 + i * 7} y2={y + 5 + panelH + 10 + i * 7} stroke={THIN} strokeWidth={0.8} strokeDasharray="2 3" />
            ))}
          </>
        )}
      </g>
    );
  } else if (variant === 'oven') {
    const ctrlW = Math.max(28, w * 0.22);
    const doorW = w - ctrlW;
    body = (
      <g>
        <rect x={x} y={y} width={w} height={h - 6} fill={FILL} {...sw} />
        <rect x={x + 6} y={y + 6} width={doorW - 10} height={h - 18} rx={3} fill={FILL} {...sw} />
        <rect x={x + 14} y={y + 14} width={doorW - 26} height={h - 34} rx={2} fill={PANEL} stroke={THIN} strokeWidth={1} />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={x + 20} x2={x + doorW - 18} y1={y + 14 + ((h - 34) * (i + 1)) / 5} y2={y + 14 + ((h - 34) * (i + 1)) / 5} stroke={THIN} strokeWidth={1} />
        ))}
        <rect x={x + doorW - 8} y={y + h * 0.25} width={4} height={h * 0.4} rx={2} fill={INK} />
        <line x1={x + doorW} x2={x + doorW} y1={y} y2={y + h - 6} stroke={INK} strokeWidth={1.4} />
        <rect x={x + doorW + ctrlW * 0.18} y={y + 12} width={ctrlW * 0.64} height={12} fill={INK} />
        <text x={x + doorW + ctrlW / 2} y={y + 21} textAnchor="middle" fontFamily={MONO} fontSize={7} fill="#7fd1a9">
          180°
        </text>
        {[0, 1].map((i) => (
          <circle key={i} cx={x + doorW + ctrlW / 2} cy={y + 42 + i * 24} r={Math.min(8, ctrlW * 0.26)} fill={FILL} {...sw} />
        ))}
        <circle cx={x + doorW + ctrlW / 2} cy={y + h - 26} r={2.6} fill={GREEN} />
        {feet}
      </g>
    );
  } else if (variant === 'fridge') {
    const n = count(specs, /dörrar/i, 2);
    const unitW = w * 0.2;
    const doorW = (w - unitW - 6) / n;
    body = (
      <g>
        <rect x={x - 3} y={y} width={w + 6} height={7} fill={PANEL} {...sw} />
        <rect x={x} y={y + 7} width={w} height={h - 13} fill={FILL} {...sw} />
        {Array.from({ length: n }).map((_, i) => {
          const dx = x + 4 + i * doorW;
          return (
            <g key={i}>
              <rect x={dx + 2} y={y + 12} width={doorW - 4} height={h - 30} fill={FILL} {...sw} />
              <rect x={dx + doorW * 0.2} y={y + 18} width={doorW * 0.6} height={4} rx={2} fill={INK} />
            </g>
          );
        })}
        <rect x={x + w - unitW} y={y + 12} width={unitW - 4} height={h - 30} fill={PANEL} {...sw} />
        <rect x={x + w - unitW + 6} y={y + 18} width={unitW - 16} height={9} fill={INK} />
        <text x={x + w - unitW / 2 - 2} y={y + 25} textAnchor="middle" fontFamily={MONO} fontSize={6.5} fill="#7fd1a9">
          +3°
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={x + w - unitW + 5} x2={x + w - 9} y1={y + 40 + i * 6} y2={y + 40 + i * 6} stroke={THIN} strokeWidth={1} />
        ))}
        {feet}
      </g>
    );
  } else if (variant === 'hood') {
    const cab = h * 0.46;
    const cabY = base - cab;
    body = (
      <g>
        <rect x={x - 40} y={cabY} width={40} height={5} fill={PANEL} {...sw} />
        <rect x={x + w} y={cabY} width={40} height={5} fill={PANEL} {...sw} />
        <rect x={x + 2} y={y + 6} width={w - 4} height={h - cab - 6} fill={FILL} {...sw} />
        <rect x={x + w * 0.3} y={y} width={w * 0.4} height={6} fill={INK} />
        <rect x={x} y={cabY} width={w} height={cab - 6} fill={FILL} {...sw} />
        <rect x={x + 8} y={cabY + 8} width={w - 16} height={14} fill={PANEL} {...sw} />
        <circle cx={x + w - 20} cy={cabY + 15} r={3} fill={GREEN} />
        {feet}
      </g>
    );
  } else {
    const panelH = Math.max(14, h * 0.13);
    body = (
      <g>
        <rect x={x} y={y} width={w} height={h - 6} fill={FILL} {...sw} />
        <rect x={x} y={y} width={w} height={panelH} fill={PANEL} {...sw} />
        <rect x={x + 8} y={y + panelH / 2 - 3.5} width={Math.min(26, w * 0.24)} height={7} fill={INK} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={x + w - 12 - i * 11} cy={y + panelH / 2} r={3} fill={i === 0 ? GREEN : 'none'} stroke={INK} strokeWidth={1.2} />
        ))}
        <rect x={x + 6} y={y + panelH + 6} width={w - 12} height={h - panelH - 18} fill={FILL} {...sw} />
        <rect x={x + w * 0.25} y={y + panelH + 12} width={w * 0.5} height={4} fill={INK} />
        {variant === 'glass'
          ? [0, 1, 2].map((i) => {
              const gx = x + w * 0.24 + i * (w * 0.2);
              return <path key={i} d={`M${gx} ${base - 34} h${w * 0.12} l-2 16 h${-(w * 0.12) + 4} z`} fill="none" stroke={THIN} strokeWidth={1} />;
            })
          : [0, 1, 2, 3].map((i) => (
              <line key={i} x1={x + 16} x2={x + w - 16} y1={base - 20 - i * 9} y2={base - 20 - i * 9} stroke={THIN} strokeWidth={0.8} strokeDasharray="2 3" />
            ))}
        {feet}
      </g>
    );
  }

  const dimY = base + 22;
  const dimX = x + w + (variant === 'hood' ? 52 : 20);

  return (
    <svg viewBox={`0 0 ${V} ${V}`} className={className} role="img" aria-label={`Ritning, ${wMm} × ${hMm} mm`}>
      <defs>
        <marker id="tick" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M4 1 L4 7 M1.5 5.5 L6.5 2.5" stroke={INK} strokeWidth="1" fill="none" />
        </marker>
      </defs>
      {detailed && (
        <>
          <text x="14" y="22" fontFamily={MONO} fontSize="8.5" letterSpacing="1" fill={THIN}>FRONTVY</text>
          <text x={V - 14} y="22" textAnchor="end" fontFamily={MONO} fontSize="8.5" letterSpacing="1" fill={THIN}>MÅTT I MM</text>
        </>
      )}
      <line x1="14" x2={V - 14} y1={base} y2={base} stroke={INK} strokeWidth={1.4} />
      {!detailed && <ellipse cx={L.cx} cy={base + 1} rx={w * 0.55} ry={4} fill={INK} opacity={0.06} />}
      {body}
      {detailed && (
        <g>
          <line x1={x} y1={base + 6} x2={x} y2={dimY + 5} stroke={THIN} strokeWidth={1} />
          <line x1={x + w} y1={base + 6} x2={x + w} y2={dimY + 5} stroke={THIN} strokeWidth={1} />
          <line x1={x} x2={x + w} y1={dimY} y2={dimY} stroke={THIN} strokeWidth={1} markerStart="url(#tick)" markerEnd="url(#tick)" />
          <rect x={L.cx - 18} y={dimY - 7} width={36} height={13} fill="#f6f7f5" />
          <text x={L.cx} y={dimY + 3.5} textAnchor="middle" fontFamily={MONO} fontSize="10" fontWeight="500" fill={INK}>{wMm}</text>
          <line x1={x + w + 4} y1={y} x2={dimX + 5} y2={y} stroke={THIN} strokeWidth={1} />
          <line x1={x + w + 4} y1={base} x2={dimX + 5} y2={base} stroke={THIN} strokeWidth={1} />
          <line x1={dimX} x2={dimX} y1={y} y2={base} stroke={THIN} strokeWidth={1} markerStart="url(#tick)" markerEnd="url(#tick)" />
          <g transform={`translate(${dimX}, ${(y + base) / 2}) rotate(-90)`}>
            <rect x={-19} y={-7} width={38} height={13} fill="#f6f7f5" />
            <text x={0} y={3.5} textAnchor="middle" fontFamily={MONO} fontSize="10" fontWeight="500" fill={INK}>{hMm}</text>
          </g>
        </g>
      )}
    </svg>
  );
}
