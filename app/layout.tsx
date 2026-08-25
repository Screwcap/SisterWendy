import type { Metadata } from 'next';
import Script from 'next/script';
import { Bebas_Neue, Cormorant_Garamond, DM_Mono } from 'next/font/google';
import { AdSenseLoader } from '@/components/AdSenseLoader';
import { Tracking } from '@/components/Tracking';
import { SITE_URL } from './site';
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
  // There was no metadataBase, so every og:image below was a relative URL and no
  // social crawler could resolve it. See app/site.ts.
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: './' },
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
    // Was /icon-1024.png, which does not exist in public/ and returns 404 live —
    // so this card has been advertising a missing image. icon-512.png is real.
    images: [{ url: '/icon-512.png', width: 512, height: 512 }],
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

        {/* GA4 + Meta Pixel — moved into <Tracking/> so they sit behind a
            Do-Not-Track gate. They were unconditional inline tags here, three
            files from an AdSenseLoader that already declined to fetch the ad
            network for a paying player. See components/Tracking.tsx. */}
        <Tracking ga4="G-V38MHG6C56" pixel="1948331522667884" />

        {/* Google AdSense — loaded client-side ONLY for players who haven't bought
            ad-free, so premium genuinely means no ad network (faster, less hassle). */}
        <AdSenseLoader />

        {/* Portfolio kill-switch / flags (fail-open — a Deck outage can never brick the app). */}
        <Script id="screwcap-flags-title" strategy="afterInteractive">
          {`window.SCREWCAP_TITLE='sister-wendy';`}
        </Script>
        <Script src="/screwcap-flags.js" strategy="afterInteractive" />
        {/* Deck beacon — privacy-safe portfolio telemetry. Wrapped so it can never break the app. */}
        <Script src="/deck-beacon.js" strategy="afterInteractive" />
        <Script id="deck-beacon-init" strategy="afterInteractive">
          {`(function(){try{if(typeof DeckBeacon==='undefined')return;var d=DeckBeacon.init({title:'sister-wendy',collect:'/api/deck-collect'});window.deck=d;var _s=localStorage.setItem.bind(localStorage),_t=0;localStorage.setItem=function(k,v){_s(k,v);try{if(/premium|adfree|unlock/i.test(k)&&v&&v!=='false'&&v!=='0'){d.revenue(1.99,'adfree');}else if(/win|round|game|score|hand|play/i.test(k)){var n=Date.now();if(n-_t>2000){_t=n;d.event('round_played');}}}catch(e){}};}catch(e){}})();`}
        </Script>
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
