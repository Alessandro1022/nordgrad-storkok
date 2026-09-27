import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Ny produkt</h1>
      <ProductForm />
    </div>
  );
}
