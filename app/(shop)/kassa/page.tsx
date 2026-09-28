import type { Metadata } from 'next';
import CheckoutForm from './CheckoutForm';
import { hasDatabase } from '@/lib/supabase';
import { checkoutOptions, getPaymentSettings } from '@/lib/payments/settings';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Kassa' };

export default async function CheckoutPage({ searchParams }: { searchParams: { avbruten?: string } }) {
  const settings = await getPaymentSettings();
  // Bara namn och beskrivning skickas till webbläsaren, aldrig nycklar.
  const options = checkoutOptions(settings, hasDatabase()).map(({ id, label, description }) => ({ id, label, description }));
  return <CheckoutForm options={options} cancelled={searchParams.avbruten === '1'} />;
}
