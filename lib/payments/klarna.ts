import type { PaymentSettings } from './settings';
import { paymentLines, type OrderLine } from '../pricing';
import { site } from '../site';

function base(env: 'playground' | 'live') {
  return env === 'live' ? 'https://api.klarna.com' : 'https://api.playground.klarna.com';
}

function auth(username: string, password: string) {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

const TAX_RATE = Math.round(site.vatRate * 10000); // 2500 = 25 %

/**
 * Klarna Payments + Hosted Payment Page: kunden skickas till Klarnas egen betalsida.
 * Ordern läggs automatiskt (PLACE_ORDER) och dras sedan i Klarnas portal när den skickas.
 */
export async function createKlarnaSession(opts: {
  settings: PaymentSettings;
  orderId: string;
  items: OrderLine[];
  shipping: number;
  origin: string;
}) {
  const { username, password, env } = opts.settings.klarna;
  const b = base(env);
  const { lines } = paymentLines(opts.items, opts.shipping);

  const order_lines = lines.map((l) => {
    const total = l.unit * l.quantity;
    const tax = total - Math.round((total * 10000) / (10000 + TAX_RATE));
    return {
      type: l.reference === 'frakt' ? 'shipping_fee' : 'physical',
      reference: l.reference,
      name: l.name,
      quantity: l.quantity,
      unit_price: l.unit,
      tax_rate: TAX_RATE,
      total_amount: total,
      total_tax_amount: tax,
    };
  });
  const order_amount = order_lines.reduce((s, l) => s + l.total_amount, 0);
  const order_tax_amount = order_lines.reduce((s, l) => s + l.total_tax_amount, 0);

  const kp = await fetch(`${b}/payments/v1/sessions`, {
    method: 'POST',
    headers: { Authorization: auth(username, password), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'buy',
      purchase_country: 'SE',
      purchase_currency: 'SEK',
      locale: 'sv-SE',
      order_amount,
      order_tax_amount,
      order_lines,
      merchant_reference1: opts.orderId,
    }),
    cache: 'no-store',
  });
  const kpJson = (await kp.json()) as { session_id?: string; error_messages?: string[] };
  if (!kp.ok || !kpJson.session_id) throw new Error('Klarna kunde inte starta betalningen: ' + (kpJson.error_messages?.join(', ') ?? kp.status));

  const back = `${opts.origin}/kassa?avbruten=1`;
  const hpp = await fetch(`${b}/hpp/v1/sessions`, {
    method: 'POST',
    headers: { Authorization: auth(username, password), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payment_session_url: `${b}/payments/v1/sessions/${kpJson.session_id}`,
      merchant_urls: {
        success: `${opts.origin}/betalning/klar?provider=klarna&order=${opts.orderId}&sid={{session_id}}`,
        cancel: back,
        back,
        failure: back,
        error: back,
      },
      options: { place_order_mode: 'PLACE_ORDER' },
    }),
    cache: 'no-store',
  });
  const hppJson = (await hpp.json()) as { session_id?: string; redirect_url?: string; error_messages?: string[] };
  if (!hpp.ok || !hppJson.redirect_url) throw new Error('Klarna kunde inte skapa betalsidan: ' + (hppJson.error_messages?.join(', ') ?? hpp.status));
  return { url: hppJson.redirect_url, ref: hppJson.session_id ?? kpJson.session_id };
}

export async function verifyKlarna(settings: PaymentSettings, hppSessionId: string) {
  const { username, password, env } = settings.klarna;
  const res = await fetch(`${base(env)}/hpp/v1/sessions/${encodeURIComponent(hppSessionId)}`, {
    headers: { Authorization: auth(username, password) },
    cache: 'no-store',
  });
  if (!res.ok) return { status: 'failed' as const };
  const json = (await res.json()) as { status?: string; order_id?: string };
  return json.status === 'COMPLETED' ? { status: 'paid' as const, ref: json.order_id ?? hppSessionId } : { status: 'failed' as const };
}

export async function testKlarna(env: 'playground' | 'live', username: string, password: string) {
  // En session som inte finns ger 404 om inloggningen stämmer, annars 401.
  const res = await fetch(`${base(env)}/payments/v1/sessions/00000000-0000-0000-0000-000000000000`, {
    headers: { Authorization: auth(username, password) },
    cache: 'no-store',
  });
  if (res.status === 401 || res.status === 403) throw new Error('Fel användarnamn eller lösenord.');
  return env === 'live' ? 'Liveläge' : 'Playground (test)';
}
