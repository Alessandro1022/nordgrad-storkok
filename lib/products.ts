import { getSupabase } from './supabase';
import { SEED_PRODUCTS } from './seed';
import type { Message, Order, Product } from './types';

function normalize(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    sku: String(row.sku ?? ''),
    name: String(row.name ?? ''),
    brand: String(row.brand ?? ''),
    category: String(row.category ?? ''),
    subcategory: String(row.subcategory ?? ''),
    short: String(row.short ?? ''),
    description: String(row.description ?? ''),
    price: Number(row.price ?? 0),
    compare_price: row.compare_price == null ? null : Number(row.compare_price),
    stock: Number(row.stock ?? 0),
    featured: Boolean(row.featured),
    image_url: (row.image_url as string) || null,
    art: ((row.art as Product['art']) || 'generic'),
    specs: Array.isArray(row.specs) ? (row.specs as Product['specs']) : [],
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ''),
  };
}

export async function listProducts(opts: { q?: string; category?: string; featured?: boolean } = {}) {
  const sb = getSupabase();
  let items: Product[];
  if (!sb) {
    items = SEED_PRODUCTS;
  } else {
    const { data, error } = await sb
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      console.error('listProducts', error.message);
      items = [];
    } else {
      items = (data ?? []).map(normalize);
    }
  }
  if (opts.category) items = items.filter((p) => p.category === opts.category);
  if (opts.featured) items = items.filter((p) => p.featured);
  if (opts.q) {
    const q = opts.q.toLowerCase();
    items = items.filter((p) =>
      [p.name, p.brand, p.short, p.subcategory, p.sku].some((f) => f.toLowerCase().includes(q)),
    );
  }
  return items;
}

export async function getProductBySlug(slug: string) {
  const sb = getSupabase();
  if (!sb) return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
  const { data } = await sb.from('products').select('*').eq('slug', slug).maybeSingle();
  return data ? normalize(data) : null;
}

export async function getProductById(id: string) {
  const sb = getSupabase();
  if (!sb) return SEED_PRODUCTS.find((p) => p.id === id) ?? null;
  const { data } = await sb.from('products').select('*').eq('id', id).maybeSingle();
  return data ? normalize(data) : null;
}

export async function getProductsByIds(ids: string[]) {
  const sb = getSupabase();
  if (!sb) return SEED_PRODUCTS.filter((p) => ids.includes(p.id));
  const { data } = await sb.from('products').select('*').in('id', ids);
  return (data ?? []).map(normalize);
}

export async function listOrders(): Promise<Order[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from('orders').select('*').order('created_at', { ascending: false }).limit(200);
  return (data ?? []) as Order[];
}

export async function listMessages(): Promise<Message[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb.from('messages').select('*').order('created_at', { ascending: false }).limit(200);
  return (data ?? []) as Message[];
}
