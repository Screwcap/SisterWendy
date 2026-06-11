# Sister Wendy — Graphics Refresh v3 ("Fun & Enticing")

**2026-06-09.** Andrew's note: current art/icons feel *dated & flat*. v2's voice was
deliberately restrained ("no garish colour, matte, New Yorker") — which is likely
why it still reads dated. v3 keeps the IP (three nuns, the palette, the wit) but
pushes toward **warm, characterful, collectible-card energy**: luminous, expressive,
inviting — dignified caricature, not goofy.

Asset names/sizes below are the REAL files in the repo (verified).

---

## 0. STYLE SPINE v3 — paste into EVERY prompt

```
warm characterful illustration with a premium animated-poster feel, expressive
face with real comic timing and personality, confident inked linework over
luminous painterly shading, rich inviting colour with genuine gold-leaf accents,
soft cinematic rim-light and a gentle holy glow, tactile hand-made texture,
dignified-not-goofy caricature, vintage prayer-card charm updated for a modern
premium card game, clean composition, generous negative space, no flat clip-art,
no garish neon, no glossy 3D mobile-game look --style raw --v 7
```

**Palette anchors (give MJ the hexes):** ecclesiastical green `#1A5C3A`, ivory
`#F4EFE2`, gold leaf `#C9A84C`, oxblood `#6E1A22`, ink `#1C1A17`.
**Per-character accent:** Wendy = gold `#C9A84C` · Patricia = deep purple `#6B2FA0`
· Hildegard = forest green `#1A5C3A`.
**Workflow:** generate at 1024², upscale, knock portraits out to transparent PNG
(they sit on a coloured card in-game), then export the exact filename/size below.

---

## 1. CHARACTER PORTRAITS — 512×512 webp/png (generate 1024² `--ar 1:1`)

The cast. **Big gap:** Patricia & Hildegard have only `-neutral` today; they need the
full mood set to make the new opponent feature sing.

**Base look per character** (combine with a MOOD line + the Spine):

- **Sister Wendy** — `wendy-<mood>.webp` — *70s, sharp, mischievous, dignified.
  Small round gold-rimmed glasses, black habit, white wimple, a crooked little
  halo as the anachronistic wink. Gold `#C9A84C` accent.*
- **Sister Patricia** — `patricia-<mood>.webp` — *40s, sharp cheekbones, ONE eyebrow
  permanently raised, Whoopi-Goldberg-in-a-habit energy, quick and unbothered.
  Deep purple `#6B2FA0` accent in the wimple shadow / halo.*
- **Abbess Hildegard** — `hildegard-<mood>.webp` — *70s, stern, heavy brows,
  deep-set eyes radiating mild disappointment, ornate abbess cross. Forest green
  `#1A5C3A` accent.*

**Mood modifier** (swap into each — these are the 7 states the game uses):

| Mood file suffix | Expression line to insert |
|---|---|
| `neutral`     | calm, appraising, faintly amused — resting "go on then" face |
| `pleased`     | a small satisfied smile, eyes warm, quietly delighted |
| `thinking`    | one eyebrow up, finger to chin, plotting her next tile |
| `triumphant`  | radiant victorious grin, gold glow blooming, arms-crossed pride |
| `disappointed`| heavy-lidded "I expected better" look, slow head tilt |
| `suspicious`  | narrowed eyes, sidelong glance, "what are you up to" smirk |
| `amused`      | caught mid-laugh, genuinely tickled, eyes crinkled |

> So: 7 Wendy + 7 Patricia + 7 Hildegard = 21 portraits for the full set
> (minimum viable: the 6 missing Patricia + 6 missing Hildegard moods).

**Example full prompt (Patricia, suspicious):**
```
editorial character portrait of a sharp-cheekboned nun in her 40s, one eyebrow
permanently raised, narrowed eyes and a sidelong "what are you up to" smirk,
black habit and white wimple with a deep purple #6B2FA0 shadow, [STYLE SPINE v3],
transparent background --ar 1:1
```

---

## 2. APP ICON + FAVICONS (one master → all sizes)

| Asset | File | Size | Prompt subject |
|---|---|---|---|
| App icon master | `public/icon-512.png` *(see bug)* | 1024×1024 | A single bold domino tile standing upright, a tiny gold halo hovering over it, deep ecclesiastical-green field, gold-leaf rim — instantly readable at small size. |
| App icon 192 / 32 / 16 | `public/icon-192.png` etc. | resp. | downscale of master |
| Apple touch | `public/apple-touch-icon.png` | 180×180 | downscale of master |
| Favicon | `public/favicon-32.png`, `favicon.ico` | 32×32 / 16×16 | downscale; at 16px keep ONLY the haloed domino silhouette |

> ⚠️ **Bug:** `icon-512.png` is currently 512px master but `icon-1024.png` referenced
> in v2 doesn't exist — current master is `icon-512.png` (438KB, 512²). Generate a true
> 1024² master and re-export the ladder cleanly.

**Master prompt:**
```
app icon: a single upright domino tile (showing a five-and-blank), a small crooked
gold-leaf halo floating just above it, centred on a deep ecclesiastical-green
#1A5C3A field with a subtle gold rim, iconic and bold, readable at 16px,
[STYLE SPINE v3] --ar 1:1
```

---

## 3. UI GLYPH ICONS — replace emoji with a cohesive set

Two things to unify: the in-game `ui-icons.png` sprite (1254², currently dated) AND
the character-select badges that are bare emoji (👁 ⚡ 🕯️).

| Glyph | Where | Replace | Prompt subject (tiny, 1-colour-ish, gold-on-dark) |
|---|---|---|---|
| Menu ☰   | game header | sprite | three stacked domino tiles as a hamburger menu |
| Sound 🔊/🔇 | header | sprite | a little hand-bell (convent bell), with/without sound waves |
| Play ▶   | menu | sprite | a domino tile with a forward-triangle notch |
| Undo ↩   | forgiving mode | sprite | a rosary loop arrow curving back |
| Hint ✦   | forgiving | sprite | a small candle flame / guiding light |
| Star ★   | grade/score | sprite | a gold-leaf liturgical star |
| Wendy badge 👁 | opponent select | emoji | tiny gold all-seeing-eye-of-providence triangle |
| Patricia badge ⚡ | opponent select | emoji | tiny purple lightning bolt in a halo |
| Hildegard badge 🕯️ | opponent select | emoji | tiny forest-green candle with a single flame |

**Icon-set prompt (run as one sheet, then slice):**
```
a set of minimalist line icons for a nun-themed domino game — hamburger menu of
stacked dominoes, convent hand-bell, play triangle, curved undo arrow, candle-flame
hint, liturgical star — gold-leaf #C9A84C strokes on deep green, uniform 2px weight,
flat vector, no fills, monoline, clean grid --ar 1:1 --style raw --v 7
```

---

## 4. MARKETING / SOCIAL

| Asset | File | Size | Prompt subject |
|---|---|---|---|
| Social / OG card | `public/social-card.jpg` + `assets/images/social-card.png` | 1200×630 | All three nuns at a green-felt domino table mid-game, candlelight, title "SISTER WENDY" in gold; one nun side-eyeing another. |
| Store cover | `assets/images/cover.png` | 1024×1024 | Hero shot of Wendy dealing tiles, crooked halo, "Mild Spiritual Threat" tagline space. |
| Avatar / profile | `assets/images/avatar.png` | 960×960 | Wendy bust, neutral-amused, the brand face. |
| Newgrounds thumb | `assets/images/newgrounds-icon.png` | 300×300 | tight crop of the haloed-domino app icon. |

**Social card prompt:**
```
wide editorial poster: three characterful nuns around a green-felt domino table by
candlelight — a sharp 40s nun (purple accent) side-eyeing a stern 70s abbess (green
accent) while a mischievous bespectacled nun (gold accent) lays a tile with a crooked
halo above; warm cinematic glow, gold-leaf title space top, [STYLE SPINE v3]
--ar 1200:630
```

---

## 5. ATMOSPHERE (high impact, low effort)

| Asset | File | Size | Prompt subject |
|---|---|---|---|
| Board felt | `public/felt-texture.webp` | 768×768 seamless | rich ecclesiastical-green felt, subtle gold-thread cross-hatch, faint vignette. `--tile` |
| Win halo | `public/win-halo.webp` | 768×768 transparent | radiant gold-leaf sunburst halo, holy light rays, celebratory, transparent bg. |

**Felt prompt:**
```
seamless tileable texture of deep ecclesiastical-green billiard felt with a faint
gold-thread liturgical cross-hatch and gentle worn patina, matte, subtle,
[STYLE SPINE v3] --ar 1:1 --tile
```

---

## Priority for max "fresh" impact
1. **The 3 hero portraits** (Wendy/Patricia/Hildegard neutral) — the face of the game.
2. **App icon master** (haloed domino) — first impression everywhere.
3. **Patricia + Hildegard mood sets** (6 each) — makes the new opponent feature pop.
4. **UI icon sheet + select badges** — kills the "dated" emoji/clip-art feel.
5. Social card + felt + halo — polish.

When you've generated, drop PNGs in `public/` (portraits as `<char>-<mood>.webp` or
.png) and `assets/images/`; I'll wire filenames, re-export the icon ladder, and add
the missing Patricia/Hildegard moods to `WendyPortrait.tsx`'s MOOD_PORTRAIT map.

---

# EXPLICIT FILE LIST — every asset, one row each (2026-06-09)

Canonical mood set = 6: `neutral, pleased, disappointed, suspicious, triumphant,
amused`. All portraits 512×512 (generate 1024², transparent PNG, knock out green field).
Append **Style Spine v3** (§0) to every prompt.

## A. PORTRAITS (18 canonical + 1 orphan)

### Wendy — gold #C9A84C — "70s, sharp, mischievous, round gold glasses, crooked halo"
| File | Size | Prompt subject |
|---|---|---|
| `public/wendy-neutral.webp`      | 512² | calm appraising "go on then" face, faint smirk |
| `public/wendy-pleased.webp`      | 512² | small satisfied smile, warm eyes |
| `public/wendy-disappointed.webp` | 512² | heavy-lidded "I expected better", slow head tilt |
| `public/wendy-suspicious.webp`   | 512² | narrowed eyes, sidelong glance |
| `public/wendy-triumphant.webp`   | 512² | radiant victorious grin, gold glow blooming |
| `public/wendy-amused.webp`       | 512² | caught mid-laugh, eyes crinkled |
| `public/wendy-thinking.webp`     | 512² | ORPHAN (unused by code). Optional: eyebrow up, finger to chin — or delete |

### Patricia — purple #6B2FA0 — "40s, sharp cheekbones, ONE raised eyebrow, Whoopi energy" (5 NEW)
| File | Size | Prompt subject |
|---|---|---|
| `public/patricia-neutral.webp`      | 512² | EXISTS — unbothered, one brow up, "finally" |
| `public/patricia-pleased.webp`      | 512² | NEW — tight approving nod, "I'll allow it" |
| `public/patricia-disappointed.webp` | 512² | NEW — flat stare, "who raised you" |
| `public/patricia-suspicious.webp`   | 512² | NEW — sharp side-eye, lips pursed |
| `public/patricia-triumphant.webp`   | 512² | NEW — smug "called it", arms crossed |
| `public/patricia-amused.webp`       | 512² | NEW — single dry chuckle, eyebrow higher |

### Hildegard — green #1A5C3A — "70s abbess, heavy brows, deep-set disappointed eyes, ornate cross" (5 NEW)
| File | Size | Prompt subject |
|---|---|---|
| `public/hildegard-neutral.webp`      | 512² | EXISTS — serene superiority, faint weariness |
| `public/hildegard-pleased.webp`      | 512² | NEW — the barest approving nod, "adequate" |
| `public/hildegard-disappointed.webp` | 512² | NEW — eyes closed, deep sigh, "reflect on that" |
| `public/hildegard-suspicious.webp`   | 512² | NEW — one heavy brow raised, slow scrutiny |
| `public/hildegard-triumphant.webp`   | 512² | NEW — quietly vindicated, "order restored" |
| `public/hildegard-amused.webp`       | 512² | NEW — almost-smile she's suppressing |

## B. APP ICON + FAVICON LADDER (generate ONE 1024² master, downscale the rest)
Master prompt: *upright domino tile (five-and-blank) with a small crooked gold-leaf halo floating above, centred on deep ecclesiastical-green #1A5C3A field, gold rim, readable at 16px.*
| File | Size | How |
|---|---|---|
| `public/icon-512.png`        | 1024² (master; re-export 512²) | GENERATE master here |
| `public/icon-192.png`        | 192²  | downscale |
| `public/icon-32.png`         | 32²   | downscale |
| `public/icon-16.png`         | 16²   | downscale (silhouette only) |
| `public/apple-touch-icon.png`| 180²  | downscale |
| `public/favicon-32.png`      | 32²   | downscale |
| `public/favicon-16.png`      | 16²   | downscale |
| `public/favicon.ico`         | 16+32 | multi-res .ico from downscales |

## C. UI ICON SPRITE (one sheet → slice in code)
| File | Size | Prompt subject |
|---|---|---|
| `assets/images/ui-icons.png` | 1254² | sheet of gold-monoline-on-green icons: ☰ stacked dominoes · 🔔 convent bell (on) · 🔕 bell w/ slash (off) · ▶ play triangle · ↩ rosary undo arrow · 🕯 candle hint · ★ liturgical star — uniform 2px weight, flat vector grid |

## D. MARKETING / SOCIAL
| File | Size | Prompt subject |
|---|---|---|
| `public/social-card.jpg`            | 1200×630 | 3 nuns at green-felt table, candlelight, side-eye, gold "SISTER WENDY" title |
| `assets/images/social-card.png`     | 1731×909 | same comp, hi-res source |
| `assets/images/cover.png`           | 1024²    | hero: Wendy dealing tiles, crooked halo, tagline space |
| `assets/images/avatar.png`          | 960²     | Wendy bust, neutral-amused (brand face) |
| `assets/images/avatar.jpg`          | 960²     | jpg export of avatar.png |
| `assets/images/newgrounds-icon.png` | 300²     | tight crop of the haloed-domino app icon |

## E. ATMOSPHERE
| File | Size | Prompt subject |
|---|---|---|
| `public/felt-texture.webp` | 768² seamless    | deep green felt + gold-thread cross-hatch, matte, `--tile` |
| `public/win-halo.webp`     | 768² transparent | radiant gold-leaf sunburst halo, holy rays |

## TOTAL TO GENERATE
- **11 new portraits** (5 Patricia + 5 Hildegard + optionally re-do 6 Wendy + thinking)
- **1 app-icon master** → 8-file ladder
- **1 UI icon sheet** (7 glyphs)
- **6 marketing images** + **2 atmosphere** = **~21 source generations** covering **36 files**.
