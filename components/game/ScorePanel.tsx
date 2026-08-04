'use client';

import { useEffect, useRef } from 'react';
import { Player } from '@/lib/game';
import { SPONSOR_CONFIG } from '@/lib/sponsor';
import gsap from 'gsap';

interface ScorePanelProps {
  players: Player[];
  currentPlayerIndex: number;
  boneyard: number;
  round: number;
  lastScore: number;
  lastScoringPlayerId: string | null;
  targetScore?: number;
}

export default function ScorePanel({
  players,
  currentPlayerIndex,
  boneyard,
  round,
  lastScore,
  lastScoringPlayerId,
  targetScore,
}: ScorePanelProps) {
  const TARGET = targetScore ?? 61;
  const scoreRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  // Animate score change
  useEffect(() => {
    if (!lastScoringPlayerId || lastScore === 0) return;
    const el = scoreRefs.current[lastScoringPlayerId];
    if (!el) return;
    gsap.fromTo(el,
      { scale: 1.5, color: '#e8b840' },
      { scale: 1, color: '#f5ead8', duration: 0.6, ease: 'power2.out' }
    );
  }, [lastScore, lastScoringPlayerId]);

  const sponsor = SPONSOR_CONFIG.scoreBadge;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: 'rgba(26,20,8,0.85)',
        border: '1px solid rgba(196,144,32,0.2)',
      }}
    >
      {/* Round info. nowrap + wrap on the row: with the panel's padding
          restored there isn't always room for both on one line, and without
          this each label broke mid-phrase ("ROUND BONEYARD: / 1  14"). */}
      <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 mb-3">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.14em', color: 'rgba(230,192,102,0.88)', whiteSpace: 'nowrap' }}>
          ROUND {round}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.14em', color: 'rgba(226,188,96,0.8)', whiteSpace: 'nowrap' }}>
          BONEYARD: {boneyard}
        </span>
      </div>

      {/* Player scores */}
      <div className="flex flex-col gap-2">
        {players.map((player, i) => {
          const isActive = i === currentPlayerIndex;
          const pct = Math.min((player.score / TARGET) * 100, 100);

          return (
            <div key={player.id}>
              <div className="flex justify-between items-baseline mb-1">
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
                  letterSpacing: '0.14em',
                  color: isActive ? '#e8b840' : 'rgba(245,234,216,0.55)',
                  transition: 'color 0.3s',
                }}>
                  {isActive ? '▶ ' : ''}{player.name.toUpperCase()}
                </span>
                <span
                  ref={el => { scoreRefs.current[player.id] = el; }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '1.2rem',
                    color: '#f5ead8', fontWeight: 600,
                  }}
                >
                  {player.score}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, background: 'rgba(196,144,32,0.12)', borderRadius: 2 }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: isActive
                    ? 'linear-gradient(90deg, #c49020, #e8b840)'
                    : 'rgba(196,144,32,0.35)',
                  borderRadius: 2,
                  transition: 'width 0.5s ease',
                }} />
              </div>

              <div className="flex justify-between mt-0.5">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(214,172,86,0.72)', letterSpacing: '0.1em' }}>
                  0
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(214,172,86,0.72)', letterSpacing: '0.1em' }}>
                  {TARGET}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SPONSOR_HOOK: score badge — shown when SPONSOR_CONFIG.scoreBadge is set */}
      {sponsor && (
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(196,144,32,0.1)',
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          letterSpacing: '0.15em', textTransform: 'uppercase' as const,
          color: 'rgba(196,144,32,0.45)',
          textAlign: 'center' as const,
        }}>
          {sponsor.label}
        </div>
      )}
    </div>
  );
}
