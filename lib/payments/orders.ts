import { getSupabase } from '../supabase';

export async function markOrderPaid(orderId: string, ref?: string) {
  const sb = getSupabase();
  if (!sb) return;
  const { data } = await sb.from('orders').select('status').eq('id', orderId).maybeSingle();
  // Rör inte en order som admin redan har flyttat vidare (skickad osv).
  if (data && !['vantar', 'misslyckad'].includes(data.status)) return;
  await sb
    .from('orders')
    .update({ status: 'betald', paid_at: new Date().toISOString(), ...(ref ? { payment_ref: ref } : {}) })
    .eq('id', orderId);
}

export async function markOrderFailed(orderId: string) {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from('orders').update({ status: 'misslyckad' }).eq('id', orderId).eq('status', 'vantar');
}
