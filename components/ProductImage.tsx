/* eslint-disable @next/next/no-img-element */
import MachineArt from './MachineArt';
import type { Product } from '@/lib/types';

export default function ProductImage({
  product,
  className = '',
}: {
  product: Pick<Product, 'image_url' | 'art' | 'name'>;
  className?: string;
}) {
  if (product.image_url) {
    return <img src={product.image_url} alt={product.name} className={`h-full w-full object-contain ${className}`} />;
  }
  return <MachineArt variant={product.art} className={`h-full w-full ${className}`} />;
}
