import Link from 'next/link';
import ProductImage from './ProductImage';
import AddToCart from './AddToCart';
import { inclVat, kr } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.compare_price && product.compare_price > product.price;
  return (
    <article className="group flex flex-col rounded-lg border border-steel-200 bg-white transition hover:border-steel-300 hover:shadow-[0_10px_30px_-18px_rgba(16,28,38,0.35)]">
      <Link href={`/produkt/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-t-lg bg-steel-50 p-6">
        <ProductImage product={product} className="transition duration-300 group-hover:scale-[1.03]" />
        {onSale && (
          <span className="absolute left-3 top-3 rounded bg-accent px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-white">
            Kampanj
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="eyebrow">{product.subcategory || product.brand}</p>
          <h3 className="mt-1 font-display text-[17px] font-bold leading-snug">
            <Link href={`/produkt/${product.slug}`} className="hover:text-accent">
              {product.name}
            </Link>
          </h3>
        </div>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="tabular text-lg font-bold">{kr(product.price)}</span>
            {onSale && <span className="tabular text-sm text-ink-mute line-through">{kr(product.compare_price!)}</span>}
          </div>
          <p className="tabular text-xs text-ink-mute">exkl. moms · {kr(inclVat(product.price))} inkl. moms</p>
        </div>
        <AddToCart product={product} compact />
      </div>
    </article>
  );
}
