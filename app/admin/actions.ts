'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { SESSION_COOKIE, adminCredentials, createSession, sessionMaxAge, verifySession } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { slugify } from '@/lib/format';

async function requireAdmin() {
  const s = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!s) redirect('/admin/login');
  return s;
}

function refreshShop() {
  revalidatePath('/', 'layout');
}

// ---------- Inloggning ----------

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const creds = adminCredentials();
  if (email !== creds.email || password !== creds.password) {
    await new Promise((r) => setTimeout(r, 600));
    return { error: 'Fel e-post eller lösenord.' };
  }
  const token = await createSession(email);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionMaxAge,
  });
  redirect('/admin');
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect('/admin/login');
}

// ---------- Produkter ----------

export type SaveState = { error?: string; ok?: boolean };

export async function saveProduct(_prev: SaveState, form: FormData): Promise<SaveState> {
  await requireAdmin();
  const sb = getSupabase();
  if (!sb) return { error: 'Koppla Supabase först (se README) – utan databas kan ändringar inte sparas.' };

  const get = (k: string) => String(form.get(k) ?? '').trim();
  const id = get('id');
  const name = get('name');
  if (!name) return { error: 'Produkten behöver ett namn.' };
  const price = Number(get('price').replace(/\s/g, '').replace(',', '.'));
  if (!Number.isFinite(price) || price < 0) return { error: 'Ange ett giltigt pris.' };
  const compareRaw = get('compare_price').replace(/\s/g, '').replace(',', '.');
  const compare_price = compareRaw ? Number(compareRaw) : null;

  const specs = get('specs')
    .split('\n')
    .map((line) => {
      const idx = line.indexOf(':');
      if (idx < 1) return null;
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((s): s is { label: string; value: string } => Boolean(s && s.label && s.value));

  let image_url: string | null = get('image_url') || null;
  const file = form.get('image_file');
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) return { error: 'Bilden får vara max 5 MB.' };
    if (!file.type.startsWith('image/')) return { error: 'Filen måste vara en bild (jpg, png eller webp).' };
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${Date.now()}-${slugify(name)}.${ext}`;
    const { error: upErr } = await sb.storage
      .from('produkter')
      .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (upErr) return { error: 'Bilden kunde inte laddas upp: ' + upErr.message };
    image_url = sb.storage.from('produkter').getPublicUrl(path).data.publicUrl;
  }
  if (form.get('remove_image') === 'on') image_url = null;

  let slug = slugify(get('slug') || name);
  if (!slug) slug = 'produkt-' + Date.now();

  const row = {
    name,
    slug,
    brand: get('brand'),
    category: get('category') || 'diskmaskiner',
    subcategory: get('subcategory'),
    short: get('short'),
    description: get('description'),
    price,
    compare_price: compare_price && compare_price > 0 ? compare_price : null,
    stock: Math.max(0, Math.floor(Number(get('stock')) || 0)),
    featured: form.get('featured') === 'on',
    art: get('art') || 'generic',
    sort_order: Math.floor(Number(get('sort_order')) || 100),
    image_url,
    specs,
  };

  const { data: clash } = await sb.from('products').select('id').eq('slug', slug).maybeSingle();
  if (clash && clash.id !== id) row.slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const { error } = id
    ? await sb.from('products').update(row).eq('id', id)
    : await sb.from('products').insert(row);
  if (error) return { error: 'Kunde inte spara: ' + error.message };

  refreshShop();
  redirect('/admin?sparad=1');
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const sb = getSupabase();
  const id = String(form.get('id') ?? '');
  if (sb && id) await sb.from('products').delete().eq('id', id);
  refreshShop();
  redirect('/admin?borttagen=1');
}

export async function toggleFeatured(form: FormData) {
  await requireAdmin();
  const sb = getSupabase();
  const id = String(form.get('id') ?? '');
  const next = form.get('next') === 'true';
  if (sb && id) await sb.from('products').update({ featured: next }).eq('id', id);
  refreshShop();
}

// ---------- Ordrar & meddelanden ----------

export async function setOrderStatus(form: FormData) {
  await requireAdmin();
  const sb = getSupabase();
  const id = String(form.get('id') ?? '');
  const status = String(form.get('status') ?? 'ny');
  if (sb && id) await sb.from('orders').update({ status }).eq('id', id);
  revalidatePath('/admin/ordrar');
}

export async function deleteMessage(form: FormData) {
  await requireAdmin();
  const sb = getSupabase();
  const id = String(form.get('id') ?? '');
  if (sb && id) await sb.from('messages').delete().eq('id', id);
  revalidatePath('/admin/meddelanden');
}
