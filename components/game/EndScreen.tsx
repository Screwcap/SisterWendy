'use client';

import { useEffect, useRef } from 'react';
import { Player, GameMode } from '@/lib/game';
import { calcGrade, getVerdictText } from '@/lib/wendy';
import { SPONSOR_CONFIG } from '@/lib/sponsor';
import { ScrewcapGamesStrip, SponsorBanner } from './ScrewcapPromo';
import gsap from 'gsap';

interface EndScreenProps {
  players: Player[];
  gameWinnerId: string;
  mode: GameMode;
  hintsUsed: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export default function EndScreen({
  players,
  gameWinnerId,
  mode,
  hintsUsed,
  onPlayAgain,
  onChangeDifficulty,
}: EndScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const human = players.find(p => p.isHuman)!;
  const winner = players.find(p => p.id === gameWinnerId)!;
  const humanWon = gameWinnerId === 'human';
  const opponent = players.find(p => !p.isHuman)!;

  const grade = calcGrade(human.score, opponent?.score ?? 0, hintsUsed);
  const verdict = getVerdictText(grade, humanWon);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.2)' }
    );
  }, []);

  const sponsor = SPONSOR_CONFIG.postGame;
  const gradeColor: Record<string, string> = {
    A: '#e8b840', B: '#4a9a8f', C: '#c49020', D: '#d4507a', F: '#dc2626',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,10,6,0.95)', backdropFilter: 'blur(8px)' }}>
      <div ref={containerRef} className="w-full max-w-lg rounded-2xl p-8"
        style={{
          background: 'linear-gradient(180deg, #1a1408 0%, #0d0a06 100%)',
          border: '1px solid rgba(196,144,32,0.35)',
          boxShadow: '0 0 60px rgba(196,144,32,0.1)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(196,144,32,0.55)', marginBottom: 8 }}>
            SISTER WENDY'S VERDICT
          </div>
          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            letterSpacing: '0.08em',
            color: humanWon ? '#e8b840' : '#f5ead8',
            lineHeight: 1,
          }}>
            {humanWon ? 'VICTORY' : winner.name.toUpperCase() + ' WINS'}
          </h2>
        </div>

        {/* Grade */}
        <div className="flex justify-center mb-5">
          <div className="flex flex-col items-center">
            <div style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '5rem',
              color: gradeColor[grade],
              lineHeight: 1,
              textShadow: `0 0 30px ${gradeColor[grade]}55`,
            }}>
              {grade}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.2em', color: 'rgba(196,144,32,0.5)' }}>
              PERFORMANCE GRADE
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {players.map(p => (
            <div key={p.id} className="rounded-xl p-3 text-center"
              style={{
                background: p.id === gameWinnerId ? 'rgba(196,144,32,0.12)' : 'rgba(26,20,8,0.6)',
                border: `1px solid ${p.id === gameWinnerId ? 'rgba(232,184,64,0.4)' : 'rgba(196,144,32,0.12)'}`,
              }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.14em', color: 'rgba(196,144,32,0.6)', marginBottom: 4 }}>
                {p.name.toUpperCase()}{p.id === gameWinnerId ? ' ★' : ''}
              </div>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.2rem', color: '#f5ead8', lineHeight: 1 }}>
                {p.score}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.44rem', color: 'rgba(196,144,32,0.35)' }}>
                POINTS
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div className="rounded-xl p-4 mb-5"
          style={{ background: 'rgba(26,20,8,0.7)', border: '1px solid rgba(196,144,32,0.15)' }}>
          <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.85)', lineHeight: 1.6, textAlign: 'center' }}>
            "{verdict}"
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.44rem', letterSpacing: '0.14em', color: 'rgba(196,144,32,0.4)', textAlign: 'center', marginTop: 8 }}>
            — SISTER WENDY
          </div>
        </div>

        {/* Hints used note */}
        {hintsUsed > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: 'rgba(196,144,32,0.4)', letterSpacing: '0.12em', textAlign: 'center', marginBottom: 12 }}>
            {hintsUsed} hint{hintsUsed !== 1 ? 's' : ''} consulted. Sister Wendy noticed.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 rounded-xl font-bold transition-all hover:scale-[1.02]"
            style={{
              fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', letterSpacing: '0.1em',
              background: '#c49020', color: '#0d0a06',
              border: 'none', cursor: 'pointer',
            }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onChangeDifficulty}
            className="flex-1 py-3 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.14em',
              background: 'transparent', color: 'rgba(245,234,216,0.6)',
              border: '1px solid rgba(196,144,32,0.25)', cursor: 'pointer',
            }}
          >
            CHANGE MODE
          </button>
        </div>

        {/* Cross-promo: other Screwcap games */}
        <div className="mt-5">
          <ScrewcapGamesStrip compact />
        </div>

        {/* Paid mid-game sponsor banner */}
        <div className="mt-4">
          <SponsorBanner />
        </div>

        {/* SPONSOR_HOOK: post-game partner attribution */}
        {sponsor && (
          <div className="mt-5 rounded-xl p-3 text-center"
            style={{ background: 'rgba(196,144,32,0.04)', border: '1px solid rgba(196,144,32,0.12)' }}>
            <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.75rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.5)', marginBottom: 4 }}>
              {sponsor.message}
            </p>
            {sponsor.ctaUrl && (
              <a
                href={sponsor.ctaUrl}
                target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.15em', color: '#c49020', textDecoration: 'none' }}
              >
                {sponsor.ctaLabel || 'LEARN MORE →'}
              </a>
            )}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.42rem', letterSpacing: '0.15em', color: 'rgba(196,144,32,0.35)', marginTop: 3 }}>
              THANK YOU TO OUR PARTNER: {sponsor.name.toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
