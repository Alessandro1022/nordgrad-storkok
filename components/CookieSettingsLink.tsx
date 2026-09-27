'use client';

export default function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
      className="text-left hover:text-white"
    >
      Cookie-inställningar
    </button>
  );
}
