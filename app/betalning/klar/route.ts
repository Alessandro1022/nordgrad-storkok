import { NextResponse, type NextRequest } from 'next/server';
import { getPaymentSettings } from '@/lib/payments/settings';
import { verifyStripe } from '@/lib/payments/stripe';
import { capturePayPal } from '@/lib/payments/paypal';
import { verifyKlarna } from '@/lib/payments/klarna';
import { markOrderFailed, markOrderPaid } from '@/lib/payments/orders';
import { shortId } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

// Kunden landar här efter Stripe, PayPal eller Klarna. Vi frågar leverantören
// direkt om betalningen gick igenom innan ordern markeras som betald.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const provider = p.get('provider');
  const orderId = p.get('order') ?? '';
  const to = (status: string) => {
    const url = req.nextUrl.clone();
    url.pathname = '/tack';
    url.search = `?order=${shortId(orderId)}&status=${status}`;
    return NextResponse.redirect(url);
  };

  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return to('misslyckad');

  try {
    const settings = await getPaymentSettings();
    let result: { status: 'paid' | 'pending' | 'failed'; ref?: string } = { status: 'failed' };

    if (provider === 'stripe' && p.get('session_id')) result = await verifyStripe(settings, p.get('session_id')!, orderId);
    if (provider === 'paypal' && p.get('token')) result = await capturePayPal(settings, p.get('token')!, orderId);
    if (provider === 'klarna' && p.get('sid')) result = await verifyKlarna(settings, p.get('sid')!);

    if (result.status === 'paid') {
      await markOrderPaid(orderId, result.ref);
      return to('betald');
    }
    if (result.status === 'pending') return to('behandlas');
    await markOrderFailed(orderId);
    return to('misslyckad');
  } catch (e) {
    console.error('betalning/klar', e);
    return to('misslyckad');
  }
}
