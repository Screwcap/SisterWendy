'use client';

import { useEffect, useRef, useState } from 'react';
import { Player, GameMode } from '@/lib/game';
import { calcGrade, getVerdictText, wendyRelationshipLine } from '@/lib/wendy';
import { recordResult, type SWStats } from '@/lib/stats';
import { speak, voiceEnabled, setVoiceEnabled, voiceSupported } from '@/lib/voice';
import { adsConfigured, isAdFree, goAdFree, redeem, ADS } from '@/lib/ads';
import AdSlot from '@/components/AdSlot';
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

  // Record this game into the persistent meta-loop (once per game-over).
  const recordedRef = useRef(false);
  const [stats, setStats] = useState<SWStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [relLine, setRelLine] = useState('');
  const [voiceOn, setVoiceOn] = useState(false);
  const [adFree, setAdFreeState] = useState(true); // default true → no purchase-UI flash pre-hydration

  function handleShare() {
    const line = humanWon
      ? `I beat Sister Wendy at All-Fives dominoes — Grade ${grade}, ${human.score}–${opponent?.score ?? 0}. Think you can take the habit? 🎴`
      : `Beaten by a nun at dominoes. Sister Wendy ${opponent?.score ?? 0}, me ${human.score} (Grade ${grade}). 🎴`;
    const url = 'https://sisterwendy.com';
    const text = `${line} "${verdict}"`;
    try { (window as { plausible?: (e: string, o?: unknown) => void }).plausible?.('Share Card', { props: { game: 'sister-wendy', result: humanWon ? 'win' : 'loss', grade } }); } catch { /* analytics never blocks */ }
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'Sister Wendy Dominoes', text, url }).catch(() => { /* user cancelled */ });
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      }).catch(() => { /* clipboard blocked */ });
    }
  }
  useEffect(() => {
    setVoiceOn(voiceEnabled());
    setAdFreeState(isAdFree());
    if (recordedRef.current) return;
    recordedRef.current = true;
    const s = recordResult({ won: humanWon, score: human.score, grade });
    setStats(s);
    // The relationship deepens with games played (Epley depth>breadth)
    const rel = wendyRelationshipLine(s.played, opponent?.personalityId);
    setRelLine(rel);
    if (rel && voiceEnabled()) speak(rel, opponent?.personalityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {/* Voice effect (Epley): let her say it aloud */}
          {voiceSupported() && (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button
                onClick={() => { const on = !voiceOn; setVoiceOn(on); setVoiceEnabled(on); if (on) speak(relLine || verdict, opponent?.personalityId); }}
                style={{ background: 'transparent', border: '1px solid rgba(196,144,32,0.3)', color: 'rgba(196,144,32,0.8)', borderRadius: 999, padding: '4px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', cursor: 'pointer' }}
              >
                {voiceOn ? '🔊 WENDY’S VOICE: ON' : '🔇 HEAR WENDY’S VOICE'}
              </button>
            </div>
          )}
        </div>

        {/* The relationship deepens (Epley) — an earned, tier-based aside */}
        {relLine && (
          <div className="rounded-xl p-4 mb-5"
            style={{ background: 'rgba(74,154,143,0.06)', border: '1px solid rgba(74,154,143,0.18)' }}>
            <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.92rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.9)', lineHeight: 1.6, textAlign: 'center' }}>
              "{relLine}"
            </p>
          </div>
        )}

        {/* Post-game social nudge (Epley 2.3) — connection, not a growth hack */}
        <div style={{ textAlign: 'center', margin: '0 0 18px' }}>
          <p style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.82rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.6)', lineHeight: 1.5 }}>
            {humanWon
              ? 'That was a good one. Know someone who’d give me more of a challenge?'
              : 'Don’t sulk alone. Tell someone about the game you just lost — they’ll care more than you think.'}
          </p>
        </div>

        {/* Your record — the meta-loop */}
        {stats && (
          <div className="rounded-xl p-3 mb-5"
            style={{ background: 'rgba(26,20,8,0.5)', border: '1px solid rgba(196,144,32,0.12)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.2em', color: 'rgba(196,144,32,0.5)', textAlign: 'center', marginBottom: 8 }}>
              YOUR RECORD vs THE HABIT
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { v: `${stats.won}–${stats.lost}`, l: 'WON–LOST' },
                { v: stats.currentStreak > 0 ? `${stats.currentStreak}🔥` : '0', l: stats.bestStreak > 0 ? `STREAK · best ${stats.bestStreak}` : 'STREAK' },
                { v: stats.bestGrade || '—', l: 'BEST GRADE' },
                { v: stats.bestScore, l: 'HIGH SCORE' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: '#f5ead8', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.4rem', letterSpacing: '0.08em', color: 'rgba(196,144,32,0.4)', marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hints used note */}
        {hintsUsed > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: 'rgba(196,144,32,0.4)', letterSpacing: '0.12em', textAlign: 'center', marginBottom: 12 }}>
            {hintsUsed} hint{hintsUsed !== 1 ? 's' : ''} consulted. Sister Wendy noticed.
          </p>
        )}

        {/* Share — the viral hook */}
        <button
          onClick={handleShare}
          className="w-full py-3 rounded-xl mb-3 transition-all hover:scale-[1.02]"
          style={{
            fontFamily: 'var(--font-bebas)', fontSize: '1.05rem', letterSpacing: '0.12em',
            background: copied ? 'rgba(74,154,143,0.2)' : 'rgba(196,144,32,0.12)',
            color: copied ? '#4a9a8f' : '#e8b840',
            border: `1px solid ${copied ? 'rgba(74,154,143,0.5)' : 'rgba(196,144,32,0.4)'}`,
            cursor: 'pointer',
          }}
        >
          {copied ? 'COPIED — GO BRAG ✓' : '🎴 SHARE YOUR VERDICT'}
        </button>

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

        {/* Non-intrusive ad (game-over only, never during play) + ad-free unlock */}
        {!adFree && adsConfigured() && (
          <div className="mt-4">
            <AdSlot />
            <div style={{ textAlign: 'center', marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(245,234,216,0.5)' }}>
              <button
                onClick={goAdFree}
                style={{ background: 'transparent', border: '1px solid rgba(196,144,32,0.35)', color: 'rgba(196,144,32,0.85)', borderRadius: 999, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.62rem', letterSpacing: '0.06em' }}
              >
                ✦ Wendy&apos;s Blessing — Ad-Free + Hard Mode ({ADS.price})
              </button>
              <span style={{ opacity: 0.4 }}> · </span>
              <button
                onClick={async () => {
                  const code = window.prompt('Bought Wendy’s Blessing? Paste your Gumroad license key:');
                  if (code == null) return;
                  const ok = await redeem(code);
                  if (ok) setAdFreeState(true);
                  alert(ok ? 'Bless you. Premium unlocked — ads gone, Hard mode open. ✦' : 'Couldn’t verify that key — check it, or email play@screwcapholdings.com.');
                }}
                style={{ background: 'transparent', border: 'none', color: 'rgba(196,144,32,0.6)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.62rem', textDecoration: 'underline' }}
              >
                redeem code
              </button>
            </div>
          </div>
        )}

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
