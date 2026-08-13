'use client';

import { useEffect, useRef } from 'react';
import { Player } from '@/lib/game';
import gsap from 'gsap';

interface HeaderScoreProps {
  players: Player[];
  currentPlayerIndex: number;
  lastScore: number;
  lastScoringPlayerId: string | null;
}

// The live score, in the top nav where you actually glance for it. The detailed
// scorecard keeps the progress bars and the target; the numerals live here, once,
// so the same two numbers aren't printed twice on one screen.
export default function HeaderScore({
  players,
  currentPlayerIndex,
  lastScore,
  lastScoringPlayerId,
}: HeaderScoreProps) {
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});

  // The scoring flash — moved here with the numbers it belongs to.
  useEffect(() => {
    if (!lastScoringPlayerId || lastScore === 0) return;
    const el = refs.current[lastScoringPlayerId];
    if (!el) return;
    gsap.fromTo(el,
      { scale: 1.55, color: '#e8b840' },
      { scale: 1, color: '#f5ead8', duration: 0.6, ease: 'power2.out' }
    );
  }, [lastScore, lastScoringPlayerId]);

  const shortName = (p: Player) =>
    p.isHuman ? 'YOU' : (p.name.split(' ')[1] ?? p.name).toUpperCase();

  return (
    <div className="flex items-baseline justify-center gap-2" style={{ marginTop: 3 }}>
      {players.map((p, i) => {
        const isActive = i === currentPlayerIndex;
        return (
          <span key={p.id} className="flex items-baseline gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" style={{ color: 'rgba(196,144,32,0.35)', fontSize: '0.7rem', marginRight: 4 }}>·</span>
            )}
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em',
              color: isActive ? '#e8b840' : 'rgba(245,234,216,0.5)',
              transition: 'color 0.3s',
            }}>
              {shortName(p)}
            </span>
            <span
              ref={el => { refs.current[p.id] = el; }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 600, color: '#f5ead8', lineHeight: 1 }}
            >
              {p.score}
            </span>
          </span>
        );
      })}
    </div>
  );
}
