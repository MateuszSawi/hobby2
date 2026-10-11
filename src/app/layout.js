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

// Adres produkcyjny potrzebny do absolutnych linków w podglądzie (OG).
// Na Vercelu wykrywany automatycznie; w innym hostingu ustaw NEXT_PUBLIC_SITE_URL.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: '????',
  description: '????',
  openGraph: {
    title: '????',
    description: '????',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '????',
    description: '????',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${serif.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
