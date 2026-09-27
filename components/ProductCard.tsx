import Link from 'next/link';
import ProductImage from './ProductImage';
import AddToCart from './AddToCart';
import { kr } from '@/lib/format';
import { discountPct, keySpecs } from '@/lib/product-utils';
import type { Product } from '@/lib/types';

// Kortet ligger i ett rutnät med delade hårlinjer (se ProductGrid), som en tryckt katalog.
export default function ProductCard({ product }: { product: Product }) {
  const off = discountPct(product);
  const specs = keySpecs(product);
  return (
    <article className="group relative flex flex-col bg-white">
      <Link href={`/produkt/${product.slug}`} className="drafting relative block aspect-[4/3.4] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <ProductImage product={product} className="transition-transform duration-500 ease-out group-hover:scale-[1.035]" />
        {off > 0 && (
          <span className="tabular absolute right-0 top-4 bg-signal py-1 pl-2.5 pr-3 text-[13px] font-bold text-ink [clip-path:polygon(8px_0,100%_0,100%_100%,8px_100%,0_50%)]">
            −{off} %
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="artnr">Art.nr {product.sku || '—'}</p>
        <h3 className="mt-1.5 text-[18px] font-semibold leading-snug tracking-tight">
          <Link href={`/produkt/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-accent">
            {product.name}
          </Link>
        </h3>
        {specs.length > 0 && (
          <p className="tabular mt-2 font-mono text-[12px] leading-relaxed text-ink-soft">{specs.join('  ·  ')}</p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="tabular text-[22px] font-bold leading-none tracking-tight">{kr(product.price)}</p>
            <p className="tabular mt-1.5 text-[12px] text-ink-mute">
              {off > 0 ? <span className="line-through">{kr(product.compare_price!)}</span> : 'exkl. moms'}
              {off > 0 && ' · exkl. moms'}
            </p>
          </div>
          <div className="relative z-10">
            <AddToCart product={product} compact />
          </div>
        </div>
        <p className={`mt-4 flex items-center gap-1.5 border-t border-steel-100 pt-3 text-[12px] ${product.stock > 0 ? 'text-ok' : 'text-warn'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-ok' : 'bg-warn'}`} />
          {product.stock > 0 ? 'I lager · 1–3 dagar' : 'Beställningsvara'}
        </p>
      </div>
    </article>
  );
}

export function ProductGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 3 | 4 }) {
  return (
    <div
      className={`grid grid-cols-1 gap-px border border-steel-200 bg-steel-200 sm:grid-cols-2 ${cols === 4 ? 'lg:grid-cols-4' : 'xl:grid-cols-3'}`}
    >
      {children}
    </div>
  );
}
