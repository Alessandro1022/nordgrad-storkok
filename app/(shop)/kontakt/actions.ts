'use server';

import { getSupabase } from '@/lib/supabase';

export type ContactState = { ok: boolean; error?: string };

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  const get = (k: string) => String(form.get(k) ?? '').trim();
  const row = {
    name: get('name'),
    email: get('email'),
    phone: get('phone') || null,
    company: get('company') || null,
    message: get('message'),
  };
  if (get('website')) return { ok: true }; // honeypot mot spam
  if (!row.name || !row.email || !row.message) return { ok: false, error: 'Fyll i namn, e-post och meddelande.' };
  if (!/^\S+@\S+\.\S+$/.test(row.email)) return { ok: false, error: 'E-postadressen ser inte rätt ut.' };
  if (form.get('consent') !== 'on') return { ok: false, error: 'Du behöver godkänna att vi sparar dina uppgifter.' };

  const sb = getSupabase();
  if (!sb) return { ok: true };
  const { error } = await sb.from('messages').insert(row);
  if (error) {
    console.error('sendMessage', error.message);
    return { ok: false, error: 'Meddelandet kunde inte skickas. Försök igen eller ring oss.' };
  }
  return { ok: true };
}
