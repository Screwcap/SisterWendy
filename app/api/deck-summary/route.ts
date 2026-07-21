// app/api/deck-summary/route.ts — Sister Wendy's "Deck read contract" (Next App Router).
// Standard JSON the Screwcap Deck polls for this title's drill-down. Read-layer
// only, so Sister Wendy stays independently sellable.
// Auth: x-deck-token / x-admin-token / ?token= (accepts DECK_TOKEN).
// Revenue derived from the beacon's own 'revenue' events (no premium table).
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REGISTRY = {
  title: 'Sister Wendy',
  slug: 'sister-wendy',
  url: 'sisterwendy.app',
  tags: ['dominoes'],
  property: {
    repo: 'screwcap/sister-wendy',
    store: 'own Supabase project',
    domain: 'sisterwendy.app',
    rail: 'Gumroad',
    shared: 'deck-beacon, arcade-core',
    ready: 78,
  },
  backlog: [
    { s: 'info', t: 'Sound + localStorage polish', m: 'QA brief' },
    { s: 'info', t: 'Missing win animations', m: 'art' },
  ],
  pricing: { adfree: 1.99 },
};

const day = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

function gradeFor(k: any) {
  const score = (k.d1 || 0) * 0.5 + (k.d7 || 0) * 0.8 + Math.min((k.dau || 0) / 20, 40) + (k.health - 90);
  if (score >= 85) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 55) return 'B';
  if (score >= 40) return 'B−';
  if (score >= 25) return 'C';
  return k.mau ? 'C−' : '—';
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = req.headers.get('x-deck-token') || req.headers.get('x-admin-token') || searchParams.get('token');
  const ok = (process.env.DECK_TOKEN && token === process.env.DECK_TOKEN) ||
             (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
  if (!ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  const today = day(0), cut30 = day(30), cut7 = day(7);
  const out: any = {
    title: REGISTRY.title, slug: REGISTRY.slug, url: REGISTRY.url, tags: REGISTRY.tags,
    generatedAt: new Date().toISOString(),
    property: REGISTRY.property, backlog: REGISTRY.backlog,
    kpis: { dau: 0, wau: 0, mau: 0, d1: 0, d7: 0, mrr: 0, health: 98, grade: '—' },
    trend: [], events: {}, revenue: {}, source: {},
  };

  try {
    const r = await fetch(
      `${url}/rest/v1/deck_events?select=sid,event,value,mode,created_at&created_at=gte.${cut30}T00:00:00Z&order=created_at.desc&limit=100000`,
      { headers });
    if (r.ok) {
      const rows = await r.json();
      const live = rows.filter((e: any) => e.mode !== 'demo');
      const byDay: any = {}, seenDays: any = {}, events: any = {};
      let errCount = 0, sales30 = 0, take30 = 0;
      const set7 = new Set(), set30 = new Set(), setToday = new Set();

      for (const e of live) {
        const d = (e.created_at || '').slice(0, 10);
        (byDay[d] = byDay[d] || new Set()).add(e.sid);
        (seenDays[e.sid] = seenDays[e.sid] || new Set()).add(d);
        set30.add(e.sid);
        if (d >= cut7) set7.add(e.sid);
        if (d === today) setToday.add(e.sid);
        events[e.event] = (events[e.event] || 0) + 1;
        if (e.event === 'revenue') { sales30++; take30 += Number(e.value) || 0; }
        if (e.event === 'error') errCount++;
      }

      out.kpis.dau = setToday.size;
      out.kpis.wau = set7.size;
      out.kpis.mau = set30.size;
      for (let i = 13; i >= 0; i--) { const d = day(i); out.trend.push(byDay[d] ? byDay[d].size : 0); }

      let cohort = 0, back1 = 0, back7 = 0;
      for (const sid in seenDays) {
        const days = Array.from(seenDays[sid]).sort();
        const first = days[0] as string;
        if (first > day(8)) continue;
        cohort++;
        const fT = new Date(first + 'T00:00:00Z').getTime();
        let counted1 = false;
        for (const d of days as string[]) {
          const gap = Math.round((new Date(d + 'T00:00:00Z').getTime() - fT) / 864e5);
          if (gap === 1 && !counted1) { back1++; counted1 = true; }
          if (gap >= 1 && gap <= 7) { back7++; break; }
        }
      }
      out.kpis.d1 = cohort ? Math.round((back1 / cohort) * 100) : 0;
      out.kpis.d7 = cohort ? Math.round((back7 / cohort) * 100) : 0;

      out.events = events;
      out.source.events_rows = live.length;
      out.revenue = {
        sales30, take30: Math.round(take30 * 100) / 100,
        mrr: 0, note: 'take from beacon revenue events (last 30d); ad-free is one-off, so MRR≈0',
      };
      out.kpis.mrr = 0;
      out.kpis.health = errCount ? Math.max(70, 99 - Math.min(29, Math.round((errCount / Math.max(live.length, 1)) * 400))) : 99;
      out.kpis.grade = gradeFor(out.kpis);
    } else {
      out.source.events_error = `supabase ${r.status}`;
    }
  } catch (e) { out.source.events_error = String(e).slice(0, 120); }

  return NextResponse.json(out, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
}
