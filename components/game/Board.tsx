'use client';

import { useRef, useEffect } from 'react';
import { BoardState, BoardEnd, boardIsEmpty, isDouble } from '@/lib/game';
import DominoTile from './DominoTile';
import gsap from 'gsap';

interface BoardProps {
  board: BoardState;
  validEnds: BoardEnd[];
  awaitingEnd: boolean;
  onEndClick: (end: BoardEnd) => void;
  latestTileId?: string;
  sponsorLogoUrl?: string;
}

export default function Board({
  board,
  validEnds,
  awaitingEnd,
  onEndClick,
  latestTileId,
  sponsorLogoUrl,
}: BoardProps) {
  const chainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chainRef.current && board.chain.length > 0) {
      chainRef.current.scrollLeft = chainRef.current.scrollWidth;
    }
  }, [board.chain.length]);

  const showLeft  = awaitingEnd && (validEnds.includes('left')  || validEnds.includes('first'));
  const showRight = awaitingEnd && (validEnds.includes('right') || validEnds.includes('first'));

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Board — green baize felt */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1e5c2e 0%, #174d25 60%, #123f1e 100%)',
          border: '3px solid #1a0e06',
          // last inset = the vignette (see globals.css note)
          boxShadow:
            'inset 0 6px 30px rgba(0,0,0,0.45), inset 0 -4px 16px rgba(0,20,5,0.4), inset 4px 0 16px rgba(0,0,0,0.2), inset -4px 0 16px rgba(0,0,0,0.2), inset 0 0 90px 26px rgba(0,0,0,0.34), 0 8px 24px rgba(0,0,0,0.5)',
          minHeight: 170,
        }}
      >
        {/* Felt grain — fibre noise over the ruled weave (see globals.css) */}
        <div
          className="absolute inset-0 pointer-events-none felt-grain"
          style={{ borderRadius: 'inherit' }}
        />

        {/* Corner pip decoration */}
        <div className="absolute top-3 left-3 opacity-10">
          <CornerPip />
        </div>
        <div className="absolute top-3 right-3 opacity-10" style={{ transform: 'rotate(90deg)' }}>
          <CornerPip />
        </div>
        <div className="absolute bottom-3 left-3 opacity-10" style={{ transform: 'rotate(270deg)' }}>
          <CornerPip />
        </div>
        <div className="absolute bottom-3 right-3 opacity-10" style={{ transform: 'rotate(180deg)' }}>
          <CornerPip />
        </div>

        {boardIsEmpty(board) ? (
          <div className="flex items-center justify-center" style={{ height: 170 }}>
            <p
              style={{
                fontFamily: 'var(--font-garamond)',
                color: 'rgba(214,245,220,0.78)',
                fontSize: '1.05rem',
                fontStyle: 'italic',
              }}
            >
              Right then. Who's going first.
            </p>
          </div>
        ) : (
          <div
            ref={chainRef}
            className="flex items-center px-4 py-5 overflow-x-auto gap-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(196,144,32,0.4) transparent',
              minHeight: 140,
            }}
          >
            {/* Left end zone */}
            <EndZone side="left" active={showLeft} onClick={() => onEndClick('left')} endpoint={board.leftEnd} />

            {/* Chain — landscape tiles; doubles rotate 90° to go perpendicular */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {board.chain.map(tile => {
                const double_ = isDouble(tile);
                // sm SIZE_MAP: pip=36, long=74 — swap dims for the wrapper so the
                // rotated tile sits inside a portrait bounding box in the flex row
                if (double_) {
                  return (
                    <div
                      key={tile.id}
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{ width: 36, height: 74 }}
                    >
                      <DominoTile
                        tile={tile}
                        flipId={`tile-${tile.id}`}
                        size="sm"
                        vertical={false}
                        crosswise
                        isNew={tile.id === latestTileId}
                        sponsorLogoUrl={sponsorLogoUrl}
                      />
                    </div>
                  );
                }
                return (
                  <DominoTile
                    key={tile.id}
                    tile={tile}
                    flipId={`tile-${tile.id}`}
                    size="sm"
                    vertical={false}
                    isNew={tile.id === latestTileId}
                    sponsorLogoUrl={sponsorLogoUrl}
                  />
                );
              })}
            </div>

            {/* Right end zone */}
            <EndZone side="right" active={showRight} onClick={() => onEndClick('right')} endpoint={board.rightEnd} />
          </div>
        )}

        {/* Open ends strip */}
        {!boardIsEmpty(board) && (
          <div
            className="flex justify-between px-5 pb-2"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: 'rgba(214,245,220,0.9)',
              textShadow: '0 1px 3px rgba(0,0,0,0.7)',
              letterSpacing: '0.15em',
            }}
          >
            <span>← {board.leftEnd} OPEN</span>
            <span>{board.rightEnd} OPEN →</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── End Zone ──────────────────────────────────────────────────────────────────

function EndZone({
  side,
  active,
  onClick,
  endpoint,
}: {
  side: 'left' | 'right';
  active: boolean;
  onClick: () => void;
  endpoint: number | null;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (active) {
      gsap.to(ref.current, { scale: 1.1, duration: 0.3, ease: 'power2.out', repeat: -1, yoyo: true });
    } else {
      gsap.killTweensOf(ref.current);
      gsap.to(ref.current, { scale: 1, duration: 0.2 });
    }
  }, [active]);

  return (
    <button
      ref={ref}
      onClick={active ? onClick : undefined}
      className="flex-shrink-0 flex flex-col items-center justify-center rounded-lg transition-colors"
      style={{
        width: 40,
        height: 74,
        background: active
          ? 'rgba(232,184,64,0.25)'
          : 'rgba(255,255,255,0.05)',
        border: active
          ? '2px solid rgba(232,184,64,0.85)'
          : '1.5px dashed rgba(200,240,200,0.2)',
        cursor: active ? 'pointer' : 'default',
        margin: '0 4px',
        gap: 4,
      }}
      aria-label={active ? `Place tile on ${side} end` : undefined}
    >
      {endpoint !== null && (
        <span
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '1.3rem',
            color: active ? '#e8b840' : 'rgba(200,240,200,0.35)',
            lineHeight: 1,
          }}
        >
          {endpoint}
        </span>
      )}
      {active && (
        <span style={{ fontSize: '0.85rem', color: '#e8b840' }}>
          {side === 'left' ? '←' : '→'}
        </span>
      )}
    </button>
  );
}

// ── Corner decoration ─────────────────────────────────────────────────────────

function CornerPip() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="4" fill="#e8f5e0" />
      <circle cx="3" cy="3" r="2" fill="#e8f5e0" />
      <circle cx="15" cy="3" r="2" fill="#e8f5e0" />
    </svg>
  );
}
