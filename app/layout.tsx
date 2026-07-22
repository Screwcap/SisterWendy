import type { Metadata } from 'next';
import Script from 'next/script';
import { Bebas_Neue, Cormorant_Garamond, DM_Mono } from 'next/font/google';
import { AdSenseLoader } from '@/components/AdSenseLoader';
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

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V38MHG6C56"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-V38MHG6C56');`}
        </Script>

        {/* Meta (Facebook) Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1948331522667884');fbq('track','PageView');`}
        </Script>

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
