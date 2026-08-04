/*
 * Sister Wendy — premium / ads config. Non-intrusive by design: ads render
 * only on the menu / game-over (never during play), and the ad network itself
 * is never fetched for a premium player (see components/AdSenseLoader.tsx).
 *
 * THE MODEL (per Andrew's June 30 order):
 *   Free      = Forgiving mode. Ads on the menu / game-over only.
 *   Premium   = one-time purchase. Removes ads AND unlocks Focused (Hard) mode.
 *   Daily Challenge stays free for everyone.
 *   Lifetime, but VERSION-SCOPED: a purchase unlocks the version it was bought
 *   for. Ship a new major version → new Gumroad product, existing owners keep
 *   their old version ad-free. Bump VERSION + the Gumroad fields together.
 *
 * TO ACTIVATE (until then everything is default-OFF — no gate, nothing changes
 * for live players):
 *   ADS.client            → AdSense publisher id (ca-pub-…)   [enables ads]
 *   ADS.slot              → a Display ad-unit slot #
 *   ADS.gumroadUrl        → Gumroad product overlay/checkout link
 *   ADS.gumroadPermalink  → Gumroad product permalink (license verify)
 * Premium gating only switches on once BOTH Gumroad fields are present, so the
 * Hard-mode gate can never trap a player with no way to buy. The Gumroad
 * product MUST have license keys enabled ("generate a unique license key per
 * sale") or restore-purchase has nothing to verify against.
 */

/** Bump on each major release that should be re-sold (v2 → v3 → …). */
export const VERSION = 'v2';

export const ADS = {
  client:           'ca-pub-2067975098656294',  // ← AdSense publisher id
  slot:             '',                         // ← create a Display ad unit → paste its slot # here
  gumroadUrl:       '',                         // ← Gumroad product URL — screwcap.gumroad.com account (e.g. https://screwcap.gumroad.com/l/sisterwendyv2). Empty = buy disabled AND gate stays off.
  gumroadPermalink: '',                         // ← Gumroad permalink (e.g. sisterwendyv2) — for license verify. Same account as the rest of the portfolio.
  price:            '$2.99',                    // ← matches Sutda 2.0. Read everywhere; change here only.
  /** Current-version entitlement key. Version-scoped on purpose (see header). */
  storageKey:       `sw-premium-${VERSION}`,
};

/** Legacy keys honoured so earlier supporters keep their unlock. */
const LEGACY_KEYS = ['sw-adfree'];

export const adsConfigured = (): boolean => !!ADS.client && !/X{4,}/.test(ADS.client);

/** Premium is only sellable — and only gateable — once Gumroad is wired up. */
export const premiumConfigured = (): boolean => !!ADS.gumroadPermalink && !!ADS.gumroadUrl;

/** Has this player unlocked premium (this version, or any legacy unlock)? */
export function isPremium(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(ADS.storageKey) === '1') return true;
    return LEGACY_KEYS.some(k => localStorage.getItem(k) === '1');
  } catch { return false; }
}
/** Ad-free is part of premium. Kept as an alias for existing call-sites. */
export const isAdFree = isPremium;

export function setPremium(license?: string): void {
  try {
    localStorage.setItem(ADS.storageKey, '1');
    if (license) localStorage.setItem(`${ADS.storageKey}-key`, license);
  } catch { /* */ }
}
export const setAdFree = setPremium;

/** Whether Focused (Hard) mode should be gated for this player. */
export function focusedLocked(): boolean {
  return premiumConfigured() && !isPremium();
}

export function goPremium(): void {
  if (typeof window !== 'undefined' && ADS.gumroadUrl) window.open(ADS.gumroadUrl, '_blank', 'noopener');
}
export const goAdFree = goPremium;

/** Verify a Gumroad license key (public endpoint, client-side) → unlock premium. */
export async function redeem(code: string): Promise<boolean> {
  code = (code || '').trim();
  if (!code || !ADS.gumroadPermalink) return false;
  try {
    const r = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ product_permalink: ADS.gumroadPermalink, license_key: code, increment_uses_count: 'false' }),
    });
    const j = await r.json();
    if (j && j.success) { setPremium(code); return true; }
  } catch { /* */ }
  return false;
}
