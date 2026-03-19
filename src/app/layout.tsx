import type { Metadata } from 'next';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Aventură și Călătorii — Excursii cu Autocarul din Brașov',
  description:
    'Companie de turism din Brașov specializată în excursii cu autocarul pentru elevi, seniori și grupuri. România e fascinantă — să o descoperim împreună!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
