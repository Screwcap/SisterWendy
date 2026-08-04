'use client';

import { useState } from 'react';
import { ADS, goPremium, redeem } from '@/lib/ads';

/**
 * Wendy's Blessing — the premium unlock (price lives in lib/ads.ts).
 * Ad-free + Focused (Hard) mode, lifetime for this version.
 * Self-contained: Gumroad checkout button + "restore purchase" license redeem.
 */
export default function PremiumModal({
  onClose,
  onUnlocked,
}: {
  onClose: () => void;
  onUnlocked: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleRedeem() {
    const code = window.prompt('Bought Wendy’s Blessing? Paste your Gumroad license key:');
    if (code == null) return;
    setBusy(true); setMsg('');
    const ok = await redeem(code);
    setBusy(false);
    if (ok) { onUnlocked(); }
    else setMsg('Couldn’t verify that key — check it, or email play@screwcapholdings.com.');
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(5,4,2,0.82)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 400,
          background: 'linear-gradient(180deg,#16110a 0%,#0d0a06 100%)',
          border: '2px solid rgba(196,144,32,0.5)', borderRadius: 18,
          padding: '28px 26px', textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.32em', color: 'rgba(196,144,32,0.6)', marginBottom: 10 }}>
          WENDY&apos;S BLESSING
        </div>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.2rem', letterSpacing: '0.06em', color: '#e8b840', lineHeight: 1 }}>
          GO PREMIUM
        </div>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: '#f5ead8', marginTop: 4 }}>
          {ADS.price} <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', color: 'rgba(245,234,216,0.45)' }}>· ONE-TIME · LIFETIME</span>
        </div>

        <div style={{ textAlign: 'left', margin: '20px auto 22px', maxWidth: 300 }}>
          {[
            ['Focused (Hard) mode', 'Sister Wendy plays to win. No mercy, no hints.'],
            ['Ad-free, forever', 'Not a single ad. Just you and the nun.'],
            ['Supports the studio', 'We double down on players, not advertisers.'],
          ].map(([t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <span style={{ color: '#c49020', fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', lineHeight: 1.1 }}>✦</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', color: '#f5ead8' }}>{t}</div>
                <div style={{ fontFamily: 'var(--font-garamond)', fontSize: '0.82rem', fontStyle: 'italic', color: 'rgba(245,234,216,0.5)', lineHeight: 1.35 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={goPremium}
          disabled={busy}
          style={{
            width: '100%', padding: '13px', borderRadius: 12, cursor: 'pointer',
            background: 'linear-gradient(180deg,#e8b840,#c49020)', border: 'none',
            fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', letterSpacing: '0.08em', color: '#1a1408',
          }}
        >
          UNLOCK FOR {ADS.price} →
        </button>

        <div style={{ marginTop: 14, display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={handleRedeem}
            disabled={busy}
            style={{ background: 'transparent', border: 'none', color: 'rgba(196,144,32,0.7)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.05em', textDecoration: 'underline' }}
          >
            {busy ? 'verifying…' : 'restore purchase'}
          </button>
          <span style={{ opacity: 0.3, color: '#fff' }}>·</span>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'rgba(245,234,216,0.45)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.05em' }}
          >
            maybe later
          </button>
        </div>

        {msg && (
          <p style={{ marginTop: 12, fontFamily: 'var(--font-garamond)', fontSize: '0.8rem', fontStyle: 'italic', color: '#d4807a' }}>{msg}</p>
        )}
      </div>
    </div>
  );
}
