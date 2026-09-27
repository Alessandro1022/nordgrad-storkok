import { notFound } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { getProductById } from '@/lib/products';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Redigera: {product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
