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
  isNew?: boolean;
  isShaking?: boolean;
  onClick?: () => void;
  onHover?: (fact: string) => void;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;      // true = portrait (tall/narrow); false = landscape (wide/short)
  crosswise?: boolean;     // rotate 90° — for doubles displayed perpendicular in the chain
  flipId?: string;         // sets data-flip-id for GSAP FLIP animations
  showBack?: boolean;
  sponsorLogoUrl?: string;
}

// Pip positions as [x%, y%] within the square pip face, laid out for a PORTRAIT
// tile (the way you'd hold one): the 6 reads as two columns of three.
const PIP_POSITIONS: Record<number, Array<[number, number]>> = {
  0: [],
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 20], [72, 20], [28, 50], [72, 50], [28, 80], [72, 80]],
};

// Lay a tile on its side and the pips turn with it — a 6 becomes three columns
// of two, not two columns of three. Rotate the portrait layout 90° clockwise.
const rotate90 = ([x, y]: [number, number]): [number, number] => [100 - y, x];

function pipsFor(value: number, vertical: boolean): Array<[number, number]> {
  const positions = PIP_POSITIONS[value] ?? [];
  return vertical ? positions : positions.map(rotate90);
}

// pip_size = square dimension of each half-face
const SIZE_MAP = {
  sm: { pip: 36, r: 5, pipR: 4.0 },
  md: { pip: 50, r: 7, pipR: 5.6 },
  lg: { pip: 64, r: 8, pipR: 7.0 },
};

function PipFace({
  value,
  pipSize,
  pipRadius,
  dark,
  vertical,
}: {
  value: number;
  pipSize: number;
  pipRadius: number;
  dark: boolean;
  vertical: boolean;
}) {
  const positions = pipsFor(value, vertical);
  return (
    <div style={{ position: 'relative', width: pipSize, height: pipSize, flexShrink: 0 }}>
      {positions.map(([px, py], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: pipRadius * 2,
            height: pipRadius * 2,
            borderRadius: '50%',
            background: dark
              ? 'radial-gradient(circle at 38% 35%, #8a6010, #3d2000)'
              : 'radial-gradient(circle at 38% 35%, #3d2410, #080400)',
            left: `calc(${px}% - ${pipRadius}px)`,
            top: `calc(${py}% - ${pipRadius}px)`,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.12), 0 1px 2px rgba(0,0,0,0.55)',
          }}
        />
      ))}
    </div>
  );
}

export default function DominoTile({
  tile,
  isSelected = false,
  isPlayable = false,
  isDisabled = false,
  isNew = false,
  isShaking = false,
  onClick,
  onHover,
  size = 'md',
  vertical = false,
  crosswise = false,
  flipId,
  showBack = false,
  sponsorLogoUrl,
}: DominoTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { pip, r, pipR } = SIZE_MAP[size];

  useEffect(() => {
    if (isNew && ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.55, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }
      );
    }
  }, [isNew]);

  useEffect(() => {
    if (isShaking && ref.current) {
      gsap.killTweensOf(ref.current);
      gsap.fromTo(ref.current,
        { x: 0 },
        { x: 7, duration: 0.055, repeat: 7, yoyo: true, ease: 'power2.inOut',
          onComplete: () => { if (ref.current) gsap.set(ref.current, { x: 0 }); } }
      );
    }
  }, [isShaking]);

  const topVal = tile.flipped ? tile.b : tile.a;
  const botVal = tile.flipped ? tile.a : tile.b;

  // Tile dimensions: portrait = pip × (pip*2+2), landscape = (pip*2+2) × pip
  const GAP = 2; // divider thickness
  const tileW = vertical ? pip : pip * 2 + GAP;
  const tileH = vertical ? pip * 2 + GAP : pip;

  // 3D shadow — baseline + glow ring when selected/playable
  const shadow = isSelected
    ? '0 0 0 2.5px #e8b840, 0 6px 16px rgba(0,0,0,0.55), 0 2px 5px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.35)'
    : isPlayable
    ? '0 0 0 2px #4a9a8f, 0 6px 16px rgba(0,0,0,0.55), 0 2px 5px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.6)'
    : '0 5px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.35), inset 0 1px 3px rgba(255,255,255,0.65), inset -1px -1px 3px rgba(0,0,0,0.08)';

  const faceBackground = isSelected
    ? 'linear-gradient(145deg, #ddb030 0%, #c49020 55%, #a87018 100%)'
    : 'linear-gradient(145deg, #fbf7e8 0%, #f2ecd6 55%, #e6dfc4 100%)';

  const borderColor = isSelected ? '#8a6010' : '#1e1006';
  const dividerColor = isSelected ? '#a07818' : '#1e1006';

  // Breathing hint on tiles you can actually play (Forgiving mode only — Hand
  // passes isPlayable=false when hints are off). Never on the selected tile.
  const pulses = isPlayable && !isSelected && !isDisabled;

  function handleClick() {
    if (!isDisabled && onClick) onClick();
  }
  function handleMouseEnter() {
    if (onHover && !isDisabled) onHover(getTileFact(tile.a, tile.b));
    // the CSS pulse animates box-shadow and would outrank the hover tween
    if (pulses && ref.current) ref.current.classList.remove('tile-playable');
    if (ref.current && onClick && !isDisabled) {
      gsap.to(ref.current, {
        y: -8,
        // gold rim + a soft bloom, so the lift reads as "lit", not just moved
        boxShadow: '0 0 0 2px rgba(196,144,32,0.55), 0 0 18px rgba(232,184,64,0.38), 0 14px 28px rgba(0,0,0,0.65), 0 4px 8px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.55)',
        duration: 0.18,
        ease: 'power2.out',
      });
    }
  }
  function handleMouseLeave() {
    if (ref.current) gsap.to(ref.current, { y: 0, boxShadow: shadow, duration: 0.22, ease: 'power2.out' });
    // resume the breathing hint once the hand is left alone again
    if (pulses && ref.current) ref.current.classList.add('tile-playable');
  }

  const baseStyle: React.CSSProperties = {
    width: tileW,
    height: tileH,
    borderRadius: r,
    border: `2px solid ${borderColor}`,
    background: faceBackground,
    boxShadow: shadow,
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flexShrink: 0,
    userSelect: 'none',
    opacity: isDisabled && !isSelected ? 0.45 : 1,
    cursor: onClick && !isDisabled ? 'pointer' : 'default',
    transition: 'opacity 0.2s',
    ...(crosswise && { transform: 'rotate(90deg)' }),
  };

  const dividerStyle: React.CSSProperties = {
    width: vertical ? '80%' : GAP,
    height: vertical ? GAP : '80%',
    background: dividerColor,
    opacity: 0.7,
    flexShrink: 0,
  };

  if (showBack) {
    return (
      <div
        ref={ref}
        data-flip-id={flipId}
        style={{
          ...baseStyle,
          background: 'linear-gradient(145deg, #1e1408 0%, #140e04 100%)',
          border: `2px solid ${isSelected ? '#e8b840' : '#4a3010'}`,
          boxShadow: '0 5px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.35)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {sponsorLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sponsorLogoUrl} alt="" style={{ width: '60%', height: '60%', objectFit: 'contain', opacity: 0.7 }} />
        ) : (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: pip * 0.2, color: 'rgba(196,144,32,0.45)', letterSpacing: '0.1em' }}>SW</span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-flip-id={flipId}
      className={pulses ? 'tile-playable' : undefined}
      style={baseStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      aria-label={`Domino ${tile.a}-${tile.b}${isPlayable ? ', playable' : ''}${isSelected ? ', selected' : ''}`}
      tabIndex={onClick && !isDisabled ? 0 : -1}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <PipFace value={topVal} pipSize={pip} pipRadius={pipR} dark={isSelected} vertical={vertical} />
      <div style={dividerStyle} />
      <PipFace value={botVal} pipSize={pip} pipRadius={pipR} dark={isSelected} vertical={vertical} />
    </div>
  );
}
