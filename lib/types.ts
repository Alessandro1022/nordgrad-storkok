export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  short: string;
  description: string;
  price: number; // exkl. moms
  compare_price: number | null; // tidigare pris exkl. moms
  stock: number;
  featured: boolean;
  image_url: string | null;
  art: 'front' | 'hood' | 'glass' | 'generic';
  specs: Spec[];
  sort_order: number;
  created_at: string;
};

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
  image_url: string | null;
  art: Product['art'];
};

export type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  customer: Record<string, string>;
  items: { id: string; name: string; price: number; qty: number }[];
};

export type Message = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
};
