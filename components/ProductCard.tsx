import Link from 'next/link';
import ProductImage from './ProductImage';
import AddToCart from './AddToCart';
import Spotlight from './Spotlight';
import { kr } from '@/lib/format';
import { discountPct, keyFacts, keySpecs } from '@/lib/product-utils';
import type { Product } from '@/lib/types';

export default function ProductCard({ product, large = false, badge }: { product: Product; large?: boolean; badge?: string }) {
  const off = discountPct(product);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-steel-200 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_30px_60px_-30px_rgba(21,24,22,0.35)]">
      <Spotlight className={`spot relative bg-steel-100 ${large ? 'flex-1 min-h-[300px]' : 'aspect-[5/4]'}`}>
        <Link href={`/produkt/${product.slug}`} tabIndex={-1} aria-hidden="true" className="absolute inset-0 flex items-center justify-center p-6">
          <ProductImage product={product} className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04]" />
        </Link>
        <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
          {badge && <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-white">{badge}</span>}
          {off > 0 && <span className="tabular rounded-full bg-signal px-3 py-1 text-[12px] font-bold text-ink">−{off} %</span>}
        </div>
      </Spotlight>

      <div className={`flex flex-col ${large ? 'gap-5 p-6 sm:p-8' : 'gap-3 p-5'}`}>
        <div>
          <p className="text-[13px] text-ink-mute">{product.subcategory}</p>
          <h3 className={`mt-1 font-semibold leading-tight tracking-tight ${large ? 'text-[26px] sm:text-[30px]' : 'text-[18px]'}`}>
            <Link href={`/produkt/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {product.name}
            </Link>
          </h3>
          {large && <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">{product.short}</p>}
        </div>

        {large ? (
          <dl className="grid grid-cols-3 gap-2">
            {keyFacts(product).map((f) => (
              <div key={f.label} className="rounded-lg bg-steel-50 px-3 py-2.5">
                <dt className="text-[12px] text-ink-mute">{f.label}</dt>
                <dd className="tabular mt-0.5 text-[14px] font-semibold">{f.value.replace(/^ca /, '')}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="tabular font-mono text-[12px] text-ink-mute">{keySpecs(product).join(' · ')}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div>
            <p className={`tabular font-bold leading-none tracking-tight ${large ? 'text-[30px]' : 'text-[22px]'}`}>{kr(product.price)}</p>
            <p className="tabular mt-1 text-[12px] text-ink-mute">
              {off > 0 && <span className="mr-1.5 line-through">{kr(product.compare_price!)}</span>}
              exkl. moms
            </p>
          </div>
          <div className="relative z-10">
            <AddToCart product={product} compact />
          </div>
        </div>
      </div>
    </article>
  );
}
