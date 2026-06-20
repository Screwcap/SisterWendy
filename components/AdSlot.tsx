'use client';

import { useEffect, useState } from 'react';
import { ADS, adsConfigured, isAdFree } from '@/lib/ads';

/** A single non-intrusive AdSense unit. Renders nothing unless ads are
 *  configured AND the player hasn't gone ad-free. Use on menu / game-over only. */
export default function AdSlot({ label = true }: { label?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!adsConfigured() || isAdFree()) return;
    setShow(true);
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch { /* */ }
  }, []);

  if (!show) return null;
  return (
    <div style={{ margin: '14px auto 0', maxWidth: 468, width: '100%', textAlign: 'center' }}>
      {label && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.18em', color: 'rgba(196,144,32,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>
          Advertisement
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADS.client}
        {...(ADS.slot ? { 'data-ad-slot': ADS.slot } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
