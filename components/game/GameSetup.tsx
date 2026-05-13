'use client';

import { useEffect, useRef } from 'react';
import { GameMode } from '@/lib/game';
import gsap from 'gsap';

interface GameSetupProps {
  onStart: (mode: GameMode) => void;
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
    wendy: '"I shall go easy on you. This is a kindness, not a concession."',
  },
  {
    id: 'focused',
    label: 'FOCUSED',
    subtitle: 'Standard rules',
    desc: '2 players · No hints · Sister Wendy plays to win. She usually does.',
    color: '#c49020',
    wendy: '"Standard rules. No quarter given. No quarter expected."',
  },
  {
    id: 'merciless',
    label: 'MERCILESS',
    subtitle: 'Cut Throat — 4 players',
    desc: 'You vs Sister Wendy, Sister Patricia & Abbess Hildegard. God help you.',
    color: '#d4507a',
    wendy: '"Four players. This is going to be carnage. Magnificent, religious carnage."',
  },
];

export default function GameSetup({ onStart }: GameSetupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
            All-Fives Dominoes · Art History · Mild Spiritual Threat
          </p>
        </div>

        {/* Mode cards */}
        <div className="flex flex-col gap-4 mb-8">
          {MODES.map(mode => (
            <button
              key={mode.id}
              className="mode-card w-full rounded-2xl p-5 text-left transition-all group"
              style={{
                background: 'rgba(26,20,8,0.8)',
                border: `1px solid ${mode.color}33`,
                cursor: 'pointer',
              }}
              onClick={() => onStart(mode.id)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.border = `1px solid ${mode.color}88`;
                (e.currentTarget as HTMLElement).style.background = `rgba(26,20,8,0.95)`;
                gsap.to(e.currentTarget, { scale: 1.015, duration: 0.2 });
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.border = `1px solid ${mode.color}33`;
                (e.currentTarget as HTMLElement).style.background = 'rgba(26,20,8,0.8)';
                gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span style={{
                      fontFamily: 'var(--font-bebas)', fontSize: '1.5rem',
                      letterSpacing: '0.1em', color: mode.color,
                    }}>
                      {mode.label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                      letterSpacing: '0.14em', color: 'rgba(245,234,216,0.4)',
                    }}>
                      {mode.subtitle}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    letterSpacing: '0.1em', color: 'rgba(245,234,216,0.6)',
                    marginBottom: 10,
                  }}>
                    {mode.desc}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-garamond)', fontSize: '0.8rem',
                    fontStyle: 'italic', color: `${mode.color}cc`,
                    lineHeight: 1.4,
                  }}>
                    {mode.wendy}
                  </p>
                </div>
                <div style={{
                  fontFamily: 'var(--font-bebas)', fontSize: '1.2rem',
                  color: mode.color, opacity: 0.6, flexShrink: 0, marginTop: 4,
                }}>
                  →
                </div>
              </div>
            </button>
          ))}
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
