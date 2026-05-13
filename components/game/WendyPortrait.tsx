'use client';

import { useEffect, useRef } from 'react';
import { WendyMood } from '@/lib/game';
import gsap from 'gsap';

interface WendyPortraitProps {
  mood: WendyMood;
  speech: string;
  artFact?: string;
  playerName?: string;
}

const MOOD_COLORS: Record<WendyMood, string> = {
  neutral:     '#c49020',
  pleased:     '#4a9a8f',
  disappointed:'#7a5a14',
  suspicious:  '#d4507a',
  triumphant:  '#e8b840',
  amused:      '#6b46c1',
};

// SVG Sister Wendy face — stylised nun portrait
function NunFace({ mood }: { mood: WendyMood }) {
  const accent = MOOD_COLORS[mood];
  const eyeY = mood === 'amused' ? 62 : mood === 'triumphant' ? 60 : 63;
  const browY = mood === 'suspicious' ? 52 : mood === 'disappointed' ? 55 : 54;
  const mouthPath = mood === 'pleased' || mood === 'triumphant'
    ? 'M 78 80 Q 88 87 98 80'
    : mood === 'amused'
    ? 'M 76 78 Q 88 88 100 78'
    : mood === 'disappointed'
    ? 'M 78 83 Q 88 77 98 83'
    : 'M 78 81 Q 88 85 98 81';

  return (
    <svg viewBox="0 0 176 220" width="88" height="110" aria-hidden>
      {/* Habit (veil) */}
      <ellipse cx="88" cy="90" rx="74" ry="88" fill="#1a1408" />
      <ellipse cx="88" cy="90" rx="60" ry="74" fill="#0d0a06" />
      {/* White wimple */}
      <ellipse cx="88" cy="110" rx="46" ry="62" fill="#f5ead8" />
      {/* Face */}
      <ellipse cx="88" cy="95" rx="36" ry="40" fill="#e8d4b8" />
      {/* Eyes */}
      <ellipse cx="78" cy={eyeY} rx={mood === 'suspicious' ? 5 : 4} ry={mood === 'suspicious' ? 3.5 : 4} fill="#2c1a0e" />
      <ellipse cx="98" cy={eyeY} rx={mood === 'suspicious' ? 5 : 4} ry={mood === 'suspicious' ? 3.5 : 4} fill="#2c1a0e" />
      {/* Glasses */}
      <circle cx="78" cy={eyeY} r="8" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.7" />
      <circle cx="98" cy={eyeY} r="8" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.7" />
      <line x1="86" y1={eyeY} x2="90" y2={eyeY} stroke={accent} strokeWidth="1" opacity="0.7" />
      {/* Brows */}
      <path
        d={`M 70 ${browY} Q 78 ${browY - (mood === 'suspicious' ? 4 : 2)} 86 ${browY}`}
        fill="none" stroke="#5c3d28" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        d={`M 90 ${browY} Q 98 ${browY - (mood === 'suspicious' ? 4 : 2)} 106 ${browY}`}
        fill="none" stroke="#5c3d28" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Mouth */}
      <path d={mouthPath} fill="none" stroke="#8b4a2a" strokeWidth="1.8" strokeLinecap="round" />
      {/* Cross necklace */}
      <line x1="88" y1="148" x2="88" y2="168" stroke={accent} strokeWidth="1.5" />
      <line x1="82" y1="156" x2="94" y2="156" stroke={accent} strokeWidth="1.5" />
      <circle cx="88" cy="170" r="2" fill={accent} opacity="0.7" />
      {/* Mood glow */}
      {(mood === 'triumphant' || mood === 'pleased') && (
        <ellipse cx="88" cy="90" rx="42" ry="46" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      )}
    </svg>
  );
}

export default function WendyPortrait({ mood, speech, artFact }: WendyPortraitProps) {
  const speechRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!speechRef.current) return;
    gsap.fromTo(
      speechRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [speech]);

  useEffect(() => {
    if (!portraitRef.current) return;
    if (mood === 'triumphant') {
      gsap.to(portraitRef.current, { y: -4, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' });
    } else if (mood === 'disappointed') {
      gsap.to(portraitRef.current, { x: -3, duration: 0.12, repeat: 3, yoyo: true, ease: 'none' });
    }
  }, [mood]);

  const moodColor = MOOD_COLORS[mood];

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Portrait */}
      <div
        ref={portraitRef}
        className="relative rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(196,144,32,0.08) 0%, #0d0a06 70%)',
          border: `1px solid ${moodColor}44`,
          width: 100, height: 120,
          transition: 'border-color 0.4s',
        }}
      >
        <NunFace mood={mood} />
        {/* Mood indicator dot */}
        <div style={{
          position: 'absolute', bottom: 6, right: 6,
          width: 8, height: 8, borderRadius: '50%',
          background: moodColor,
          boxShadow: `0 0 6px ${moodColor}`,
          transition: 'background 0.4s, box-shadow 0.4s',
        }} />
      </div>

      {/* Name plate */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
        letterSpacing: '0.18em', color: 'rgba(196,144,32,0.6)',
        textTransform: 'uppercase',
      }}>
        Sister Wendy
      </div>

      {/* Speech bubble */}
      <div
        ref={speechRef}
        className="w-full rounded-lg p-3 relative"
        style={{
          background: 'rgba(26,20,8,0.9)',
          border: `1px solid ${moodColor}33`,
          minHeight: 56,
        }}
      >
        {/* Tail */}
        <div style={{
          position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: `8px solid ${moodColor}33`,
        }} />
        <p style={{
          fontFamily: 'var(--font-garamond)',
          fontSize: '0.78rem', fontStyle: 'italic',
          color: 'rgba(245,234,216,0.88)',
          lineHeight: 1.5,
        }}>
          "{speech}"
        </p>
      </div>

      {/* Art fact pill (shown on tile hover) */}
      {artFact && (
        <div
          className="w-full rounded-lg p-2 mt-1"
          style={{
            background: 'rgba(74,154,143,0.08)',
            border: '1px solid rgba(74,154,143,0.2)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.44rem', letterSpacing: '0.15em', color: '#4a9a8f', marginBottom: 3 }}>
            ART HISTORY NOTE
          </div>
          <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.7rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.75)', lineHeight: 1.4 }}>
            {artFact}
          </p>
        </div>
      )}
    </div>
  );
}
