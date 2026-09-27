'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { site } from '@/lib/site';
import { sendMessage, type ContactState } from './actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary" disabled={pending}>
      {pending ? 'Skickar…' : 'Skicka förfrågan'}
    </button>
  );
}

export default function ContactPage() {
  const [state, action] = useFormState<ContactState, FormData>(sendMessage, { ok: false });

  return (
    <div className="wrap grid gap-12 py-12 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <p className="eyebrow">Kontakt & offert</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Berätta om ditt kök</h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
          Beskriv verksamheten, hur många kuvert ni gör per pass och vad som ska bytas. Vi återkommer med förslag och offert inom en
          arbetsdag.
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="eyebrow">Telefon</dt>
            <dd className="mt-1 select-all text-lg font-semibold">{site.phone}</dd>
          </div>
          <div>
            <dt className="eyebrow">E-post</dt>
            <dd className="mt-1 select-all text-lg font-semibold">{site.email}</dd>
          </div>
          <div>
            <dt className="eyebrow">Besöksadress</dt>
            <dd className="mt-1">{site.address.join(', ')}</dd>
          </div>
          <div>
            <dt className="eyebrow">Öppettider</dt>
            <dd className="mt-1">Mån–fre 08–17</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-steel-200 p-6 sm:p-8">
        {state.ok ? (
          <div className="py-10 text-center">
            <h2 className="font-display text-2xl font-bold">Tack, vi har fått ditt meddelande</h2>
            <p className="mt-2 text-ink-soft">Vi hör av oss inom en arbetsdag.</p>
          </div>
        ) : (
          <form action={action} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label">Namn *</label>
              <input id="name" name="name" required className="input" autoComplete="name" />
            </div>
            <div>
              <label htmlFor="company" className="label">Företag</label>
              <input id="company" name="company" className="input" autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="email" className="label">E-post *</label>
              <input id="email" name="email" type="email" required className="input" autoComplete="email" />
            </div>
            <div>
              <label htmlFor="phone" className="label">Telefon</label>
              <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="label">Vad kan vi hjälpa till med? *</label>
              <textarea id="message" name="message" rows={6} required className="input" placeholder="T.ex. Pizzeria med 60 platser, behöver ny diskmaskin och pizzakylbänk." />
            </div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <label className="flex items-start gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="consent" id="consent" className="mt-1 accent-accent" />
              Jag samtycker till att {site.name} sparar mina uppgifter för att besvara förfrågan.
            </label>
            {state.error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 sm:col-span-2" role="alert">{state.error}</p>}
            <div className="sm:col-span-2">
              <Submit />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
