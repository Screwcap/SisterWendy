'use client';

import { useEffect } from 'react';
import { ADS, adsConfigured, isAdFree } from '@/lib/ads';
import { trackingRefused } from '@/lib/dnt';

/**
 * Loads Google AdSense — but ONLY for players who have not bought ad-free.
 *
 * This is the "paying means faster, less hassle" promise made true at the
 * script level, not just by hiding the ad slot. For a premium player the ad
 * network is never fetched at all: one fewer third-party script to download,
 * no ad-network cookies, no background ad auctions. For a free player it loads
 * exactly as before.
 *
 * Entitlement lives in localStorage (client-only), so the decision is made in
 * a client effect rather than at server render — an ad script is afterInteractive
 * anyway, so there is no cost to deferring it one tick.
 */
export function AdSenseLoader() {
  useEffect(() => {
    // Also skipped on Do Not Track. Kitchen Table's js/ads.js has refused to
    // inject the ad network on this signal since it shipped; this file gated on
    // entitlement only, so a DNT visitor still got AdSense and its cookies.
    if (!adsConfigured() || isAdFree() || trackingRefused()) return;
    if (document.getElementById('adsbygoogle-js')) return;
    const s = document.createElement('script');
    s.id = 'adsbygoogle-js';
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS.client}`;
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }, []);

  return null;
}
