import type { Metadata } from 'next';
import { Bebas_Neue, Cormorant_Garamond, DM_Mono } from 'next/font/google';
import './globals.css';

const bebas = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas',
  subsets: ['latin'],
  display: 'swap',
});

const garamond = Cormorant_Garamond({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  subsets: ['latin'],
  display: 'swap',
});

const mono = DM_Mono({
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sister Wendy Dominoes',
  description: 'All-Fives dominoes with Sister Wendy Beckett. Art history, mild spiritual threat.',
  openGraph: {
    title: 'Sister Wendy Dominoes',
    description: 'All-Fives dominoes with Sister Wendy Beckett. Art history, mild spiritual threat.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${garamond.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
