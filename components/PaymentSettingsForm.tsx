'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { savePayments, type Check, type PaymentsState } from '@/app/admin/payments-actions';
import type { PaymentSettings } from '@/lib/payments/settings';

function Save() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary" disabled={pending}>
      {pending ? 'Sparar och testar anslutning…' : 'Spara inställningar'}
    </button>
  );
}

export default function PaymentSettingsForm({
  initial,
  stripeMode,
  webhookUrl,
  hasDb,
}: {
  initial: PaymentSettings;
  stripeMode: 'test' | 'live' | null;
  webhookUrl: string;
  hasDb: boolean;
}) {
  const [state, action] = useFormState<PaymentsState, FormData>(savePayments, {});
  const [stripeOn, setStripeOn] = useState(initial.stripe.enabled);
  const [klarnaOn, setKlarnaOn] = useState(initial.klarna.enabled);
  const [paypalOn, setPaypalOn] = useState(initial.paypal.enabled);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <form action={action} className="space-y-5">
      {!hasDb && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Supabase är inte kopplat, så inställningarna kan inte sparas. Kunden ser bara faktura tills databasen är på plats.
        </p>
      )}

      {/* ---------- Stripe ---------- */}
      <Provider
        name="Stripe"
        tag="Kort · Apple Pay · Google Pay · Klarna · PayPal"
        enabled={stripeOn}
        onToggle={setStripeOn}
        toggleName="stripe_enabled"
        check={state.checks?.stripe}
        badge={stripeMode ? (stripeMode === 'test' ? 'Testläge' : 'Live') : undefined}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="stripe_secret"
            label="Secret key"
            hint="Stripe → Developers → API keys. Börjar med sk_test_ eller sk_live_."
            defaultValue={initial.stripe.secretKey}
            placeholder="sk_live_…"
            secret
          />
          <Field
            id="stripe_webhook"
            label="Webhook signing secret"
            hint="Valfritt men rekommenderat. Börjar med whsec_."
            defaultValue={initial.stripe.webhookSecret}
            placeholder="whsec_…"
            secret
          />
        </div>

        <fieldset className="mt-5">
          <legend className="label">Betalsätt via Stripe</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            <Check id="stripe_card" label="Kort & plånböcker" hint="Visa, Mastercard, Apple Pay, Google Pay" defaultChecked={initial.stripe.card} />
            <Check id="stripe_klarna" label="Klarna" hint="Används om Klarna direkt är av" defaultChecked={initial.stripe.klarna} />
            <Check id="stripe_paypal" label="PayPal" hint="Används om PayPal direkt är av" defaultChecked={initial.stripe.paypal} />
          </div>
          <p className="mt-2 text-xs text-ink-mute">Klarna och PayPal måste också vara aktiverade i Stripe under Settings → Payment methods.</p>
        </fieldset>

        <div className="mt-5 rounded-lg bg-steel-50 p-4 text-sm">
          <p className="font-semibold">Webhook i Stripe</p>
          <p className="mt-1 text-ink-soft">
            Skapa en endpoint under Developers → Webhooks med den här adressen och händelserna <code className="font-mono text-xs">checkout.session.*</code>.
            Då markeras ordern som betald även om kunden stänger fönstret.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 select-all break-all rounded-md border border-steel-200 bg-white px-3 py-2 font-mono text-xs">{webhookUrl}</code>
            <button type="button" onClick={copy} className="btn-ghost px-3 py-2 text-xs">
              {copied ? 'Kopierad' : 'Kopiera'}
            </button>
          </div>
        </div>
        <Clear id="clear_stripe" label="Ta bort sparade Stripe-nycklar" />
      </Provider>

      {/* ---------- Klarna direkt ---------- */}
      <Provider
        name="Klarna"
        tag="Eget avtal med Klarna"
        enabled={klarnaOn}
        onToggle={setKlarnaOn}
        toggleName="klarna_enabled"
        check={state.checks?.klarna}
        note="Har du inget eget Klarna-avtal? Låt den vara av och slå på Klarna under Stripe i stället."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Env id="klarna_env" defaultValue={initial.klarna.env} options={[['playground', 'Playground (test)'], ['live', 'Live']]} />
          <Field id="klarna_username" label="Användarnamn (UID)" hint="Klarna Merchant Portal → Settings → API credentials" defaultValue={initial.klarna.username} placeholder="PK12345_…" />
          <Field id="klarna_password" label="Lösenord" defaultValue={initial.klarna.password} secret />
        </div>
        <p className="mt-3 text-xs text-ink-mute">Ordern skapas i Klarna när kunden betalat. Aktivera (dra) den i Klarnas portal när du skickar varan.</p>
        <Clear id="clear_klarna" label="Ta bort sparade Klarna-uppgifter" />
      </Provider>

      {/* ---------- PayPal direkt ---------- */}
      <Provider
        name="PayPal"
        tag="Eget PayPal Business-konto"
        enabled={paypalOn}
        onToggle={setPaypalOn}
        toggleName="paypal_enabled"
        check={state.checks?.paypal}
        note="Har du inget eget PayPal Business-konto? Låt den vara av och slå på PayPal under Stripe i stället."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Env id="paypal_env" defaultValue={initial.paypal.env} options={[['sandbox', 'Sandbox (test)'], ['live', 'Live']]} />
          <Field id="paypal_client" label="Client ID" hint="developer.paypal.com → Apps & Credentials" defaultValue={initial.paypal.clientId} />
          <Field id="paypal_secret" label="Secret" defaultValue={initial.paypal.secret} secret />
        </div>
        <Clear id="clear_paypal" label="Ta bort sparade PayPal-uppgifter" />
      </Provider>

      {/* ---------- Faktura ---------- */}
      <section className="rounded-xl border border-steel-200 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Faktura (manuell)</h2>
            <p className="text-sm text-ink-mute">Ordern sparas och du skickar faktura själv. Visas alltid om inget annat är påslaget.</p>
          </div>
          <Switch name="invoice_enabled" defaultChecked={initial.invoice.enabled} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field id="invoice_label" label="Namn i kassan" defaultValue={initial.invoice.label} />
          <Field id="invoice_description" label="Beskrivning" defaultValue={initial.invoice.description} />
        </div>
      </section>

      {state.error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
      {state.saved && (
        <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800" role="status">
          Sparat. Kassan använder de nya inställningarna direkt.
        </p>
      )}
      <div className="sticky bottom-0 -mx-4 border-t border-steel-200 bg-steel-50/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        <Save />
      </div>
    </form>
  );
}

function Provider({
  name,
  tag,
  enabled,
  onToggle,
  toggleName,
  check,
  badge,
  note,
  children,
}: {
  name: string;
  tag: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  toggleName: string;
  check?: Check;
  badge?: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-xl border bg-white p-5 transition-colors sm:p-6 ${enabled ? 'border-ink/30' : 'border-steel-200'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">{name}</h2>
            {badge && (
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge === 'Live' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-ink-mute">{tag}</p>
        </div>
        <Switch name={toggleName} checked={enabled} onChange={onToggle} />
      </div>
      {check && (
        <p className={`mt-3 flex items-center gap-2 text-sm font-medium ${check.ok ? 'text-ok' : 'text-red-700'}`}>
          <span className={`h-2 w-2 rounded-full ${check.ok ? 'bg-ok' : 'bg-red-600'}`} />
          {check.text}
        </p>
      )}
      {note && !enabled && <p className="mt-3 text-sm text-ink-soft">{note}</p>}
      {/* Fälten ligger kvar i formuläret även när leverantören är av, så att nycklarna inte tappas. */}
      <div className={enabled ? 'mt-5' : 'hidden'}>{children}</div>
    </section>
  );
}

function Switch({
  name,
  checked,
  defaultChecked,
  onChange,
}: {
  name: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="relative inline-flex shrink-0 cursor-pointer items-center" htmlFor={name}>
      <input
        id={name}
        name={name}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="h-7 w-12 rounded-full bg-steel-300 transition-colors peer-checked:bg-ok peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40" />
      <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      <span className="sr-only">Aktivera</span>
    </label>
  );
}

function Field({
  id,
  label,
  hint,
  defaultValue,
  placeholder,
  secret,
}: {
  id: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  placeholder?: string;
  secret?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id}
        name={id}
        defaultValue={defaultValue}
        placeholder={secret && defaultValue ? 'Lämna orörd för att behålla' : placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`input ${secret ? 'font-mono text-xs' : ''}`}
        onFocus={secret ? (e) => e.currentTarget.value.startsWith('••') && e.currentTarget.select() : undefined}
      />
      {hint && <p className="mt-1 text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}

function Env({ id, defaultValue, options }: { id: string; defaultValue: string; options: [string, string][] }) {
  return (
    <div>
      <label htmlFor={id} className="label">Miljö</label>
      <select id={id} name={id} defaultValue={defaultValue} className="input">
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  );
}

function Check({ id, label, hint, defaultChecked }: { id: string; label: string; hint: string; defaultChecked: boolean }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer gap-3 rounded-lg border border-steel-200 p-3 has-[:checked]:border-ink/40 has-[:checked]:bg-steel-50">
      <input id={id} name={id} type="checkbox" defaultChecked={defaultChecked} className="mt-0.5 accent-ink" />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-ink-mute">{hint}</span>
      </span>
    </label>
  );
}

function Clear({ id, label }: { id: string; label: string }) {
  return (
    <label htmlFor={id} className="mt-4 flex items-center gap-2 text-xs text-ink-mute">
      <input id={id} name={id} type="checkbox" className="accent-red-600" />
      {label}
    </label>
  );
}
