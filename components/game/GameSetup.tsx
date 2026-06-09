'use client';

import { useEffect, useRef, useState } from 'react';
import { GameMode, todayKey } from '@/lib/game';
import { PERSONALITIES } from '@/lib/wendy';
import gsap from 'gsap';
import { ScrewcapGamesStrip } from './ScrewcapPromo';

interface GameSetupProps {
  onStart: (mode: GameMode, daily?: boolean, personalityId?: string) => void;
}

function HeroPortrait() {
  return (
    <div style={{ position: 'relative', width: 220, height: 260 }}>
      {/* Ornate gold frame */}
      <svg width="220" height="260" viewBox="0 0 220 260" style={{ position: 'absolute', inset: 0 }} aria-hidden>
        {/* Frame background */}
        <rect x="4" y="4" width="212" height="252" rx="12" fill="#1a1408" stroke="url(#frameGold)" strokeWidth="3" />
        {/* Outer frame border */}
        <rect x="2" y="2" width="216" height="256" rx="14" fill="none" stroke="#c49020" strokeWidth="1.5" opacity="0.6" />
        {/* Inner frame line */}
        <rect x="12" y="12" width="196" height="236" rx="8" fill="none" stroke="#c49020" strokeWidth="0.8" opacity="0.3" />
        {/* Corner ornaments */}
        <g opacity="0.7" fill="#c49020">
          <circle cx="16" cy="16" r="3" /><circle cx="204" cy="16" r="3" />
          <circle cx="16" cy="244" r="3" /><circle cx="204" cy="244" r="3" />
          <circle cx="16" cy="16" r="6" fill="none" stroke="#c49020" strokeWidth="1" />
          <circle cx="204" cy="16" r="6" fill="none" stroke="#c49020" strokeWidth="1" />
          <circle cx="16" cy="244" r="6" fill="none" stroke="#c49020" strokeWidth="1" />
          <circle cx="204" cy="244" r="6" fill="none" stroke="#c49020" strokeWidth="1" />
        </g>
        {/* Top fleur / crown */}
        <g fill="#c49020" opacity="0.55" transform="translate(110,8)">
          <path d="M0,-6 L3,0 L0,4 L-3,0 Z" />
          <path d="M-10,-3 L-6,0 L-10,3 L-14,0 Z" />
          <path d="M10,-3 L14,0 L10,3 L6,0 Z" />
        </g>
        {/* Bottom name plate */}
        <rect x="50" y="228" width="120" height="22" rx="4" fill="#0d0a06" stroke="#c49020" strokeWidth="0.8" opacity="0.8" />
        <text x="110" y="244" textAnchor="middle" fontFamily="monospace" fontSize="8" letterSpacing="2" fill="#c49020" opacity="0.85">
          SR. WENDY BECKETT
        </text>
        <defs>
          <linearGradient id="frameGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8b840" />
            <stop offset="40%" stopColor="#c49020" />
            <stop offset="70%" stopColor="#a07818" />
            <stop offset="100%" stopColor="#e8b840" />
          </linearGradient>
        </defs>
      </svg>

      {/* Portrait content */}
      <div style={{
        position: 'absolute', top: 18, left: 18, right: 18, bottom: 40,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(196,144,32,0.1) 0%, #0a0804 80%)',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        {/* Large nun face */}
        <svg viewBox="0 0 176 220" width="148" height="185" aria-label="Sister Wendy portrait">
          {/* Dramatic halo glow */}
          <ellipse cx="88" cy="70" rx="55" ry="55" fill="none" stroke="#c49020" strokeWidth="0.6" opacity="0.25" />
          <ellipse cx="88" cy="70" rx="62" ry="62" fill="none" stroke="#c49020" strokeWidth="0.3" opacity="0.12" />
          {/* Habit (veil) */}
          <ellipse cx="88" cy="90" rx="74" ry="88" fill="#1a1408" />
          <ellipse cx="88" cy="90" rx="60" ry="74" fill="#0a0804" />
          {/* White wimple */}
          <ellipse cx="88" cy="110" rx="46" ry="62" fill="#f0e8d8" />
          {/* Face */}
          <ellipse cx="88" cy="93" rx="38" ry="43" fill="#e8d2b0" />
          {/* Subtle blush */}
          <ellipse cx="72" cy="100" rx="9" ry="6" fill="#d4907a" opacity="0.15" />
          <ellipse cx="104" cy="100" rx="9" ry="6" fill="#d4907a" opacity="0.15" />
          {/* Eyes — knowing, warm */}
          <ellipse cx="78" cy="88" rx="4.5" ry="5" fill="#2c1a0e" />
          <ellipse cx="98" cy="88" rx="4.5" ry="5" fill="#2c1a0e" />
          {/* Eye shine */}
          <circle cx="80" cy="86" r="1.2" fill="white" opacity="0.6" />
          <circle cx="100" cy="86" r="1.2" fill="white" opacity="0.6" />
          {/* Glasses — her signature */}
          <circle cx="78" cy="88" r="9" fill="none" stroke="#c49020" strokeWidth="1.8" opacity="0.8" />
          <circle cx="98" cy="88" r="9" fill="none" stroke="#c49020" strokeWidth="1.8" opacity="0.8" />
          <line x1="87" y1="88" x2="89" y2="88" stroke="#c49020" strokeWidth="1.2" opacity="0.8" />
          <line x1="69" y1="88" x2="65" y2="86" stroke="#c49020" strokeWidth="1" opacity="0.5" />
          <line x1="107" y1="88" x2="111" y2="86" stroke="#c49020" strokeWidth="1" opacity="0.5" />
          {/* Brows — arched with character */}
          <path d="M 69 78 Q 78 74 87 78" fill="none" stroke="#5c3d28" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 89 78 Q 98 74 107 78" fill="none" stroke="#5c3d28" strokeWidth="1.8" strokeLinecap="round" />
          {/* Knowing smile */}
          <path d="M 76 108 Q 88 117 100 108" fill="none" stroke="#8b4a2a" strokeWidth="2" strokeLinecap="round" />
          {/* Gold cross necklace */}
          <line x1="88" y1="152" x2="88" y2="175" stroke="#c49020" strokeWidth="1.8" />
          <line x1="80" y1="161" x2="96" y2="161" stroke="#c49020" strokeWidth="1.8" />
          <circle cx="88" cy="177" r="2.5" fill="#c49020" opacity="0.8" />
          {/* Domino tile in hand — cheeky detail */}
          <rect x="60" y="168" width="28" height="14" rx="2" fill="#f0e8d8" stroke="#1a1408" strokeWidth="1" />
          <line x1="74" y1="168" x2="74" y2="182" stroke="#1a1408" strokeWidth="0.8" />
          <circle cx="67" cy="175" r="1.5" fill="#2c1a0e" />
          <circle cx="81" cy="172" r="1.5" fill="#2c1a0e" />
          <circle cx="81" cy="178" r="1.5" fill="#2c1a0e" />
          {/* Triumphant glow */}
          <ellipse cx="88" cy="90" rx="45" ry="50" fill="none" stroke="#c49020" strokeWidth="0.4" opacity="0.2" />
        </svg>

        {/* Tagline */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '8.5px',
          fontStyle: 'italic',
          color: 'rgba(245,234,216,0.5)',
          textAlign: 'center',
          letterSpacing: '0.04em',
          lineHeight: 1.4,
          padding: '0 8px',
          marginTop: -8,
        }}>
          "I didn't wear this habit to lose.<br />Now are you playing or not?"
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
  const opponents = Object.values(PERSONALITIES);
  const opp = PERSONALITIES[oppId as keyof typeof PERSONALITIES] ?? PERSONALITIES.wendy;

  useEffect(() => {
    try { setPlayedToday(localStorage.getItem(todayKey()) === '1'); } catch { /* */ }
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.35em', color: 'rgba(196,144,32,0.5)', marginBottom: 12 }}>
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.22em', color: 'rgba(245,234,216,0.45)', textAlign: 'center', marginBottom: 12 }}>
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
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.05rem', letterSpacing: '0.05em', color: p.accentColor, lineHeight: 1.05 }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.14em', color: 'rgba(245,234,216,0.5)', marginTop: 3 }}>{p.title}</div>
                </button>
              );
            })}
          </div>
          <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.85rem', fontStyle: 'italic', color: `${opp.accentColor}dd`, textAlign: 'center', marginTop: 12, minHeight: '2.4em', lineHeight: 1.4 }}>
            {opp.blurb}
          </p>
        </div>

        {/* Mode cards */}
        <div className="flex flex-col gap-4 mb-8">
          {MODES.map(mode => (
            <button
              key={mode.id}
              className="mode-card w-full rounded-2xl text-center transition-all group"
              style={{
                background: 'rgba(26,20,8,0.8)',
                border: `2px solid ${mode.color}66`,
                cursor: 'pointer',
                padding: '2rem 2.5rem',
              }}
              onClick={() => onStart(mode.id, false, oppId)}
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
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-bebas)', fontSize: '2rem',
                  letterSpacing: '0.12em', color: mode.color,
                  display: 'block',
                }}>
                  {mode.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  letterSpacing: '0.18em', color: 'rgba(245,234,216,0.45)',
                }}>
                  {mode.subtitle}
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '0.08em', color: 'rgba(245,234,216,0.65)',
                marginBottom: 14, lineHeight: 1.6,
              }}>
                {mode.desc}
              </p>
              <p style={{
                fontFamily: 'var(--font-garamond)', fontSize: '0.95rem',
                fontStyle: 'italic', color: `${mode.color}dd`,
                lineHeight: 1.5,
              }}>
                {mode.wendy}
              </p>
              <div style={{
                fontFamily: 'var(--font-bebas)', fontSize: '1.4rem',
                color: mode.color, marginTop: 14, opacity: 0.7,
              }}>
                → PLAY
              </div>
            </button>
          ))}
        </div>

        {/* Daily Challenge — same deal for everyone, every day (meta-loop / return hook) */}
        <div className="mb-8">
          <button
            onClick={() => { try { localStorage.setItem(todayKey(), '1'); } catch { /* */ } setPlayedToday(true); onStart('focused', true, oppId); }}
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
        <div className="text-center">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.18em', color: 'rgba(196,144,32,0.3)' }}>
            ALL-FIVES SCORING · FIRST TO 61 WINS · ©2026 SCREWCAP LLC
          </p>
        </div>
      </div>
    </div>
  );
}
