'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface IntroScreenProps {
  onDone: () => void;
}

// Piano-like tone via Web Audio API
function clack(freq = 300) {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
    osc.onended = () => ctx.close();
  } catch { /* */ }
}

// PLAY button depth: inner top highlight, contact shadow, ambient gold bloom.
const PLAY_SHADOW =
  'inset 0 1px 0 rgba(255,246,214,0.55), inset 0 -2px 0 rgba(90,64,10,0.35), 0 3px 6px rgba(0,0,0,0.5), 0 0 26px rgba(196,144,32,0.32)';
const PLAY_SHADOW_HOVER =
  'inset 0 1px 0 rgba(255,246,214,0.65), inset 0 -2px 0 rgba(90,64,10,0.35), 0 6px 14px rgba(0,0,0,0.55), 0 0 34px rgba(232,184,64,0.45)';
const PLAY_SHADOW_ACTIVE =
  'inset 0 2px 5px rgba(70,48,6,0.55), 0 1px 2px rgba(0,0,0,0.5), 0 0 18px rgba(196,144,32,0.28)';

// Small domino SVG
/**
 * Pips are laid out as offsets from the CENTRE of their half-face, not as
 * absolute coordinates — the old absolute table put the top half's rows at
 * y 7/14/21 inside a face running 1.6→29.6, so every pip sat ~3 units high
 * and the tile read top-heavy (Andrew, 15 Aug). Measuring from each centre
 * makes the margins symmetrical by construction.
 *
 * Face geometry: the rect's 1.2 stroke is centred, so the inner faces run
 * y 1.6→29.6 (top, centre 15.6) and y 30.4→58.4 (bottom, centre 44.4).
 */
const TOP_C = 15.6;
const BOT_C = 44.4;
const COL = 7;    // column offset from the tile's x centre (14)
const ROW = 7;    // row offset for the 3×3 layouts
const ROW6 = 8.6; // the six needs three rows, so they sit closer together

const PIP_OFFSETS: Record<number, Array<[number, number]>> = {
  0: [],
  1: [[0, 0]],
  2: [[-COL, -ROW], [COL, ROW]],
  3: [[-COL, -ROW], [0, 0], [COL, ROW]],
  4: [[-COL, -ROW], [COL, -ROW], [-COL, ROW], [COL, ROW]],
  5: [[-COL, -ROW], [COL, -ROW], [0, 0], [-COL, ROW], [COL, ROW]],
  6: [[-COL, -ROW6], [COL, -ROW6], [-COL, 0], [COL, 0], [-COL, ROW6], [COL, ROW6]],
};

function DominoSVG({ a, b, style }: { a: number; b: number; style?: React.CSSProperties }) {
  const topPips = PIP_OFFSETS[a] ?? [];
  const botPips = PIP_OFFSETS[b] ?? [];
  return (
    <svg viewBox="0 0 28 60" style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.7))', ...style }}>
      <rect x="1" y="1" width="26" height="58" rx="4" fill="#f2ecd6" stroke="#1e1006" strokeWidth="1.2" />
      <line x1="5" y1="30" x2="23" y2="30" stroke="#1e1006" strokeWidth="0.8" opacity="0.5" />
      {topPips.map(([dx, dy], i) => (
        <circle key={`a${i}`} cx={14 + dx} cy={TOP_C + dy} r="2.8" fill="#2c1a0e" />
      ))}
      {botPips.map(([dx, dy], i) => (
        <circle key={`b${i}`} cx={14 + dx} cy={BOT_C + dy} r="2.8" fill="#2c1a0e" />
      ))}
    </svg>
  );
}

export default function IntroScreen({ onDone }: IntroScreenProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const d1Ref       = useRef<HTMLDivElement>(null);
  const text1Ref    = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const speechRef   = useRef<HTMLDivElement>(null);
  const d2Ref       = useRef<HTMLDivElement>(null);
  const text2Ref    = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const tagRef      = useRef<HTMLDivElement>(null);
  const playRef     = useRef<HTMLButtonElement>(null);
  const fanRef      = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    if (!overlayRef.current) return;
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.5, ease: 'power2.in',
      onComplete: () => { setVisible(false); onDone(); },
    });
  };

  useEffect(() => {
    if (!visible) return;
    const tl = gsap.timeline({ onComplete: () => { /* stays, user clicks PLAY */ } });

    // ── Phase 1 [0–1.5s]: First domino slides in ──────────────────────────
    tl.fromTo(d1Ref.current,
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.4)',
        onComplete: () => clack(440) },
      0
    );
    tl.fromTo(text1Ref.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      0.65
    );

    // ── Phase 2 [1.5–3s]: Portrait + speech ───────────────────────────────
    tl.fromTo(portraitRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' },
      1.55
    );
    tl.fromTo(speechRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      2.0
    );

    // Float portrait
    if (portraitRef.current) {
      gsap.to(portraitRef.current, {
        y: -6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.0,
      });
    }

    // ── Phase 3 [3–4.5s]: Second domino ───────────────────────────────────
    tl.fromTo(d2Ref.current,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: 'back.out(1.4)',
        onComplete: () => clack(330) },
      3.1
    );
    tl.fromTo(text2Ref.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      3.7
    );

    // ── Phase 4 [4.5–6s]: Title + tagline + PLAY ─────────────────────────
    tl.fromTo(fanRef.current,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' },
      4.55
    );
    tl.fromTo(titleRef.current,
      { opacity: 0, y: -14, letterSpacing: '0.5em' },
      { opacity: 1, y: 0, letterSpacing: '0.15em', duration: 0.55, ease: 'power3.out' },
      4.65
    );
    tl.fromTo(tagRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      5.1
    );
    tl.fromTo(playRef.current,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)',
        onComplete: () => {
          // Pulse the PLAY button forever
          gsap.to(playRef.current, {
            scale: 1.07, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1,
          });
          // Harpsichord-ish ending riff
          [0, 0.1, 0.2, 0.35].forEach((t, i) => {
            setTimeout(() => clack([523, 659, 784, 1047][i]), t * 1000);
          });
        }},
      5.5
    );

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const FAN_TILES = [
    { a: 6, b: 6, rot: -30, tx: -50 },
    { a: 5, b: 3, rot: -15, tx: -25 },
    { a: 4, b: 1, rot: 0,   tx: 0   },
    { a: 3, b: 5, rot: 15,  tx: 25  },
    { a: 1, b: 2, rot: 30,  tx: 50  },
  ];

  return (
    <div
      ref={overlayRef}
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#050303',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'safe center',
        cursor: 'pointer',
        userSelect: 'none',
        // The sequence is taller than a 660px-high window and the overlay is
        // fixed, so PLAY was being clipped off the bottom on short laptops
        // before any of this. Scroll instead of clipping.
        // 'safe center' matters: a plain centred flex column that overflows
        // clips its own top and you cannot scroll back up to it.
        overflowY: 'auto',
        paddingTop: 'clamp(4px, 1.5vh, 12px)', paddingBottom: 'clamp(4px, 1.5vh, 12px)',
      }}
    >
      {/* ── Phase 1: First domino + caption ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 'clamp(2px, 1vh, 8px)' }}>
        <div ref={d1Ref} style={{ opacity: 0, width: 'clamp(56px, 8vh, 68px)', flexShrink: 0 }}>
          <DominoSVG a={6} b={6} style={{ width: 'clamp(56px, 8vh, 68px)', height: 'clamp(120px, 17vh, 146px)' }} />
        </div>
        {/* Hers is the bigger of the two blocks on purpose — the game is the
            billing under her name, not beside it. Her tile scales with the
            type so the pair still reads as one unit. — Andrew, 14 Aug.
            Both are capped in vh as well as vw: at full size the block costs
            ~60px more than it used to, which is exactly enough to push PLAY
            past the bottom of a 660px window. Short windows get the smaller
            end of the clamp; from ~860px up it renders at full size. */}
        <div ref={text1Ref} style={{ opacity: 0, textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(1.35rem, min(4.2vw, 4.4vh), 2.4rem)', color: '#e8b840', letterSpacing: '0.08em', lineHeight: 1.2 }}>
            Sister Wendy
          </div>
          {/* Was "1930 – 2018" (the real art critic). She is her own character,
              she is alive, and her age stays undefined — Andrew, 4 Aug. */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(226,188,96,0.75)', letterSpacing: '0.2em', marginTop: 5 }}>
            STILL PLAYING
          </div>
        </div>
      </div>

      {/* ── Phase 2: Portrait + speech ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 'clamp(4px, 1.2vh, 12px)', marginTop: 'clamp(0px, 1vh, 8px)' }}>
        <div ref={portraitRef} style={{ opacity: 0, flexShrink: 0 }}>
          <img src="/wendy-neutral.webp" alt="Sister Wendy" width="72" height="90"
            style={{ width: 72, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(196,144,32,0.45)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }} />
        </div>
        <div
          ref={speechRef}
          style={{
            opacity: 0, background: 'rgba(26,20,8,0.95)',
            border: '1px solid rgba(196,144,32,0.3)',
            borderRadius: 12, padding: '10px 16px',
            maxWidth: 220, position: 'relative', marginTop: 16,
          }}
        >
          {/* Tail */}
          <div style={{
            position: 'absolute', left: -8, top: 18,
            width: 0, height: 0,
            borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
            borderRight: '8px solid rgba(196,144,32,0.3)',
          }} />
          <p style={{ fontFamily: 'var(--font-garamond)', fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(245,234,216,0.9)', lineHeight: 1.4 }}>
            "Are you playing or not."
          </p>
        </div>
      </div>

      {/* ── Phase 3: Second domino + caption ──
          Sits low deliberately. With only Phase 2's 12px beneath the speech
          bubble, this caption tucked up under the portrait and read as part of
          Sister Wendy's block — a caption for her, not a line about the game.
          The gap below it is what tells you it belongs to the title.
          The space comes OUT of the gap below rather than being added to the
          overlay, which is fixed, centred and does not scroll — a straight
          +48px pushed the PLAY button off the bottom of a 660px-tall window.
          Dropped again 14 Aug: one gap wasn't enough separation once her block
          grew. Still vh-scaled, so a short window gives back the space it
          can't afford instead of clipping PLAY. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 'clamp(24px, calc(11vh - 40px), 88px)', marginBottom: 4 }}>
        {/* "All-Fives Dominoes" is gone — Andrew, 15 Aug (asked twice). The
            first ask was read as a spacing problem and the line was only moved
            down the splash; he wanted the words out. The 5|0 tile and the
            scoring line carry the same idea without naming the ruleset. */}
        <div ref={text2Ref} style={{ opacity: 0, textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(196,144,32,0.55)', letterSpacing: '0.18em' }}>
            Score in multiples of 5
          </div>
        </div>
        <div ref={d2Ref} style={{ opacity: 0, width: 56, flexShrink: 0 }}>
          <DominoSVG a={5} b={0} style={{ width: 56, height: 120 }} />
        </div>
      </div>

      {/* ── Phase 4: Fan + title + PLAY ── */}
      <div ref={fanRef} style={{ opacity: 0, display: 'flex', justifyContent: 'center', marginBottom: 'clamp(10px, 2.5vh, 20px)' }}>
        {FAN_TILES.map((t, i) => (
          <div key={i} style={{
            position: 'absolute',
            transform: `rotate(${t.rot}deg) translateX(${t.tx}px) translateY(${Math.abs(t.rot) * 0.8}px)`,
            transformOrigin: 'bottom center',
          }}>
            <DominoSVG a={t.a} b={t.b} style={{ width: 28, height: 60, opacity: 0.9 }} />
          </div>
        ))}
        <div style={{ height: 'clamp(56px, 9vh, 70px)' }} /> {/* spacer for fan tiles */}
      </div>

      <div ref={titleRef} style={{
        opacity: 0,
        fontFamily: 'var(--font-bebas)',
        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
        letterSpacing: '0.15em',
        color: '#e8b840',
        lineHeight: 1,
        textShadow: '0 0 40px rgba(232,184,64,0.3)',
        marginBottom: 6,
      }}>
        SISTER WENDY
      </div>

      <div ref={tagRef} style={{
        opacity: 0,
        fontFamily: 'var(--font-garamond)',
        fontStyle: 'italic',
        fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
        color: 'rgba(245,234,216,0.55)',
        letterSpacing: '0.06em',
        marginBottom: 'clamp(20px, 3.5vh, 32px)',
      }}>
        Mild Spiritual Threat.
      </div>

      <button
        ref={playRef}
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = PLAY_SHADOW_HOVER;
          (e.currentTarget as HTMLElement).style.filter = 'brightness(1.06)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = PLAY_SHADOW;
          (e.currentTarget as HTMLElement).style.filter = 'none';
        }}
        onMouseDown={e => { (e.currentTarget as HTMLElement).style.boxShadow = PLAY_SHADOW_ACTIVE; }}
        onMouseUp={e => { (e.currentTarget as HTMLElement).style.boxShadow = PLAY_SHADOW_HOVER; }}
        style={{
          opacity: 0,
          fontFamily: 'var(--font-bebas)',
          fontSize: '1.4rem',
          letterSpacing: '0.18em',
          // Brushed gold rather than a flat block: highlight at the top, shadow
          // at the bottom, so it reads as struck metal under a light.
          background: 'linear-gradient(180deg, #f0cf6a 0%, #d8a92e 42%, #a87c18 100%)',
          color: '#1a1206',
          border: '1px solid #8b6d1e',
          padding: 'clamp(9px, 1.6vh, 13px) 50px',
          borderRadius: 12,
          cursor: 'pointer',
          textShadow: '0 1px 1px rgba(255,240,200,0.35)',
          boxShadow: PLAY_SHADOW,
        }}
      >
        PLAY
      </button>

      {/* Pinned to the window, not to the stack, so on a short window it lands
          on top of PLAY. There is no room for it there and the whole overlay
          is click-to-dismiss anyway — so below 720px it goes. */}
      <style>{`@media (max-height: 720px) { .intro-continue-hint { display: none; } }`}</style>
      <div className="intro-continue-hint" style={{
        position: 'absolute', bottom: 18,
        fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
        letterSpacing: '0.12em', color: 'rgba(226,188,96,0.72)',
        textShadow: '0 1px 4px rgba(0,0,0,0.85)',
      }}>
        CLICK ANYWHERE TO CONTINUE
      </div>
    </div>
  );
}

