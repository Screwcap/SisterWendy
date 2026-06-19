'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { WendyMood } from '@/lib/game';
import { PERSONALITIES } from '@/lib/wendy';
import { speak, voiceEnabled, voiceSupported } from '@/lib/voice';
import gsap from 'gsap';

// Sister Wendy — full set of distinct mood portraits (pleased reuses the amused art).
const MOOD_PORTRAIT: Record<WendyMood, string> = {
  neutral:      '/wendy-neutral.webp',
  pleased:      '/wendy-pleased.webp',
  disappointed: '/wendy-disappointed.webp',
  suspicious:   '/wendy-suspicious.webp',
  triumphant:   '/wendy-triumphant.webp',
  amused:       '/wendy-amused.webp',
};

// Rival nuns have their own face (one each); they override the mood map.
const CHARACTER_PORTRAIT: Record<string, string> = {
  patricia:  '/patricia-neutral.webp',
  hildegard: '/hildegard-neutral.webp',
};

function portraitFor(personalityId: string | undefined, mood: WendyMood): string {
  if (personalityId && CHARACTER_PORTRAIT[personalityId]) return CHARACTER_PORTRAIT[personalityId];
  return MOOD_PORTRAIT[mood];
}

interface WendyPortraitProps {
  mood: WendyMood;
  speech: string;
  artFact?: string;
  playerName?: string;
  personalityId?: string;
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

export default function WendyPortrait({ mood, speech, artFact, personalityId }: WendyPortraitProps) {
  const speechRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const personality = PERSONALITIES[personalityId as keyof typeof PERSONALITIES] ?? PERSONALITIES.wendy;
  const displayName = personality.name;

  useEffect(() => {
    if (!speechRef.current) return;
    gsap.fromTo(
      speechRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
    // Voice effect (Epley): speak her line aloud when the player has opted in.
    if (speech && voiceEnabled()) speak(speech, personalityId);
  }, [speech, personalityId]);

  useEffect(() => {
    if (!portraitRef.current) return;
    if (mood === 'triumphant') {
      gsap.to(portraitRef.current, { y: -4, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' });
    } else if (mood === 'disappointed') {
      gsap.to(portraitRef.current, { x: -3, duration: 0.12, repeat: 3, yoyo: true, ease: 'none' });
    }
  }, [mood]);

  const moodColor = MOOD_COLORS[mood];
  const accentColor = personality.accentColor;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Portrait */}
      <div
        ref={portraitRef}
        className="relative rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${accentColor}14 0%, #0d0a06 70%)`,
          border: `2px solid ${accentColor}88`,
          width: 110, height: 132,
          transition: 'border-color 0.4s',
        }}
      >
        <Image
          src={portraitFor(personalityId, mood)}
          alt={`${displayName} portrait`}
          width={110}
          height={132}
          style={{ objectFit: 'cover', objectPosition: 'top', transition: 'opacity 0.3s' }}
          priority
        />
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
        fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
        letterSpacing: '0.18em', color: `${accentColor}99`,
        textTransform: 'uppercase',
      }}>
        {displayName}
      </div>

      {/* Speech bubble */}
      <div
        ref={speechRef}
        className="w-full rounded-lg p-4 relative"
        style={{
          background: 'rgba(26,20,8,0.9)',
          border: `1px solid ${accentColor}44`,
          minHeight: 56,
        }}
      >
        {/* Tail */}
        <div style={{
          position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: `8px solid ${accentColor}44`,
        }} />
        <p style={{
          fontFamily: 'var(--font-garamond)',
          fontSize: '0.9rem', fontStyle: 'italic',
          color: 'rgba(245,234,216,0.88)',
          lineHeight: 1.5,
          paddingRight: 22,
        }}>
          "{speech}"
        </p>
        {/* Hear her say it (Epley voice effect). Tap to play this line. */}
        {voiceSupported() && speech && (
          <button
            onClick={() => speak(speech, personalityId)}
            aria-label="Hear Sister Wendy say this"
            title="Hear it"
            style={{
              position: 'absolute', top: 6, right: 6,
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '0.95rem', lineHeight: 1, opacity: 0.55, padding: 2,
              color: accentColor,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
          >🔊</button>
        )}
      </div>

      {/* Art fact pill (shown on tile hover) */}
      {artFact && (
        <div
          className="w-full rounded-lg p-3 mt-1"
          style={{
            background: 'rgba(74,154,143,0.08)',
            border: '1px solid rgba(74,154,143,0.2)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', color: '#4a9a8f', marginBottom: 3 }}>
            ART HISTORY NOTE
          </div>
          <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.82rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.75)', lineHeight: 1.4 }}>
            {artFact}
          </p>
        </div>
      )}
    </div>
  );
}
