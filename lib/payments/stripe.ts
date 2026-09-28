import Stripe from 'stripe';
import type { PaymentSettings } from './settings';
import { paymentLines, type OrderLine } from '../pricing';

export function stripeClient(s: PaymentSettings) {
  if (!s.stripe.secretKey) throw new Error('Stripe-nyckel saknas.');
  return new Stripe(s.stripe.secretKey);
}

export async function createStripeCheckout(opts: {
  settings: PaymentSettings;
  method: 'card' | 'klarna' | 'paypal';
  orderId: string;
  email: string;
  items: OrderLine[];
  shipping: number;
  origin: string;
}) {
  const stripe = stripeClient(opts.settings);
  const { lines } = paymentLines(opts.items, opts.shipping);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: [opts.method],
    locale: 'sv',
    customer_email: opts.email,
    client_reference_id: opts.orderId,
    metadata: { order_id: opts.orderId },
    payment_intent_data: { metadata: { order_id: opts.orderId } },
    line_items: lines.map((l) => ({
      quantity: l.quantity,
      price_data: { currency: 'sek', unit_amount: l.unit, product_data: { name: l.name } },
    })),
    success_url: `${opts.origin}/betalning/klar?provider=stripe&order=${opts.orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origin}/kassa?avbruten=1`,
  });
  if (!session.url) throw new Error('Stripe returnerade ingen betalsida.');
  return { url: session.url, ref: session.id };
}

export async function verifyStripe(settings: PaymentSettings, sessionId: string, orderId: string) {
  const session = await stripeClient(settings).checkout.sessions.retrieve(sessionId);
  if (session.metadata?.order_id !== orderId) return { status: 'failed' as const };
  if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') return { status: 'paid' as const, ref: session.id };
  if (session.status === 'complete') return { status: 'pending' as const, ref: session.id };
  return { status: 'failed' as const };
}

export async function testStripe(secretKey: string) {
  const stripe = new Stripe(secretKey);
  await stripe.balance.retrieve();
  return secretKey.startsWith('sk_test') || secretKey.startsWith('rk_test') ? 'Testläge' : 'Liveläge';
}

export function stripeErrorMessage(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  if (/payment method type.*(klarna|paypal)|not activated|invalid payment_method_types/i.test(msg))
    return 'Betalsättet är inte aktiverat i ditt Stripe-konto. Slå på det under Settings → Payment methods i Stripe.';
  if (/Invalid API Key|api key/i.test(msg)) return 'Stripe-nyckeln är ogiltig. Kontrollera den i admin under Betalning.';
  return 'Stripe kunde inte starta betalningen: ' + msg;
}
