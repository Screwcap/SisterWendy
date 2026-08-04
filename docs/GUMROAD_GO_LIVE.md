# Wendy's Blessing — the go-live checklist

Everything on the code side is built, merged and live. Premium is **default-OFF**:
`focusedLocked()` requires both `ADS.gumroadUrl` and `ADS.gumroadPermalink`, so
until they are filled in, Focused mode is free and no buy button appears. That
is deliberate — the gate can never lock a player out with no way to buy.

The only thing left needs a human with the Gumroad password.

## What Andrew does (once)

On **screwcap.gumroad.com** — the same account as Sutda, so the portfolio stays
under one payout:

1. New product → **Wendy's Blessing** → price **$2.99** (matched to Sutda 2.0; if
   you'd rather it were $1.99, change `ADS.price` in `lib/ads.ts` and nothing else).
2. Suggested permalink: **`sisterwendyv2`** → URL becomes
   `https://screwcap.gumroad.com/l/sisterwendyv2`.
3. **Turn ON "generate a unique license key per sale."** Non-negotiable —
   restore-purchase verifies against `api.gumroad.com/v2/licenses/verify`, and
   with license keys off there is nothing to verify. This is the same setting
   that is still open on Sutda.
4. Send me the URL + permalink.

## What I do with them (two lines, one deploy)

In `lib/ads.ts`:

```ts
gumroadUrl:       'https://screwcap.gumroad.com/l/sisterwendyv2',
gumroadPermalink: 'sisterwendyv2',
```

That alone switches on the Hard-mode gate, the PREMIUM badge, the modal and
restore-purchase. Then `vercel --prod --yes`.

## Worth knowing

- **Buying on Gumroad does not auto-unlock the game.** The purchase is an
  external overlay; the buyer comes back and pastes their license key into
  "restore purchase". Gumroad's receipt email carries the key. Same flow as Sutda.
- **Entitlement is version-scoped** (`sw-premium-v2`). A future v3 = bump
  `VERSION`, new Gumroad product; v2 owners keep v2 ad-free. Legacy `sw-adfree`
  is honoured forever, so anyone who bought the old Blessing Pack keeps it —
  verified in the browser, not just in principle.
- **Ads are a separate switch.** `ADS.slot` is still empty, so no ad unit
  renders even though the publisher id is set. Filling in the permalink sells
  premium; it does not turn ads on.
- Andrew's standing flag, unresolved: per-major-version re-charging is honest
  but adds friction on an impulse unlock. A single lifetime "Founder's" unlock
  per game, with new money from new games, may be the better trade. The code
  supports both.
