import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: { index: false, follow: true }
};

export default function PizzaRedirectPage() {
  redirect('/pizza/index.html');
}
