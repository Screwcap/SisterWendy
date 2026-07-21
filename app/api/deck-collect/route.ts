// app/api/deck-collect/route.ts — Deck beacon collector (Next App Router).
// Receives batched, anonymous, PII-free signals from deck-beacon.js and appends
// them to `deck_events` via the Supabase service-role key. Never 500s the client
// — telemetry must not be able to break the game.
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_EVENTS = 50;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function sanitizeMeta(p: unknown): Record<string, unknown> | null {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
  const out: Record<string, unknown> = {}; let n = 0;
  for (const k in p as Record<string, unknown>) {
    if (!Object.prototype.hasOwnProperty.call(p, k) || n >= 8) continue;
    const v = (p as Record<string, unknown>)[k];
    if (typeof v === 'number' || typeof v === 'boolean') { out[String(k).slice(0, 32)] = v; n++; }
    else if (typeof v === 'string' && v.length <= 32) { out[String(k).slice(0, 32)] = v; n++; }
  }
  return n ? out : null;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, disabled: true }, { status: 200, headers: CORS });

  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  if (!body || typeof body !== 'object') return NextResponse.json({ ok: false, error: 'bad_body' }, { status: 200, headers: CORS });

  const title = String(body.title || '').slice(0, 40);
  const sid = String(body.sid || '').slice(0, 40);
  const mode = body.mode === 'demo' ? 'demo' : 'live';
  const events = Array.isArray(body.events) ? body.events.slice(0, MAX_EVENTS) : [];
  if (!title || !sid || !events.length) return NextResponse.json({ ok: false, error: 'empty' }, { status: 200, headers: CORS });

  const nowIso = new Date().toISOString();
  const rows = events.map((e: any) => {
    const v = e && e.v != null && isFinite(Number(e.v)) ? Number(e.v) : null;
    return {
      title, sid,
      event: String((e && e.n) || 'event').slice(0, 40),
      value: v,
      meta: sanitizeMeta(e && e.p),
      mode,
      created_at: nowIso,
    };
  });

  try {
    const r = await fetch(`${url}/rest/v1/deck_events`, {
      method: 'POST',
      headers: {
        apikey: key, Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json', Prefer: 'return=minimal',
      },
      body: JSON.stringify(rows),
    });
    if (!r.ok) return NextResponse.json({ ok: false, error: 'supabase:' + r.status }, { status: 200, headers: CORS });
    return new NextResponse(null, { status: 204, headers: CORS });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e).slice(0, 120) }, { status: 200, headers: CORS });
  }
}
