'use client';

// CARL_SPEC §4 — the scoring-explainer corner pop-up. Teaches All-Fives scoring by
// showing the live math when points are scored (and a near-miss nudge for loss aversion).
// This game scores the FULL open-end sum when it's a multiple of 5 (not sum÷5).

export interface ExplainerData {
  kind: 'score' | 'near';
  ends: number[];
  sum: number;
  points: number;      // for 'score'
  nearMissOf: number;  // for 'near'
}

export default function ScoringExplainer({
  data, onClose, onDisable,
}: {
  data: ExplainerData;
  onClose: () => void;
  onDisable: () => void;
}) {
  const eq = data.ends.join(' + ');
  const isScore = data.kind === 'score';
  return (
    <div
      role="dialog"
      style={{
        position: 'fixed', left: 14, bottom: 14, zIndex: 9000, maxWidth: 280,
        background: '#15110a', border: `1px solid ${isScore ? 'rgba(196,144,32,0.6)' : 'rgba(212,80,122,0.55)'}`,
        borderRadius: 12, padding: '12px 14px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        fontFamily: 'var(--font-mono), monospace', color: '#f5ead8',
      }}
    >
      <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', fontWeight: 700, color: isScore ? '#e8b840' : '#f08aa6', marginBottom: 6 }}>
        {isScore ? '📊 Why that scored' : '😬 So close!'}
      </div>
      <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
        Open ends: <b>{eq || data.sum}</b> = <b>{data.sum}</b>
      </div>
      <div style={{ fontSize: '0.82rem', lineHeight: 1.5, marginTop: 2, color: isScore ? '#9fd9b0' : 'rgba(245,234,216,0.8)' }}>
        {isScore
          ? <>A multiple of 5 → <b style={{ color: '#e8b840' }}>+{data.points} points!</b> ✨</>
          : <>One off <b>{data.nearMissOf}</b> — land on a multiple of 5 to score.</>}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button onClick={onClose}
          style={{ flex: 1, background: 'rgba(196,144,32,0.18)', border: '1px solid rgba(196,144,32,0.45)', color: '#e8b840', borderRadius: 8, padding: '6px 8px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}>
          Got it
        </button>
        {isScore && (
          <button onClick={onDisable}
            style={{ background: 'transparent', border: '1px solid rgba(245,234,216,0.2)', color: 'rgba(245,234,216,0.55)', borderRadius: 8, padding: '6px 8px', fontSize: '0.66rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            Don&apos;t show again
          </button>
        )}
      </div>
    </div>
  );
}
