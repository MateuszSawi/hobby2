import { Cormorant_Garamond, Lora } from 'next/font/google';
import '@/styles/globals.scss';

const serif = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const body = Lora({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: '????',
  description: 'Małe zaproszenie.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${serif.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
