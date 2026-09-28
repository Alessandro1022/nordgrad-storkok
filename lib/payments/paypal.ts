import type { PaymentSettings } from './settings';
import { paymentLines, type OrderLine } from '../pricing';

function base(s: PaymentSettings) {
  return s.paypal.env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

async function token(baseUrl: string, clientId: string, secret: string) {
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(res.status === 401 ? 'Fel Client ID eller Secret.' : `PayPal svarade ${res.status}.`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

const kr = (ore: number) => (ore / 100).toFixed(2);

export async function createPayPalOrder(opts: {
  settings: PaymentSettings;
  orderId: string;
  items: OrderLine[];
  shipping: number;
  origin: string;
}) {
  const b = base(opts.settings);
  const t = await token(b, opts.settings.paypal.clientId, opts.settings.paypal.secret);
  const { lines, total } = paymentLines(opts.items, opts.shipping);
  const res = await fetch(`${b}/v2/checkout/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': opts.orderId },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: opts.orderId,
          custom_id: opts.orderId,
          amount: {
            currency_code: 'SEK',
            value: kr(total),
            breakdown: { item_total: { currency_code: 'SEK', value: kr(total) } },
          },
          items: lines.map((l) => ({
            name: l.name.slice(0, 127),
            quantity: String(l.quantity),
            unit_amount: { currency_code: 'SEK', value: kr(l.unit) },
          })),
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            locale: 'sv-SE',
            user_action: 'PAY_NOW',
            shipping_preference: 'NO_SHIPPING',
            return_url: `${opts.origin}/betalning/klar?provider=paypal&order=${opts.orderId}`,
            cancel_url: `${opts.origin}/kassa?avbruten=1`,
          },
        },
      },
    }),
    cache: 'no-store',
  });
  const json = (await res.json()) as { id?: string; links?: { rel: string; href: string }[]; message?: string };
  if (!res.ok || !json.id) throw new Error('PayPal kunde inte skapa betalningen: ' + (json.message ?? res.status));
  const url = json.links?.find((l) => l.rel === 'payer-action' || l.rel === 'approve')?.href;
  if (!url) throw new Error('PayPal returnerade ingen betalsida.');
  return { url, ref: json.id };
}

export async function capturePayPal(settings: PaymentSettings, paypalOrderId: string, orderId: string) {
  const b = base(settings);
  const t = await token(b, settings.paypal.clientId, settings.paypal.secret);
  const cap = await fetch(`${b}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json', 'PayPal-Request-Id': `cap-${orderId}` },
    cache: 'no-store',
  });
  let json = (await cap.json()) as { status?: string; purchase_units?: { reference_id?: string }[] };
  if (!cap.ok) {
    // Redan dragen (t.ex. om kunden laddade om sidan): läs ordern i stället.
    const get = await fetch(`${b}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, { headers: { Authorization: `Bearer ${t}` }, cache: 'no-store' });
    json = await get.json();
  }
  if (json.purchase_units?.[0]?.reference_id && json.purchase_units[0].reference_id !== orderId) return { status: 'failed' as const };
  return json.status === 'COMPLETED' ? { status: 'paid' as const, ref: paypalOrderId } : { status: 'failed' as const };
}

export async function testPayPal(env: 'sandbox' | 'live', clientId: string, secret: string) {
  await token(env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com', clientId, secret);
  return env === 'live' ? 'Liveläge' : 'Sandbox';
}
