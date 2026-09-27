/* eslint-disable @next/next/no-img-element */
import MachineArt from './MachineArt';
import type { Product, Spec } from '@/lib/types';

export default function ProductImage({
  product,
  className = '',
  detailed = false,
}: {
  product: Pick<Product, 'image_url' | 'art' | 'name'> & { specs?: Spec[] };
  className?: string;
  detailed?: boolean;
}) {
  if (product.image_url) {
    return <img src={product.image_url} alt={product.name} className={`h-full w-full object-contain ${className}`} />;
  }
  return <MachineArt variant={product.art} specs={product.specs} detailed={detailed} className={`h-full w-full ${className}`} />;
}
