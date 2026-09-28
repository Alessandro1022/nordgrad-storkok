import { getSupabase } from '../supabase';

export type PaymentSettings = {
  stripe: { enabled: boolean; secretKey: string; webhookSecret: string; card: boolean; klarna: boolean; paypal: boolean };
  klarna: { enabled: boolean; env: 'playground' | 'live'; username: string; password: string };
  paypal: { enabled: boolean; env: 'sandbox' | 'live'; clientId: string; secret: string };
  invoice: { enabled: boolean; label: string; description: string };
};

export const DEFAULT_SETTINGS: PaymentSettings = {
  stripe: { enabled: false, secretKey: '', webhookSecret: '', card: true, klarna: true, paypal: false },
  klarna: { enabled: false, env: 'playground', username: '', password: '' },
  paypal: { enabled: false, env: 'sandbox', clientId: '', secret: '' },
  invoice: { enabled: true, label: 'Faktura 30 dagar', description: 'För företag. Vi skickar faktura efter godkänd kreditkontroll.' },
};

const KEY = 'payments';

function merge(raw: Partial<PaymentSettings> | null | undefined): PaymentSettings {
  const r = raw ?? {};
  return {
    stripe: { ...DEFAULT_SETTINGS.stripe, ...(r.stripe ?? {}) },
    klarna: { ...DEFAULT_SETTINGS.klarna, ...(r.klarna ?? {}) },
    paypal: { ...DEFAULT_SETTINGS.paypal, ...(r.paypal ?? {}) },
    invoice: { ...DEFAULT_SETTINGS.invoice, ...(r.invoice ?? {}) },
  };
}

/** Läses bara på servern. Innehåller hemliga nycklar – skicka aldrig till webbläsaren. */
export async function getPaymentSettings(): Promise<PaymentSettings> {
  const sb = getSupabase();
  let s = DEFAULT_SETTINGS;
  if (sb) {
    const { data, error } = await sb.from('settings').select('value').eq('key', KEY).maybeSingle();
    if (error) console.error('getPaymentSettings', error.message);
    s = merge(data?.value as Partial<PaymentSettings> | undefined);
  }
  // Miljövariabler fungerar som reserv om inget är ifyllt i admin.
  if (!s.stripe.secretKey && process.env.STRIPE_SECRET_KEY) s = { ...s, stripe: { ...s.stripe, secretKey: process.env.STRIPE_SECRET_KEY } };
  if (!s.stripe.webhookSecret && process.env.STRIPE_WEBHOOK_SECRET) s = { ...s, stripe: { ...s.stripe, webhookSecret: process.env.STRIPE_WEBHOOK_SECRET } };
  return s;
}

export async function savePaymentSettings(s: PaymentSettings) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase är inte kopplat.');
  const { error } = await sb.from('settings').upsert({ key: KEY, value: s, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

// ---------- Vilka val kunden ser i kassan ----------

export type MethodId = 'card' | 'klarna' | 'paypal' | 'invoice';
export type Provider = 'stripe' | 'klarna' | 'paypal' | 'manual';
export type CheckoutOption = { id: MethodId; provider: Provider; label: string; description: string };

export function checkoutOptions(s: PaymentSettings, hasDb: boolean): CheckoutOption[] {
  const out: CheckoutOption[] = [];
  const stripeOn = hasDb && s.stripe.enabled && !!s.stripe.secretKey;
  const klarnaDirect = hasDb && s.klarna.enabled && !!s.klarna.username && !!s.klarna.password;
  const paypalDirect = hasDb && s.paypal.enabled && !!s.paypal.clientId && !!s.paypal.secret;

  if (stripeOn && s.stripe.card) out.push({ id: 'card', provider: 'stripe', label: 'Kort', description: 'Visa, Mastercard, Apple Pay, Google Pay' });
  if (klarnaDirect) out.push({ id: 'klarna', provider: 'klarna', label: 'Klarna', description: 'Faktura, delbetalning eller direkt' });
  else if (stripeOn && s.stripe.klarna) out.push({ id: 'klarna', provider: 'stripe', label: 'Klarna', description: 'Faktura, delbetalning eller direkt' });
  if (paypalDirect) out.push({ id: 'paypal', provider: 'paypal', label: 'PayPal', description: 'Betala med ditt PayPal-konto' });
  else if (stripeOn && s.stripe.paypal) out.push({ id: 'paypal', provider: 'stripe', label: 'PayPal', description: 'Betala med ditt PayPal-konto' });
  if (s.invoice.enabled || out.length === 0) out.push({ id: 'invoice', provider: 'manual', label: s.invoice.label, description: s.invoice.description });
  return out;
}

export function mask(secret: string) {
  if (!secret) return '';
  return `••••••••${secret.slice(-4)}`;
}
