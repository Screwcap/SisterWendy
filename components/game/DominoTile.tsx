'use client';

import { useEffect, useRef } from 'react';
import { TileData } from '@/lib/game';
import { getTileFact } from '@/lib/wendy';
import gsap from 'gsap';

interface DominoTileProps {
  tile: TileData;
  isSelected?: boolean;
  isPlayable?: boolean;
  isDisabled?: boolean;
  isNew?: boolean;          // triggers entrance animation
  onClick?: () => void;
  onHover?: (fact: string) => void;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;       // board placement orientation
  showBack?: boolean;       // tile face-down (for back sponsor logo)
  sponsorLogoUrl?: string;
}

const PIP_POSITIONS: Record<number, Array<[number, number]>> = {
  0: [],
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]],
};

function PipFace({ value, cx, cy }: { value: number; cx: number; cy: number }) {
  const positions = PIP_POSITIONS[value] ?? [];
  const halfSize = 38;
  return (
    <g>
      {/* Face background */}
      <rect
        x={cx - halfSize} y={cy - halfSize}
        width={halfSize * 2} height={halfSize * 2}
        rx={4} fill="none"
      />
      {/* Pips */}
      {positions.map(([px, py], i) => (
        <circle
          key={i}
          cx={cx - halfSize + (px / 100) * halfSize * 2}
          cy={cy - halfSize + (py / 100) * halfSize * 2}
          r={value === 0 ? 0 : 5.5}
          fill="var(--pip-color, #f5ead8)"
        />
      ))}
    </g>
  );
}

const SIZE_MAP = {
  sm: { w: 44, h: 88,  r: 4,  pip: 5,  div: 1.5 },
  md: { w: 56, h: 112, r: 5,  pip: 6,  div: 2   },
  lg: { w: 72, h: 144, r: 6,  pip: 7.5, div: 2.5 },
};

export default function DominoTile({
  tile,
  isSelected = false,
  isPlayable = false,
  isDisabled = false,
  isNew = false,
  onClick,
  onHover,
  size = 'md',
  vertical = false,
  showBack = false,
  sponsorLogoUrl,
}: DominoTileProps) {
  const ref = useRef<SVGSVGElement>(null);
  const { w, h } = SIZE_MAP[size];

  useEffect(() => {
    if (isNew && ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.6, y: -12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: 'back.out(1.5)' }
      );
    }
  }, [isNew]);

  const svgW = vertical ? h : w;
  const svgH = vertical ? w : h;
  const midX  = vertical ? w / 2 : h / 2;

  // When tile.flipped, display as [b|a]
  const topVal  = tile.flipped ? tile.b : tile.a;
  const botVal  = tile.flipped ? tile.a : tile.b;

  const glowClass = isSelected
    ? 'drop-shadow-[0_0_10px_rgba(232,184,64,0.9)]'
    : isPlayable
    ? 'drop-shadow-[0_0_6px_rgba(74,154,143,0.7)]'
    : '';

  const cursorClass = onClick && !isDisabled ? 'cursor-pointer' : 'cursor-default';
  const opacityClass = isDisabled && !isSelected ? 'opacity-40' : 'opacity-100';

  function handleClick() {
    if (!isDisabled && onClick) onClick();
  }

  function handleMouseEnter() {
    if (onHover && !isDisabled) onHover(getTileFact(tile.a, tile.b));
    if (ref.current && isPlayable && !isDisabled) {
      gsap.to(ref.current, { y: -4, duration: 0.18, ease: 'power2.out' });
    }
  }
  function handleMouseLeave() {
    if (ref.current) gsap.to(ref.current, { y: 0, duration: 0.22, ease: 'power2.out' });
  }

  return (
    <svg
      ref={ref}
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={`transition-opacity select-none ${glowClass} ${cursorClass} ${opacityClass}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      aria-label={`Domino ${tile.a}-${tile.b}${isPlayable ? ', playable' : ''}${isSelected ? ', selected' : ''}`}
      tabIndex={onClick && !isDisabled ? 0 : -1}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      style={{ '--pip-color': isSelected ? '#0d0a06' : '#f5ead8' } as React.CSSProperties}
    >
      {showBack ? (
        /* Tile back — sponsor logo or default pattern */
        <g>
          <rect width={svgW} height={svgH} rx={6}
            fill="#1a1408" stroke={isSelected ? '#e8b840' : '#c49020'} strokeWidth={isSelected ? 2.5 : 1.5} />
          {sponsorLogoUrl ? (
            <image href={sponsorLogoUrl} x={svgW * 0.15} y={svgH * 0.15}
              width={svgW * 0.7} height={svgH * 0.7} preserveAspectRatio="xMidYMid meet" opacity={0.7} />
          ) : (
            /* Default back: brass diagonal hatching */
            <>
              <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#c49020" strokeWidth="0.8" opacity="0.3" />
              </pattern>
              <rect width={svgW} height={svgH} rx={6} fill="url(#hatch)" />
              <text x={svgW / 2} y={svgH / 2 + 4} textAnchor="middle"
                fill="#c49020" fontSize="10" fontFamily="'DM Mono', monospace" opacity={0.5}>SW</text>
            </>
          )}
        </g>
      ) : vertical ? (
        /* Vertical tile (board chain) */
        <g>
          <rect width={svgW} height={svgH} rx={6}
            fill={isSelected ? '#c49020' : '#1a1408'}
            stroke={isSelected ? '#e8b840' : isPlayable ? '#4a9a8f' : '#7a5a14'}
            strokeWidth={isSelected ? 2.5 : 1.5}
          />
          {/* Top half */}
          <PipFace value={topVal} cx={svgW / 2} cy={svgH / 4} />
          {/* Divider */}
          <line x1={6} y1={svgH / 2} x2={svgW - 6} y2={svgH / 2}
            stroke={isSelected ? '#0d0a06' : '#c49020'} strokeWidth={1} opacity={0.6} />
          {/* Bottom half */}
          <PipFace value={botVal} cx={svgW / 2} cy={(svgH * 3) / 4} />
        </g>
      ) : (
        /* Horizontal tile (hand) */
        <g>
          <rect width={svgW} height={svgH} rx={6}
            fill={isSelected ? '#c49020' : '#1a1408'}
            stroke={isSelected ? '#e8b840' : isPlayable ? '#4a9a8f' : '#7a5a14'}
            strokeWidth={isSelected ? 2.5 : 1.5}
          />
          {/* Left half */}
          <PipFace value={topVal} cx={svgW / 4} cy={svgH / 2} />
          {/* Divider */}
          <line x1={svgW / 2} y1={6} x2={svgW / 2} y2={svgH - 6}
            stroke={isSelected ? '#0d0a06' : '#c49020'} strokeWidth={1} opacity={0.6} />
          {/* Right half */}
          <PipFace value={botVal} cx={(svgW * 3) / 4} cy={svgH / 2} />
        </g>
      )}
    </svg>
  );
}
