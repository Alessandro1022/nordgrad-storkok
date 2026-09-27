'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Consent = { necessary: true; analytics: boolean; marketing: boolean; ts: string };
const COOKIE = 'cookie_consent';

function readConsent(): Consent | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[1]));
  } catch {
    return null;
  }
}

function writeConsent(c: Omit<Consent, 'necessary' | 'ts'>) {
  const value: Consent = { necessary: true, ...c, ts: new Date().toISOString() };
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: value }));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = readConsent();
    if (!c) setVisible(true);
    else {
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
    }
    const open = () => {
      const cur = readConsent();
      setAnalytics(cur?.analytics ?? false);
      setMarketing(cur?.marketing ?? false);
      setCustom(true);
      setVisible(true);
    };
    window.addEventListener('open-cookie-settings', open);
    return () => window.removeEventListener('open-cookie-settings', open);
  }, []);

  if (!visible) return null;

  const done = (a: boolean, m: boolean) => {
    writeConsent({ analytics: a, marketing: m });
    setVisible(false);
    setCustom(false);
  };

  return (
    <div className="fixed bottom-0 left-0 z-[60] w-full p-3 sm:max-w-[460px] sm:p-5" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-[0_24px_60px_-20px_rgba(21,24,22,0.5)] sm:p-6" role="dialog" aria-label="Cookies">
        <h2 className="text-[18px] font-bold tracking-tight">Cookies</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Nödvändiga cookies håller igång varukorgen och inloggningen. Med ditt samtycke använder vi även cookies för statistik och
          marknadsföring. Läs mer i vår <Link href="/integritet" className="underline">integritetspolicy</Link>.
        </p>

        {custom && (
          <div className="mt-4 divide-y divide-steel-200 rounded-lg border border-steel-200">
            <Row title="Nödvändiga" text="Krävs för varukorg, kassa och säkerhet. Kan inte stängas av." checked disabled />
            <Row title="Statistik" text="Hjälper oss förstå hur sidan används, t.ex. populära produkter." checked={analytics} onChange={setAnalytics} id="c-analytics" />
            <Row title="Marknadsföring" text="Används för att visa relevanta annonser på andra sajter." checked={marketing} onChange={setMarketing} id="c-marketing" />
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2 [&_.btn]:px-4 [&_.btn]:py-2.5 [&_.btn]:text-[14px]">
          {custom ? (
            <button className="btn-primary" onClick={() => done(analytics, marketing)}>
              Spara val
            </button>
          ) : (
            <button className="btn-primary" onClick={() => done(true, true)}>
              Godkänn alla
            </button>
          )}
          <button className="btn-ghost" onClick={() => done(false, false)}>
            Endast nödvändiga
          </button>
          {!custom && (
            <button className="btn px-3 text-ink-soft underline hover:text-ink" onClick={() => setCustom(true)}>
              Anpassa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  title,
  text,
  checked,
  disabled,
  onChange,
  id,
}: {
  title: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  id?: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 p-3.5" htmlFor={id}>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-ink-mute">{text}</span>
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="h-6 w-11 rounded-full bg-steel-300 transition peer-checked:bg-accent peer-disabled:opacity-60 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
