'use client';

import { useEffect, useRef, useState } from 'react';
import { GameMode, todayKey, SCORE_MODES } from '@/lib/game';
import { PERSONALITIES } from '@/lib/wendy';
import gsap from 'gsap';
import { ScrewcapGamesStrip } from './ScrewcapPromo';
import PremiumModal from './PremiumModal';
import { focusedLocked, ADS } from '@/lib/ads';

interface GameSetupProps {
  onStart: (mode: GameMode, daily?: boolean, personalityId?: string, targetScore?: number) => void;
}

function HeroPortrait() {
  return (
    <div style={{ position: 'relative', width: 224, height: 300 }}>
      {/* Ornate gold frame */}
      <svg width="224" height="300" viewBox="0 0 224 300" style={{ position: 'absolute', inset: 0 }} aria-hidden>
        {/* Frame background */}
        <rect x="4" y="4" width="216" height="292" rx="12" fill="#1a1408" stroke="url(#frameGold)" strokeWidth="3" />
        {/* Outer frame border */}
        <rect x="2" y="2" width="220" height="296" rx="14" fill="none" stroke="#c49020" strokeWidth="1.5" opacity="0.6" />
        {/* Inner frame line */}
        <rect x="12" y="12" width="200" height="276" rx="8" fill="none" stroke="#c49020" strokeWidth="0.8" opacity="0.3" />
        {/* Corner ornaments */}
        <g opacity="0.7" fill="#c49020">
          <circle cx="16" cy="16" r="3" /><circle cx="208" cy="16" r="3" />
          <circle cx="16" cy="284" r="3" /><circle cx="208" cy="284" r="3" />
          <circle cx="16" cy="16" r="6" fill="none" stroke="#c49020" strokeWidth="1" />
          <circle cx="208" cy="16" r="6" fill="none" stroke="#c49020" strokeWidth="1" />
          <circle cx="16" cy="284" r="6" fill="none" stroke="#c49020" strokeWidth="1" />
          <circle cx="208" cy="284" r="6" fill="none" stroke="#c49020" strokeWidth="1" />
        </g>
        {/* Top fleur / crown */}
        <g fill="#c49020" opacity="0.55" transform="translate(112,8)">
          <path d="M0,-6 L3,0 L0,4 L-3,0 Z" />
          <path d="M-10,-3 L-6,0 L-10,3 L-14,0 Z" />
          <path d="M10,-3 L14,0 L10,3 L6,0 Z" />
        </g>
        <defs>
          <linearGradient id="frameGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8b840" />
            <stop offset="40%" stopColor="#c49020" />
            <stop offset="70%" stopColor="#a07818" />
            <stop offset="100%" stopColor="#e8b840" />
          </linearGradient>
        </defs>
      </svg>

      {/* Portrait photo */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, height: 208,
        borderRadius: 8, overflow: 'hidden',
        boxShadow: 'inset 0 0 26px rgba(0,0,0,0.55)',
      }}>
        <img
          src="/wendy-neutral.webp"
          alt="Sister Wendy Calhoun"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Name plate */}
      <div style={{ position: 'absolute', left: 14, right: 14, top: 232, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-bebas), monospace', fontSize: '1.05rem', letterSpacing: '0.1em', color: '#e8b840', lineHeight: 1.02 }}>
          SISTER WENDY CALHOUN
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.22em', color: 'rgba(196,144,32,0.85)', marginTop: 4 }}>
          1945 &ndash; 2019
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '0.66rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.62)', marginTop: 5, lineHeight: 1.3 }}>
          Critic of Life, Friends &amp; Family alike
        </div>
      </div>
    </div>
  );
}

const MODES: Array<{
  id: GameMode;
  label: string;
  subtitle: string;
  desc: string;
  color: string;
  wendy: string;
}> = [
  {
    id: 'forgiving',
    label: 'FORGIVING',
    subtitle: 'The novice\'s path',
    desc: '2 players · Hints available · Sister Wendy plays generously. Suspiciously so.',
    color: '#4a9a8f',
    wendy: '"Fine. I\'ll go easy. Don\'t make me regret it."',
  },
  {
    id: 'focused',
    label: 'FOCUSED',
    subtitle: 'Standard rules',
    desc: '2 players · No hints · Sister Wendy plays to win. She usually does.',
    color: '#c49020',
    wendy: '"Right then. No mercy. I didn\'t put this habit on for charity."',
  },
];

export default function GameSetup({ onStart }: GameSetupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playedToday, setPlayedToday] = useState(false);
  const [oppId, setOppId] = useState('wendy');
  const [targetScore, setTargetScore] = useState(61);
  // Premium gate (read post-mount → no SSR/CSR mismatch). When focusedLocked()
  // is false (premium not yet configured, or already owned) Focused is free.
  const [focusedGated, setFocusedGated] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const opponents = Object.values(PERSONALITIES);
  const opp = PERSONALITIES[oppId as keyof typeof PERSONALITIES] ?? PERSONALITIES.wendy;

  useEffect(() => {
    try { setPlayedToday(localStorage.getItem(todayKey()) === '1'); } catch { /* */ }
    setFocusedGated(focusedLocked());
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current.querySelectorAll('.mode-card'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.5, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: '#0d0a06' }}>
      <div ref={containerRef} className="w-full max-w-2xl">

        {/* Hero Portrait */}
        <div className="flex justify-center mb-6">
          <HeroPortrait />
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.32em', color: 'rgba(226,188,96,0.85)', marginBottom: 12 }}>
            SCREWCAP PRESENTS
          </div>
          <h1 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(3.5rem, 12vw, 7rem)',
            letterSpacing: '0.06em', lineHeight: 0.9,
            color: '#f5ead8',
          }}>
            SISTER<br />
            <span style={{ color: '#c49020', textShadow: '0 0 50px rgba(196,144,32,0.4)' }}>WENDY</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-garamond)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            fontStyle: 'italic',
            color: 'rgba(245,234,216,0.6)',
            marginTop: 12,
          }}>
            All-Fives Dominoes · Mild Spiritual Threat · She's Not Actually A Nun
          </p>
        </div>

        {/* Opponent picker — choose which sister judges you */}
        <div className="mb-8">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.2em', color: 'rgba(245,234,216,0.8)', textAlign: 'center', marginBottom: 12 }}>
            CHOOSE YOUR OPPONENT
          </div>
          <div className="grid grid-cols-3 gap-3">
            {opponents.map(p => {
              const sel = p.id === oppId;
              return (
                <button key={p.id} onClick={() => setOppId(p.id)}
                  className="rounded-2xl text-center transition-all"
                  style={{
                    background: sel ? `${p.accentColor}1f` : 'rgba(26,20,8,0.6)',
                    border: `2px solid ${p.accentColor}${sel ? 'ff' : '40'}`,
                    cursor: 'pointer', padding: '1rem 0.5rem',
                    opacity: sel ? 1 : 0.7,
                  }}>
                  <div style={{ fontSize: '1.6rem', lineHeight: 1, marginBottom: 6 }}>{p.emoji}</div>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.05rem', letterSpacing: '0.05em', color: p.textColor, lineHeight: 1.05 }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.12em', color: 'rgba(245,234,216,0.78)', marginTop: 3 }}>{p.title}</div>
                </button>
              );
            })}
          </div>
          <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.85rem', fontStyle: 'italic', color: opp.textColor, textAlign: 'center', marginTop: 12, minHeight: '2.4em', lineHeight: 1.4 }}>
            {opp.blurb}
          </p>
        </div>

        {/* Length picker — how long a game (chosen before Forgiving/Focused) */}
        <div className="mb-8">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.2em', color: 'rgba(245,234,216,0.8)', textAlign: 'center', marginBottom: 12 }}>
            HOW LONG ARE YOU STAYING?
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SCORE_MODES.map(sm => {
              const sel = sm.target === targetScore;
              return (
                <button key={sm.target} onClick={() => setTargetScore(sm.target)}
                  className="rounded-2xl text-center transition-all"
                  style={{
                    background: sel ? 'rgba(196,144,32,0.14)' : 'rgba(26,20,8,0.6)',
                    border: `2px solid ${sel ? '#c49020' : 'rgba(196,144,32,0.25)'}`,
                    cursor: 'pointer', padding: '0.85rem 0.5rem', opacity: sel ? 1 : 0.72,
                  }}>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1rem', letterSpacing: '0.04em', color: '#e8b840', lineHeight: 1.05 }}>{sm.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.09em', color: 'rgba(245,234,216,0.78)', marginTop: 4 }}>{sm.sub}</div>
                </button>
              );
            })}
          </div>
          <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(196,144,32,0.85)', textAlign: 'center', marginTop: 12, minHeight: '1.4em' }}>
            &ldquo;{SCORE_MODES.find(s => s.target === targetScore)?.wendy}&rdquo;
          </p>
        </div>

        {/* Mode cards */}
        <div className="flex flex-col gap-4 mb-8">
          {MODES.map(mode => {
            const gated = mode.id === 'focused' && focusedGated;
            return (
            <button
              key={mode.id}
              className="mode-card w-full rounded-2xl text-center transition-all group"
              style={{
                position: 'relative',
                background: 'rgba(26,20,8,0.8)',
                border: `2px solid ${mode.color}66`,
                cursor: 'pointer',
                padding: '2rem 2.5rem',
              }}
              onClick={() => gated ? setShowPremium(true) : onStart(mode.id, false, oppId, targetScore)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.border = `2px solid ${mode.color}`;
                (e.currentTarget as HTMLElement).style.background = `rgba(26,20,8,0.95)`;
                gsap.to(e.currentTarget, { scale: 1.015, duration: 0.2 });
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.border = `2px solid ${mode.color}66`;
                (e.currentTarget as HTMLElement).style.background = 'rgba(26,20,8,0.8)';
                gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
              }}
            >
              {gated && (
                <span style={{
                  position: 'absolute', top: 12, right: 14,
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.18em',
                  color: '#1a1408', background: 'linear-gradient(180deg,#e8b840,#c49020)',
                  borderRadius: 999, padding: '3px 9px',
                }}>
                  ✦ PREMIUM {ADS.price}
                </span>
              )}
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-bebas)', fontSize: '2rem',
                  letterSpacing: '0.12em', color: mode.color,
                  display: 'block',
                }}>
                  {mode.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                  letterSpacing: '0.16em', color: 'rgba(245,234,216,0.78)',
                }}>
                  {mode.subtitle}
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '0.08em', color: 'rgba(245,234,216,0.85)',
                marginBottom: 14, lineHeight: 1.6,
              }}>
                {mode.desc}
              </p>
              <p style={{
                fontFamily: 'var(--font-garamond)', fontSize: '0.95rem',
                fontStyle: 'italic', color: mode.color,
                lineHeight: 1.5,
              }}>
                {mode.wendy}
              </p>
              <div style={{
                fontFamily: 'var(--font-bebas)', fontSize: '1.4rem',
                color: mode.color, marginTop: 14, opacity: 0.7,
              }}>
                {gated ? `✦ UNLOCK ${ADS.price}` : '→ PLAY'}
              </div>
            </button>
            );
          })}
        </div>

        {/* Daily Challenge — same deal for everyone, every day (meta-loop / return hook) */}
        <div className="mb-8">
          <button
            onClick={() => { try { localStorage.setItem(todayKey(), '1'); } catch { /* */ } setPlayedToday(true); onStart('focused', true, oppId, targetScore); }}
            className="w-full rounded-2xl transition-all"
            style={{ background: 'rgba(74,154,143,0.1)', border: '2px solid rgba(74,154,143,0.45)', cursor: 'pointer', padding: '1.1rem 2rem' }}
            onMouseEnter={e => { gsap.to(e.currentTarget, { scale: 1.015, duration: 0.2 }); }}
            onMouseLeave={e => { gsap.to(e.currentTarget, { scale: 1, duration: 0.2 }); }}
          >
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.6rem', letterSpacing: '0.12em', color: '#4a9a8f', display: 'block' }}>
              ⭐ TODAY&apos;S CHALLENGE
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'rgba(245,234,216,0.5)' }}>
              {playedToday ? "PLAYED TODAY ✓ · same deal as everyone else" : "One deal. Everyone gets the same tiles today. Focused rules."}
            </span>
          </button>
        </div>

        {/* Other Screwcap games */}
        <div className="mb-6">
          <ScrewcapGamesStrip />
        </div>

        {/* Footer */}
        <div className="text-center" style={{ marginTop: 32, paddingTop: 18, paddingBottom: 14, borderTop: '1px solid rgba(196,144,32,0.12)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(226,188,96,0.82)', marginBottom: 10 }}>
            ALL-FIVES SCORING · FIRST TO 61 WINS
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(226,188,96,0.8)', lineHeight: 1.6 }}>
            © 2026{' '}
            <a href="https://screwcap.games" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(232,184,64,0.8)', textDecoration: 'none' }}>Screwcap Games, LLC</a>
            <span style={{ opacity: 0.8 }}>{'  ·  '}</span>
            <a href="/research" style={{ color: 'rgba(232,184,64,0.8)', textDecoration: 'none' }}>Research</a>
            <span style={{ opacity: 0.8 }}>{'  ·  '}</span>
            <a href="/terms" style={{ color: 'rgba(232,184,64,0.8)', textDecoration: 'none' }}>Terms</a>
            <span style={{ opacity: 0.8 }}>{'  ·  '}</span>
            <a href="/privacy" style={{ color: 'rgba(232,184,64,0.8)', textDecoration: 'none' }}>Privacy</a>
          </p>
        </div>
      </div>

      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onUnlocked={() => { setShowPremium(false); setFocusedGated(focusedLocked()); onStart('focused', false, oppId, targetScore); }}
        />
      )}
    </div>
  );
}
