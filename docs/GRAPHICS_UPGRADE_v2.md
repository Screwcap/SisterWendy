# Sister Wendy's Dominoes — Graphics Upgrade Spec (v2)

**Compiled by Carl (design) · 2026-06-06**
For MidJourney v7. Supersedes the 2026-03 `SISTER_WENDY_GRAPHICS_PROMPTS.md`.

The current art reads as generic casual-game clip-art. This spec re-skins the whole
game around one cohesive, grown-up visual voice: **dry, irreverent, and quietly
elegant** — *a New Yorker cover that wandered into a slightly blasphemous prayer
card.* Humor lives in the **expression and the tiny anachronistic detail**, never in
goofy proportions or loud colour.

---

## 0. The STYLE SPINE — paste into *every* prompt

Append this verbatim so all 20+ assets feel like one hand drew them:

```
elegant hand-inked editorial illustration, fine confident linework over soft
watercolour wash, restrained sophisticated palette — deep ecclesiastical green,
warm ivory, oxblood red, with genuine gold-leaf accents; warm chiaroscuro lighting,
dry wit and sly irreverence in the eyes, one subtle anachronistic detail, refined
vintage-prayer-card-meets-New-Yorker-cover aesthetic, generous negative space,
matte finish, absolutely no garish colours, no glossy mobile-game 3D, no clutter
--style raw --v 7
```

**House palette (give MidJourney these hex anchors):** ecclesiastical green
`#1A5C3A`, ivory `#F4EFE2`, gold leaf `#C9A84C`, oxblood `#6E1A22`, ink `#1C1A17`.

**Workflow:** generate each at the largest size, upscale, then export the exact
filenames/sizes below. Portraits look best knocked out to **transparent PNG** (they
sit on a coloured card in-game) — generate on a flat green field and remove it.

---

## 1. THE TABLE — every icon & image in the game

| # | Asset | File (path) | Export size | MJ aspect |
|---|-------|-------------|-------------|-----------|
| **In-game character portraits** ||||
| 1 | Wendy — Neutral | `public/wendy-neutral.png` | 512×512 (gen 1024²) | `--ar 1:1` |
| 2 | Wendy — Pleased | `public/wendy-pleased.png` | 512×512 | `--ar 1:1` |
| 3 | Wendy — Thinking | `public/wendy-thinking.png` | 512×512 | `--ar 1:1` |
| 4 | Wendy — Triumphant | `public/wendy-triumphant.png` | 512×512 | `--ar 1:1` |
| 5 | Wendy — Disappointed *(NEW)* | `public/wendy-disappointed.png` | 512×512 | `--ar 1:1` |
| 6 | Wendy — Suspicious *(NEW)* | `public/wendy-suspicious.png` | 512×512 | `--ar 1:1` |
| 7 | Sister Patricia *(NEW, opt.)* | `public/patricia-neutral.png` | 512×512 | `--ar 1:1` |
| 8 | Abbess Hildegard *(NEW, opt.)* | `public/hildegard-neutral.png` | 512×512 | `--ar 1:1` |
| **App / favicon icon set** (one master → all sizes) ||||
| 9 | App icon master | `public/icon-1024.png` *(see fix)* | 1024×1024 | `--ar 1:1` |
| 10 | Apple touch icon | `public/apple-touch-icon.png` | 180×180 | downscale of #9 |
| — | icon-512 / 192 / 32 / 16, favicon | `public/icon-*.png`, `favicon*` | resp. | downscale of #9 |
| **Store / social / marketing** ||||
| 11 | Social / OG share card | `assets/images/social-card.jpeg` *(+ make 1200×630)* | 1200×630 | `--ar 1200:630` |
| 12 | Store cover | `assets/images/cover.jpeg` | 1024×1024 (+630×500 itch) | `--ar 1:1` |
| 13 | Avatar / profile | `assets/images/avatar.jpg` | 960×960 | `--ar 1:1` |
| 14 | Newgrounds thumb | `assets/images/newgrounds-icon.jpeg` | 300×300 | `--ar 1:1` |
| 15 | Win / Lose / Think art | `assets/images/{winning,losing,thinking}.jpeg` | 1024×1024 | use portraits #4/#5/#3 |
| **UI glyph icons** (currently emoji — replace) ||||
| 16 | UI icon sheet (menu/sound/play/undo/star) | `public/ui-icons.svg` (sprite) | vector | `--ar 1:1` ref only |
| **Bonus — high-impact atmosphere** ||||
| 17 | Board felt texture | `public/felt-texture.png` (tile) | 1024×1024 seamless | `--ar 1:1 --tile` |
| 18 | Win celebration halo burst | `public/win-halo.png` | 1024×1024 transparent | `--ar 1:1` |

> **⚠️ Bug to fix while you're in there:** the current `icon-1024.png` is actually
> 512×512 and `icon-512.png` is actually 1024×1024 — the two are **swapped**. Re-export
> at correct sizes when you drop the new master in.

---

## 2. DETAILED PROMPTS (copy-paste, then add the §0 style spine)

### Wendy portraits — the cast anchor
Sister Wendy is **70s, sharp, mischievous, dignified** — small round glasses, black
habit, white wimple, a halo that hangs *very slightly crooked* (the whole joke in one
detail). Keep her face identical across moods; only the expression changes.

**1 · Neutral** `wendy-neutral.png`
```
head-and-shoulders portrait of Sister Wendy, an elderly nun in her seventies, black
habit and white wimple, small round spectacles, faintly crooked gold-leaf halo, calm
appraising half-smile as if she has already read your hand, flat deep-green field
```

**2 · Pleased / Amused** `wendy-pleased.png`
```
the same elderly nun Sister Wendy, eyes bright with private amusement, one corner of
the mouth lifted, the smallest knowing tilt of the head, halo a touch brighter,
genuinely delighted by her own cleverness, flat deep-green field
```

**3 · Thinking** `wendy-thinking.png`
```
the same elderly nun Sister Wendy, chin resting on one folded hand, eyes drifting
upward in scheming contemplation, faint plotting smile, a single domino tile held
loosely at the edge of frame, flat deep-green field
```

**4 · Triumphant** `wendy-triumphant.png`
```
the same elderly nun Sister Wendy, serene and insufferably victorious, eyes twinkling,
halo glowing warm gold, one eyebrow arched in 'I did tell you', the faintest smug
tilt — elegant, never goofy, flat deep-green field
```

**5 · Disappointed (NEW)** `wendy-disappointed.png`
```
the same elderly nun Sister Wendy, lips pursed, eyes lowered over the rim of her
spectacles in weary maternal disappointment, halo dimmed slightly, dignified 'I am
not angry, merely let down' energy, flat deep-green field
```

**6 · Suspicious (NEW)** `wendy-suspicious.png`
```
the same elderly nun Sister Wendy, eyes narrowed in shrewd suspicion, one heavy brow
raised, head turned a few degrees as if catching you mid-bluff, sliver of oxblood in
the shadows, flat deep-green field
```

### Optional — the rival nuns (Merciless mode)
Keep the *exact* style; change age, face, and resting attitude.

**7 · Sister Patricia — "The Snap Queen"** `patricia-neutral.png`
```
head-and-shoulders portrait of Sister Patricia, a nun in her forties, sharp
cheekbones, one eyebrow permanently and impossibly raised, black habit with a deep
violet under-trim, unimpressed razor half-smirk, arms-crossed energy even in
close-up, flat deep-green field
```

**8 · Abbess Hildegard — "The Deadpan Superior"** `hildegard-neutral.png`
```
head-and-shoulders portrait of Abbess Hildegard, a stern nun in her seventies, heavy
brows, deep-set eyes radiating mild permanent disappointment, forest-green stole,
small pectoral cross, the face of someone who left the enclosure for THIS, flat
deep-green field
```

### 9 · App / favicon icon master `icon-1024.png`
```
app icon, tight crop on Sister Wendy's face, elderly nun, devious wink, small round
glasses, black-and-white habit, a single ivory domino tile (double-five) tucked
beside her cheek, crooked gold-leaf halo, rich ecclesiastical-green background, bold
clean shapes that stay readable at 16px, centred, no text
```

### 11 · Social / OG share card `social-card.jpeg` (1200×630)
```
wide banner illustration, Sister Wendy seated at a green-felt card table laying down
an ivory domino with one decisive finger, sly grin, crooked gold halo, warm overhead
poker-room light, tiles scattered with elegant intent, deep green and gold, generous
empty space upper-left for title text, dry and witty, premium not cartoonish
```

### 12 · Store cover `cover.jpeg`
```
cover illustration for 'Sister Wendy's Dominoes', a confident elderly nun in full
black habit at a green-felt table, arms resting, one finger tapping a double-five
tile, crooked gold-leaf halo, warm chiaroscuro, deep green and gold palette, witty
and refined casual-game cover with real craft, space reserved at top for the title
```

### 13 · Avatar `avatar.jpg`
```
circular-friendly bust portrait of Sister Wendy, three-quarter view, warm knowing
smile, small round glasses, crooked gold halo, deep-green vignette, clean and elegant,
reads well as a small round avatar
```

### 14 · Newgrounds thumbnail `newgrounds-icon.jpeg`
```
compact square, Sister Wendy face from the shoulders up, mischievous expression, one
domino tile at her shoulder, crooked gold halo, deep-green background, very bold
shapes for tiny thumbnail legibility, no text
```

### 16 · UI glyph icon sheet `ui-icons.svg`
> MidJourney is a *reference generator* here, not the final art — have it produce a
> cohesive look, then redraw as crisp SVG (UI icons must be vector).
```
a neat sticker sheet of five matching line icons on ivory: a hamburger menu, a
speaker (and a muted speaker), a play triangle, a curved undo arrow, a five-pointed
star — fine gold monoline on dark green, consistent stroke weight, elegant, minimal,
flat, evenly spaced grid --ar 1:1
```

### 17 · Board felt texture `felt-texture.png`
```
seamless tileable deep-green casino billiard felt, subtle woven fibre grain, faint
warm vignette, very low contrast so tiles read on top, refined and understated
--tile --ar 1:1
```

### 18 · Win celebration halo burst `win-halo.png`
```
a radiant gold-leaf halo bursting with fine elegant light rays on transparent
background, vintage prayer-card sunburst, restrained and tasteful, no text, centred
--ar 1:1
```

---

## 3. Drop-in checklist after MidJourney

1. Export each at the **exact filename + size** in the table (transparent PNG for
   portraits 1–8, 18).
2. Re-export the icon set from the new master; **fix the swapped 512/1024 names.**
3. Add `wendy-disappointed.png` + `wendy-suspicious.png` and update
   `components/game/WendyPortrait.tsx` `MOOD_PORTRAIT` so `disappointed` and
   `suspicious` point to their **own** files (they currently reuse `wendy-thinking`).
4. If you commission Patricia/Hildegard, wire them in the same map keyed by
   `personalityId` and you can retire the CSS-colour-only differentiation.
5. `vercel --prod --yes` from the repo root.
```
