# Sister Wendy — Sound Production Spec (ElevenLabs)

Two separate things ElevenLabs can make:
- **A) Game SFX** → ElevenLabs **"Sound Effects"** (text-to-SFX). Short clips. This is spec #4.
- **B) Voiced dialogue** → ElevenLabs **TTS** (Wendy actually *speaks* her quips). Optional, bigger lift.

Drop produced files into `sister-wendy/public/` with the EXACT filenames below.
Then tell Carl "sounds dropped" and the audio module gets wired (and added to vercel.json).
Keep clips SHORT (0.4–1.5s for SFX); export MP3.

---

## A) GAME SOUND EFFECTS — `public/*.mp3`  (ElevenLabs → Sound Effects)

| # | Sound | Plays when | Filename | ElevenLabs SFX prompt | Dur |
|---|-------|-----------|----------|------------------------|-----|
| 1 | Tile place (you) | you lay a domino | `place.mp3` *(replaces current)* | crisp single wooden domino tile clicking firmly onto a felt table, dry, satisfying, short | ~0.4s |
| 2 | Tile place (Wendy) | Wendy lays a tile | `place-wendy.mp3` | a wooden domino set down deliberately on felt, slightly deeper and heavier than a quick tap, unhurried | ~0.5s |
| 3 | Score | points awarded | `score.mp3` *(replaces current)* | short warm ascending 3-note chime, gentle bell, celebratory but tasteful | ~0.7s |
| 4 | Big score | 15+ point play | `score-big.mp3` | a richer ascending sparkle chime, triumphant, warm bells, a touch longer | ~1.1s |
| 5 | Near-miss | board lands 1 off a multiple of 5 | `near-miss.mp3` | a soft subtle "almost" tone, two notes that don't quite resolve, gentle, not annoying | ~0.5s |
| 6 | Draw | you draw from the boneyard | `draw.mp3` | a quick soft tile/card shuffle-draw swoosh, short, woody | ~0.4s |
| 7 | Round clear | a round ends | `clear.mp3` *(replaces current)* | a soft satisfying sweep marking a round complete, warm | ~0.8s |
| 8 | Win | you win the game | `win.mp3` | a warm resolving major chord, brief dignified celebration, gentle bells | ~1.3s |
| 9 | Lose | Wendy wins | `lose.mp3` | a short dignified minor-key descending tone, wry not depressing | ~1.2s |
| 10 | Streak milestone | hit a 3/5/10-week streak | `streak.mp3` | an escalating cheerful sparkle, celebratory, short | ~1.0s |
| 11 | Error | invalid tile tap | `error.mp3` | a soft low "nope" thunk, brief, gentle, not harsh | ~0.3s |

Production tip: in ElevenLabs Sound Effects set **Duration** to the value above and **Prompt influence** high for the precise short ones (1, 6, 11), lower for the musical ones (3, 4, 8) to let it be musical.

---

## B) VOICED DIALOGUE (optional) — `public/vo/<id>.mp3`  (ElevenLabs → Text to Speech)

Make Sister Wendy Calhoun *speak*. Recommend ONE voice for her — warm, dry, preppy-Southern,
60-ish, amused. (Patricia/Hildegard would each need their own voice — do later.)
Settings: Stability ~45, Similarity ~75, Style ~30, speed ~0.95.

Full lines live in `lib/wendy.ts` (the `QUOTES` object, ~60 Wendy lines). Voicing **all** of them is
150+ files across 3 characters and risks repetition. **Recommended: voice only these "signature moments"**
(the lines worth hearing aloud) first — filenames are what the wiring will expect:

| id / filename | The line to speak |
|---|---|
| `vo/wendy-start-1.mp3` | "Sit down, darling. Let's see what you're made of." |
| `vo/wendy-start-2.mp3` | "I've got nowhere to be and all afternoon to beat you." |
| `vo/wendy-bigscore-1.mp3` | "Well. Someone's been paying attention." |
| `vo/wendy-bigscore-2.mp3` | "Darling, if you keep that up, I'll have to start trying." |
| `vo/wendy-wendywins-1.mp3` | "And that's the game. Don't take it personally, dear." |
| `vo/wendy-wendywins-2.mp3` | "I win. Sensible shoes, sharp mind. Works every time." |
| `vo/wendy-playerwins-1.mp3` | "You won. Don't gloat — it's unbecoming. But well done." |
| `vo/wendy-close-1.mp3` | "Now THIS is a game." |
| `vo/wendy-losing-1.mp3` | "Don't panic. I've seen comebacks. Not from you yet, but I've seen them." |
| `vo/wendy-rare-1.mp3` | "My mother used to say, 'Wendy, you'd argue with a fence post.' She was right. And I'd win." |

> If you want EVERY line voiced, say so and Carl will dump the complete `QUOTES` → filename table
> (all ~60 Wendy lines, then Patricia/Hildegard). The game would then play the matching clip when
> she says that line (text stays as the caption; audio is a bonus layer, muteable).

---

## Wiring (Carl, once files land)
- SFX: extend `lib/audio.ts` `SoundName` + the Howl map for the new files; add `audio.play()` calls
  at the trigger points (place-wendy on AI play, score-big at 15+, near-miss from scoreBreakdown,
  win/lose on game over, streak on milestone). Add `public/*.mp3` to `vercel.json` if it gates statics.
- Voiced lines: a `VO` map keyed by line id; when `wendySpeech` is set to a line that has a clip,
  play it (respecting the existing mute toggle). Keep it Wendy-only at first.
