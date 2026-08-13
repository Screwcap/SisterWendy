'use client';

interface BoneyardStackProps {
  count: number;
}

// The boneyard used to be the words "BONEYARD: 14". It reads better as the thing
// it is — a stack of face-down tiles that visibly gets shorter as you draw from it.
// The stack caps at MAX_SHOWN so a full 14-tile boneyard doesn't run off the panel;
// the number stays authoritative.
const MAX_SHOWN = 4;
const STEP = 8;      // px each tile is offset from the one beneath it —
                     // wide enough that the tiles read as overlapping tiles and
                     // not as a barcode, which 4px did.
const TILE_W = 13;
const TILE_H = 21;

export default function BoneyardStack({ count }: BoneyardStackProps) {
  const shown = Math.min(count, MAX_SHOWN);

  return (
    <span className="flex items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.14em', color: 'rgba(226,188,96,0.8)' }}>
        BONEYARD
      </span>
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          display: 'inline-block',
          width: shown > 0 ? TILE_W + (shown - 1) * STEP : TILE_W,
          height: TILE_H + 2,
          flexShrink: 0,
        }}
      >
        {shown === 0 ? (
          <span
            style={{
              position: 'absolute', inset: 0, width: TILE_W, height: TILE_H,
              borderRadius: 3,
              border: '1px dashed rgba(196,144,32,0.28)',
              background: 'rgba(0,0,0,0.25)',
            }}
          />
        ) : (
          Array.from({ length: shown }).map((_, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: i * STEP,
                top: (shown - 1 - i) * 0.6,   // slight lift so the stack has depth
                width: TILE_W,
                height: TILE_H,
                borderRadius: 3,
                background: 'linear-gradient(160deg, #241a09 0%, #120d05 100%)',
                border: '1px solid rgba(196,144,32,0.42)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
                transition: 'left 0.3s ease, top 0.3s ease',
              }}
            >
              {/* the gold pip on the back of the tile — only on the top one */}
              {i === shown - 1 && (
                <span
                  style={{
                    position: 'absolute', left: '50%', top: '50%',
                    width: 3, height: 3, marginLeft: -1.5, marginTop: -1.5,
                    borderRadius: '50%',
                    background: 'rgba(232,184,64,0.55)',
                  }}
                />
              )}
            </span>
          ))
        )}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.14em', color: 'rgba(226,188,96,0.8)' }}>
        {count > 0 ? count : 'EMPTY'}
      </span>
    </span>
  );
}
