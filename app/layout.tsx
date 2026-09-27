import type { Metadata } from 'next';
import { Azeret_Mono, Familjen_Grotesk } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';

const sans = Familjen_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Azeret_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: { default: `${site.name} – ${site.tagline}`, template: `%s | ${site.name}` },
  description:
    'Diskmaskiner, varmkök, kyl & frys och beredningsmaskiner för restaurang och storkök. Delbetalning, prisgaranti och installation i hela Sverige.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
