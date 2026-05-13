'use client';

import { useRef, useEffect } from 'react';
import { BoardState, BoardEnd, boardIsEmpty } from '@/lib/game';
import DominoTile from './DominoTile';
import gsap from 'gsap';

interface BoardProps {
  board: BoardState;
  validEnds: BoardEnd[];         // ends the selected tile can play on
  awaitingEnd: boolean;          // player has selected a tile and must pick an end
  onEndClick: (end: BoardEnd) => void;
  latestTileId?: string;         // id of the just-played tile (triggers animation)
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

  // Scroll chain into view when it grows
  useEffect(() => {
    if (chainRef.current && board.chain.length > 0) {
      chainRef.current.scrollLeft = chainRef.current.scrollWidth;
    }
  }, [board.chain.length]);

  const showLeft  = awaitingEnd && (validEnds.includes('left')  || validEnds.includes('first'));
  const showRight = awaitingEnd && (validEnds.includes('right') || validEnds.includes('first'));

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Board surface */}
      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #221a08 0%, #0d0a06 100%)',
          border: '1px solid rgba(196,144,32,0.25)',
          boxShadow: 'inset 0 2px 30px rgba(0,0,0,0.5), 0 0 40px rgba(196,144,32,0.06)',
          minHeight: 160,
        }}
      >
        {/* Gear corner decoration */}
        <GearCorner className="absolute top-2 left-2 opacity-[0.07]" size={40} />
        <GearCorner className="absolute top-2 right-2 opacity-[0.07]" size={40} reverse />

        {boardIsEmpty(board) ? (
          <div className="flex items-center justify-center h-36 text-center">
            <p style={{ fontFamily: 'var(--font-garamond)', color: 'rgba(196,144,32,0.5)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              The board awaits your opening move.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-0 px-3 py-4 overflow-x-auto" ref={chainRef}
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(196,144,32,0.3) transparent' }}>

            {/* Left end zone */}
            <EndZone
              side="left"
              active={showLeft}
              onClick={() => onEndClick('left')}
              endpoint={board.leftEnd}
            />

            {/* Chain */}
            <div className="flex items-center gap-[2px] flex-shrink-0">
              {board.chain.map((tile, i) => (
                <DominoTile
                  key={tile.id}
                  tile={tile}
                  size="sm"
                  vertical
                  isNew={tile.id === latestTileId}
                  sponsorLogoUrl={sponsorLogoUrl}
                />
              ))}
            </div>

            {/* Right end zone */}
            <EndZone
              side="right"
              active={showRight}
              onClick={() => onEndClick('right')}
              endpoint={board.rightEnd}
            />
          </div>
        )}

        {/* Open ends display (non-interactive info strip) */}
        {!boardIsEmpty(board) && (
          <div className="flex justify-between px-4 pb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(196,144,32,0.55)', letterSpacing: '0.15em' }}>
            <span>← {board.leftEnd} OPEN</span>
            <span>{board.rightEnd} OPEN →</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── End Zone click target ──────────────────────────────────────────────────

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
      gsap.to(ref.current, { scale: 1.08, duration: 0.25, ease: 'power2.out', repeat: -1, yoyo: true });
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
        width: 36,
        height: 72,
        background: active
          ? 'rgba(74,154,143,0.25)'
          : 'rgba(196,144,32,0.04)',
        border: active
          ? '1.5px solid rgba(74,154,143,0.8)'
          : '1px dashed rgba(196,144,32,0.2)',
        cursor: active ? 'pointer' : 'default',
        margin: '0 4px',
      }}
      aria-label={active ? `Place tile on ${side}` : undefined}
    >
      {endpoint !== null && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: active ? '#4a9a8f' : 'rgba(196,144,32,0.4)' }}>
          {endpoint}
        </span>
      )}
      {active && (
        <span style={{ fontSize: '0.55rem', color: '#4a9a8f', letterSpacing: '0.1em', marginTop: 2 }}>
          {side === 'left' ? '←' : '→'}
        </span>
      )}
    </button>
  );
}

// ── Decorative gear corner ──────────────────────────────────────────────────

function GearCorner({ size, reverse, className }: { size: number; reverse?: boolean; className?: string }) {
  const teeth = 10;
  const r = size * 0.38;
  const rOuter = size * 0.5;
  const toothH = size * 0.12;
  const points = Array.from({ length: teeth * 2 }, (_, i) => {
    const angle = (i * Math.PI) / teeth;
    const rad = i % 2 === 0 ? rOuter : rOuter - toothH;
    return `${size / 2 + Math.cos(angle) * rad},${size / 2 + Math.sin(angle) * rad}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className}
      style={{ animation: `gear-${reverse ? 'ccw' : 'cw'} 20s linear infinite` }}>
      <polygon points={points} fill="#c49020" />
      <circle cx={size / 2} cy={size / 2} r={r * 0.45} fill="#0d0a06" />
    </svg>
  );
}
