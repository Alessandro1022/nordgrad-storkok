import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { getPaymentSettings } from '@/lib/payments/settings';
import { stripeClient } from '@/lib/payments/stripe';
import { markOrderFailed, markOrderPaid } from '@/lib/payments/orders';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Stripe meddelar hit när en betalning blir klar, även om kunden stänger fönstret.
// Lägg in adressen under Developers → Webhooks i Stripe (se admin → Betalning).
export async function POST(req: NextRequest) {
  const settings = await getPaymentSettings();
  if (!settings.stripe.secretKey || !settings.stripe.webhookSecret) {
    return NextResponse.json({ error: 'Stripe är inte konfigurerat' }, { status: 400 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature') ?? '';
  let event: Stripe.Event;
  try {
    event = stripeClient(settings).webhooks.constructEvent(body, sig, settings.stripe.webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Ogiltig signatur' }, { status: 400 });
  }

  if (event.type.startsWith('checkout.session.')) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      if (
        (event.type === 'checkout.session.completed' && session.payment_status === 'paid') ||
        event.type === 'checkout.session.async_payment_succeeded'
      ) {
        await markOrderPaid(orderId, session.id);
      }
      if (event.type === 'checkout.session.async_payment_failed' || event.type === 'checkout.session.expired') {
        await markOrderFailed(orderId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
