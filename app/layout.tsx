import type { Metadata } from 'next';
import Script from 'next/script';
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
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png',   sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  openGraph: {
    title: 'Sister Wendy Dominoes',
    description: 'All-Fives dominoes with Sister Wendy Beckett. Art history, mild spiritual threat.',
    type: 'website',
    images: [{ url: '/icon-1024.png', width: 1024, height: 1024 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${garamond.variable} ${mono.variable}`}>
      <head>
        {/* Privacy-friendly analytics by Plausible (portfolio property: screwcap.games) */}
        <Script
          defer
          src="https://plausible.io/js/pa-d6bTHaTtSN8d3dQaPmfFZ.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
