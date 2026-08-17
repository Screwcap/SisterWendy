'use client';

import { Player } from '@/lib/game';
import { SPONSOR_CONFIG } from '@/lib/sponsor';
import BoneyardStack from './BoneyardStack';

interface ScorePanelProps {
  players: Player[];
  currentPlayerIndex: number;
  boneyard: number;
  round: number;
  targetScore?: number;
}

export default function ScorePanel({
  players,
  currentPlayerIndex,
  boneyard,
  round,
  targetScore,
}: ScorePanelProps) {
  const TARGET = targetScore ?? 61;

  const sponsor = SPONSOR_CONFIG.scoreBadge;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: 'rgba(26,20,8,0.85)',
        // Gold frame: a solid gold edge, then a dark hairline and a second gold
        // line set in from it — the double rule of a framed prayer card, rather
        // than one apologetic 20%-opacity border.
        border: '1px solid rgba(196,144,32,0.62)',
        boxShadow: [
          'inset 0 0 0 1px rgba(10,7,3,0.85)',
          'inset 0 0 0 2px rgba(196,144,32,0.26)',
          'inset 0 1px 0 rgba(245,234,216,0.06)',
          '0 6px 22px rgba(0,0,0,0.45)',
        ].join(', '),
      }}
    >
      {/* Round info. nowrap + wrap on the row: with the panel's padding
          restored there isn't always room for both on one line, and without
          this each label broke mid-phrase ("ROUND BONEYARD: / 1  14"). */}
      <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 mb-3">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.14em', color: 'rgba(230,192,102,0.88)', whiteSpace: 'nowrap' }}>
          ROUND {round}
        </span>
        <BoneyardStack count={boneyard} />
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
                {/* Andrew, 17 Aug: "update the scoring to have it just 1 time,
                    not have it on side & top bar."

                    The score used to be printed twice as a NUMERAL, so the
                    first pass moved the numeral to the top nav and left a % of
                    target here. That was still the same fact stated twice in
                    two units, and he read it as scoring in two places — because
                    it is. The figure now lives ONLY in HeaderScore. What is
                    left in this panel is shape, not score: how far along the bar
                    each player is, which is the one thing the numeral can't
                    show. */}
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
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(214,172,86,0.72)', letterSpacing: '0.1em' }}>
                  0
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(214,172,86,0.72)', letterSpacing: '0.1em' }}>
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
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
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
