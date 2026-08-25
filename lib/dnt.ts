/**
 * Do Not Track / Global Privacy Control.
 *
 * One check, used by both the tracking tags and the AdSense loader, so the two
 * cannot drift apart — which is exactly what happened before 2026-08-25: the ad
 * network was gated on entitlement, the advertising pixel on nothing.
 *
 * Returns false during SSR. The server cannot make this decision, and pretending
 * otherwise would render tags for a browser that had already declined.
 */
export function trackingRefused(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const n = navigator as Navigator & { msDoNotTrack?: string; globalPrivacyControl?: boolean };
    return (
      n.doNotTrack === '1' ||
      n.doNotTrack === 'yes' ||
      (window as Window & { doNotTrack?: string }).doNotTrack === '1' ||
      n.msDoNotTrack === '1' ||
      n.globalPrivacyControl === true
    );
  } catch {
    return false;
  }
}
