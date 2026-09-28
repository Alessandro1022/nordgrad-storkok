import { headers } from 'next/headers';
import PaymentSettingsForm from '@/components/PaymentSettingsForm';
import { hasDatabase } from '@/lib/supabase';
import { checkoutOptions, getPaymentSettings, mask } from '@/lib/payments/settings';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  const s = await getPaymentSettings();
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'din-doman.se';
  const proto = h.get('x-forwarded-proto') ?? 'https';

  // Hemliga nycklar visas bara maskerade.
  const view = {
    stripe: { ...s.stripe, secretKey: mask(s.stripe.secretKey), webhookSecret: mask(s.stripe.webhookSecret) },
    klarna: { ...s.klarna, password: mask(s.klarna.password) },
    paypal: { ...s.paypal, secret: mask(s.paypal.secret) },
    invoice: s.invoice,
  };
  const live = checkoutOptions(s, hasDatabase()).map((o) => ({ label: o.label, via: o.provider }));
  const stripeMode = s.stripe.secretKey ? (/_test_/.test(s.stripe.secretKey) ? 'test' : 'live') : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Betalning</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">
          Lägg in dina egna nycklar och välj vilka betalsätt kunden ser i kassan. Nycklarna sparas i din databas där bara servern kommer åt dem,
          och visas aldrig i klartext igen.
        </p>
      </div>

      <div className="rounded-lg border border-steel-200 bg-white p-4">
        <p className="text-[13px] font-semibold text-ink-mute">Kunden ser just nu i kassan</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {live.map((o) => (
            <li key={o.label} className="rounded-full bg-steel-100 px-3 py-1 text-sm">
              <span className="font-semibold">{o.label}</span>
              <span className="text-ink-mute"> · {o.via === 'manual' ? 'manuell' : `via ${o.via[0].toUpperCase()}${o.via.slice(1)}`}</span>
            </li>
          ))}
        </ul>
      </div>

      <PaymentSettingsForm
        initial={view}
        stripeMode={stripeMode}
        webhookUrl={`${proto}://${host}/api/webhooks/stripe`}
        hasDb={hasDatabase()}
      />
    </div>
  );
}
