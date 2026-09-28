'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-guard';
import { hasDatabase } from '@/lib/supabase';
import { getPaymentSettings, savePaymentSettings, type PaymentSettings } from '@/lib/payments/settings';
import { testStripe } from '@/lib/payments/stripe';
import { testPayPal } from '@/lib/payments/paypal';
import { testKlarna } from '@/lib/payments/klarna';

export type Check = { ok: boolean; text: string };
export type PaymentsState = { saved?: boolean; error?: string; checks?: Partial<Record<'stripe' | 'klarna' | 'paypal', Check>> };

export async function savePayments(_prev: PaymentsState, form: FormData): Promise<PaymentsState> {
  await requireAdmin();
  if (!hasDatabase()) return { error: 'Koppla Supabase först (se README). Utan databas kan inställningarna inte sparas.' };

  const old = await getPaymentSettings();
  const str = (k: string) => String(form.get(k) ?? '').trim();
  const on = (k: string) => form.get(k) === 'on';
  // Tomt fält eller maskerat värde = behåll den sparade nyckeln.
  const secret = (k: string, prev: string) => {
    const v = str(k);
    return !v || v.startsWith('••') ? prev : v;
  };

  const next: PaymentSettings = {
    stripe: {
      enabled: on('stripe_enabled'),
      secretKey: secret('stripe_secret', old.stripe.secretKey),
      webhookSecret: secret('stripe_webhook', old.stripe.webhookSecret),
      card: on('stripe_card'),
      klarna: on('stripe_klarna'),
      paypal: on('stripe_paypal'),
    },
    klarna: {
      enabled: on('klarna_enabled'),
      env: str('klarna_env') === 'live' ? 'live' : 'playground',
      username: str('klarna_username') || old.klarna.username,
      password: secret('klarna_password', old.klarna.password),
    },
    paypal: {
      enabled: on('paypal_enabled'),
      env: str('paypal_env') === 'live' ? 'live' : 'sandbox',
      clientId: str('paypal_client') || old.paypal.clientId,
      secret: secret('paypal_secret', old.paypal.secret),
    },
    invoice: {
      enabled: on('invoice_enabled'),
      label: str('invoice_label') || old.invoice.label,
      description: str('invoice_description'),
    },
  };

  if (form.get('clear_stripe') === 'on') next.stripe = { ...next.stripe, enabled: false, secretKey: '', webhookSecret: '' };
  if (form.get('clear_klarna') === 'on') next.klarna = { ...next.klarna, enabled: false, username: '', password: '' };
  if (form.get('clear_paypal') === 'on') next.paypal = { ...next.paypal, enabled: false, clientId: '', secret: '' };

  if (next.stripe.secretKey && !/^(sk|rk)_(test|live)_/.test(next.stripe.secretKey)) {
    return { error: 'Stripe-nyckeln ska börja med sk_test_, sk_live_ eller rk_. Du har troligen klistrat in den publika nyckeln (pk_).' };
  }
  if (next.stripe.webhookSecret && !next.stripe.webhookSecret.startsWith('whsec_')) {
    return { error: 'Webhook-hemligheten ska börja med whsec_.' };
  }

  // Testa anslutningen för varje påslagen leverantör.
  const checks: PaymentsState['checks'] = {};
  const run = async (key: 'stripe' | 'klarna' | 'paypal', fn: () => Promise<string>) => {
    try {
      checks[key] = { ok: true, text: `Ansluten · ${await fn()}` };
    } catch (e) {
      checks[key] = { ok: false, text: e instanceof Error ? e.message : 'Kunde inte ansluta.' };
    }
  };
  const jobs: Promise<void>[] = [];
  if (next.stripe.enabled && next.stripe.secretKey) jobs.push(run('stripe', () => testStripe(next.stripe.secretKey)));
  if (next.klarna.enabled && next.klarna.username && next.klarna.password)
    jobs.push(run('klarna', () => testKlarna(next.klarna.env, next.klarna.username, next.klarna.password)));
  if (next.paypal.enabled && next.paypal.clientId && next.paypal.secret)
    jobs.push(run('paypal', () => testPayPal(next.paypal.env, next.paypal.clientId, next.paypal.secret)));
  await Promise.all(jobs);

  try {
    await savePaymentSettings(next);
  } catch (e) {
    return { error: 'Kunde inte spara: ' + (e instanceof Error ? e.message : String(e)) + '. Har du kört senaste supabase/schema.sql?' };
  }
  revalidatePath('/admin/betalning');
  revalidatePath('/kassa');
  return { saved: true, checks };
}
