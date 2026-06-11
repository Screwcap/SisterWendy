'use client';

// Screwcap cross-promo + optional paid ad slot.
// Drop <ScrewcapGamesStrip /> anywhere for the house games bar.
// Drop <SponsorBanner slot="postGame" /> to render a paid placement from SPONSOR_CONFIG.

import { SPONSOR_CONFIG } from '@/lib/sponsor';

const SCREWCAP_GAMES = [
  {
    id: 'double-fives',
    name: 'DOUBLE FIVES',
    tagline: 'The full ML beast. Four players. Carnage.',
    color: '#d4507a',
    href: 'https://screwcap.games', // pre-launch — send to hub/waitlist
  },
  {
    id: 'the-chair',
    name: 'THE CHAIR',
    tagline: 'Strategic. Brutal. Comfortable.',
    color: '#4a9a8f',
    href: 'https://thechair.vercel.app',
  },
  {
    id: 'fly-macro',
    name: 'FLYMACROPILOT',
    tagline: 'Macro games. Micro decisions.',
    color: '#c49020',
    href: 'https://flymacropilot.vercel.app',
  },
  {
    id: 'dttau',
    name: 'DTTAU',
    tagline: 'Do Things That Add Up. A lifetime, tracked.',
    color: '#5aa9e6',
    href: 'https://dttau.app',
  },
  {
    id: 'sutda',
    name: 'SUTDA',
    tagline: 'Korean card bluffing. Beautiful. Ruthless.',
    color: '#d4507a',
    href: 'https://www.sutda.games',
  },
] as const;

export function ScrewcapGamesStrip({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        borderTop: '1px solid rgba(196,144,32,0.18)',
        paddingTop: compact ? 12 : 20,
        marginTop: compact ? 8 : 0,
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: compact ? '0.72rem' : '0.85rem',
        letterSpacing: '0.28em',
        color: 'rgba(232,184,64,0.82)',
        textAlign: 'center',
        marginBottom: compact ? 12 : 18,
      }}>
        MORE FROM SCREWCAP
      </div>

      <div style={{
        display: 'flex',
        gap: compact ? 8 : 12,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {SCREWCAP_GAMES.map(game => (
          <a
            key={game.id}
            href={game.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              background: 'rgba(26,20,8,0.7)',
              border: `1px solid ${game.color}44`,
              borderRadius: 10,
              padding: compact ? '8px 14px' : '12px 20px',
              minWidth: compact ? 90 : 120,
              flex: '1 1 auto',
              maxWidth: 180,
              transition: 'border-color 0.2s, background 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = `${game.color}99`;
              (e.currentTarget as HTMLElement).style.background = 'rgba(26,20,8,0.95)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = `${game.color}44`;
              (e.currentTarget as HTMLElement).style.background = 'rgba(26,20,8,0.7)';
            }}
          >
            <span style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: compact ? '0.85rem' : '1rem',
              letterSpacing: '0.1em',
              color: game.color,
              lineHeight: 1,
              marginBottom: 4,
            }}>
              {game.name}
            </span>
            {!compact && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.52rem',
                color: 'rgba(245,234,216,0.45)',
                textAlign: 'center',
                lineHeight: 1.4,
                letterSpacing: '0.04em',
              }}>
                {game.tagline}
              </span>
            )}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.48rem',
              color: `${game.color}99`,
              letterSpacing: '0.15em',
              marginTop: 6,
            }}>
              PLAY →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// Paid sponsor banner — reads from SPONSOR_CONFIG.midGameBanner
export function SponsorBanner() {
  const sponsor = SPONSOR_CONFIG.midGameBanner;
  if (!sponsor) return null;

  return (
    <div
      style={{
        borderRadius: 10,
        padding: '10px 18px',
        background: 'rgba(196,144,32,0.04)',
        border: '1px solid rgba(196,144,32,0.18)',
        textAlign: 'center',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.44rem',
        letterSpacing: '0.22em',
        color: 'rgba(196,144,32,0.35)',
        marginBottom: 4,
      }}>
        PRESENTED BY
      </div>
      <div style={{
        fontFamily: 'var(--font-bebas)',
        fontSize: '1rem',
        letterSpacing: '0.1em',
        color: '#c49020',
        marginBottom: 4,
      }}>
        {sponsor.name}
      </div>
      <p style={{
        fontFamily: 'var(--font-garamond)',
        fontSize: '0.72rem',
        fontStyle: 'italic',
        color: 'rgba(245,234,216,0.55)',
        lineHeight: 1.4,
        marginBottom: sponsor.ctaUrl ? 8 : 0,
      }}>
        {sponsor.message}
      </p>
      {sponsor.ctaUrl && (
        <a
          href={sponsor.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.14em',
            color: '#e8b840',
            textDecoration: 'none',
          }}
        >
          {sponsor.ctaLabel ?? 'LEARN MORE →'}
        </a>
      )}
    </div>
  );
}
