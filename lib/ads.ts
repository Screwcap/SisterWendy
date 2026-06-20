/*
 * Sister Wendy — ads + "ad-free" config. Non-intrusive by design: ads render
 * only on the menu / game-over (never during play), and only once configured.
 *
 * TO ACTIVATE: set `client` to your AdSense publisher id and (for ad-free) the
 * Gumroad fields. Until `client` is a real ca-pub-…, nothing renders.
 * Ad-free is a one-time Gumroad purchase ("Wendy's Blessing Pack") verified via
 * Gumroad's public license API. Strategy (per docs/MONETISATION_RESEARCH.md):
 * free game first, then offer to remove ads once the player has bonded with Wendy.
 */
export const ADS = {
  client:           'ca-pub-2067975098656294',  // ← AdSense publisher id
  slot:             '',                         // ← create a Display ad unit → paste its slot # here
  gumroadUrl:       '',                         // ← Gumroad product URL ("Wendy's Blessing Pack")
  gumroadPermalink: '',                         // ← Gumroad permalink (for license verify)
  price:            '$2.99',
  storageKey:       'sw-adfree',
};

export const adsConfigured = (): boolean => !!ADS.client && !/X{4,}/.test(ADS.client);

export function isAdFree(): boolean {
  if (typeof window === 'undefined') return false;
  try { return localStorage.getItem(ADS.storageKey) === '1'; } catch { return false; }
}
export function setAdFree(): void {
  try { localStorage.setItem(ADS.storageKey, '1'); } catch { /* */ }
}
export function goAdFree(): void {
  if (typeof window !== 'undefined' && ADS.gumroadUrl) window.open(ADS.gumroadUrl, '_blank', 'noopener');
}
/** Verify a Gumroad license key (public endpoint, client-side) → unlock ad-free. */
export async function redeem(code: string): Promise<boolean> {
  code = (code || '').trim();
  if (!code || !ADS.gumroadPermalink) return false;
  try {
    const r = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ product_permalink: ADS.gumroadPermalink, license_key: code }),
    });
    const j = await r.json();
    if (j && j.success) { setAdFree(); return true; }
  } catch { /* */ }
  return false;
}
