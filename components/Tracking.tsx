'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { trackingRefused } from '@/lib/dnt';

/**
 * GA4 and the Meta Pixel, behind a Do-Not-Track gate.
 *
 * Both used to sit as unconditional inline <Script> tags in app/layout.tsx and
 * fired for everybody — on a property that also loads AdSense, and three files
 * away from `AdSenseLoader`, which already refused to fetch the ad network for
 * a paying player. Gating one and not the other made the promise decorative.
 *
 * Plausible stays in the layout, ungated and unconditional: cookieless, no
 * device storage, no personal data, nothing to consent to.
 *
 * ⚠️ DNT IS NOT CONSENT. A silent browser has not agreed. This is the technical
 * half of the job; the missing half is an opt-in banner for the UK and EU,
 * where legitimate interest does not stretch to an advertising pixel. Known and
 * deferred, not ticked. /privacy names both tags with their ids.
 */
export function Tracking({ ga4, pixel }: { ga4: string; pixel: string }) {
  /* null = not decided yet. Neither tag renders until the browser has been
   * asked, because a script that renders and is then removed is a request
   * already made. */
  const [refused, setRefused] = useState<boolean | null>(null);
  useEffect(() => { setRefused(trackingRefused()); }, []);

  if (refused !== false) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());`
          /* The three flags the old inline snippet never set. This game is
             played by teenagers and should not feed an interest-based profile. */
          + `gtag('config','${ga4}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
      </Script>
    </>
  );
}
