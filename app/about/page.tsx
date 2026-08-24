import Link from 'next/link';
import { ABOUT_HTML, UPDATED } from '../legal/generated';

export const metadata = {
  title: 'About — Sister Wendy Dominoes',
  description:
    "What Sister Wendy's Dominoes is, which dominoes variant it actually plays, who makes it, and how it pays for itself.",
};

/* Styles copied from app/terms/page.tsx so the three documents read as one set.
 * Body text raised from rgba(245,234,216,0.82) to a solid #C0AE92 — the generator's
 * palette audit clears that at 4.5:1 on #0d0a06, and an alpha on body text is how
 * the 21 Aug audit's low-contrast "dim" tier happened on six of nine sites. */
const wrap: React.CSSProperties = {
  minHeight: '100vh', background: '#0d0a06', color: '#C0AE92',
  fontFamily: 'Georgia, serif', padding: '3rem 1.25rem 5rem', lineHeight: 1.7,
};
const inner: React.CSSProperties = { maxWidth: 720, margin: '0 auto' };
const h1: React.CSSProperties = {
  fontFamily: 'var(--font-bebas), sans-serif', fontSize: '2.4rem',
  letterSpacing: '0.06em', color: '#e8b840', marginBottom: '0.25rem',
};
const meta: React.CSSProperties = {
  fontFamily: 'var(--font-mono), monospace', fontSize: '0.72rem',
  letterSpacing: '0.18em', color: '#C49020', marginBottom: '2rem',
};
const back: React.CSSProperties = {
  color: '#C0AE92', textDecoration: 'none', fontSize: '0.95rem',
  display: 'inline-block', marginBottom: '1rem',
};

export default function AboutPage() {
  return (
    <main style={wrap}>
      <div style={inner}>
        <Link href="/" style={back}>&larr; Sister Wendy</Link>
        <h1 style={h1}>About</h1>
        <div style={meta}>
          SISTER WENDY&rsquo;S DOMINOES · A SCREWCAP GAMES PROPERTY · UPDATED {UPDATED.toUpperCase()}
        </div>

        <div className="sw-prose" dangerouslySetInnerHTML={{ __html: ABOUT_HTML }} />

        <nav style={{ marginTop: '3rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(196,144,32,0.22)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.1rem', fontSize: '0.95rem' }}>
          <Link href="/privacy" style={{ color: '#e8b840', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ color: '#e8b840', textDecoration: 'none' }}>Terms</Link>
          <a href="https://screwcap.games" style={{ color: '#e8b840', textDecoration: 'none' }}>Screwcap.Games</a>
          <a href="mailto:play@screwcapholdings.com" style={{ color: '#e8b840', textDecoration: 'none' }}>Contact</a>
        </nav>

        <style>{`
          .sw-prose p { margin: 0 0 0.9rem; }
          .sw-prose strong, .sw-prose em.lead { color: #F5EAD8; }
          .sw-prose h2 {
            font-family: var(--font-bebas), sans-serif; font-size: 1.25rem;
            letter-spacing: 0.05em; color: #C49020; margin: 2rem 0 0.5rem;
          }
          .sw-prose a { color: #e8b840; text-decoration: underline; text-decoration-style: dotted; }
          .sw-prose .aside {
            border-left: 3px solid rgba(196,144,32,0.35);
            padding: 0.15rem 0 0.15rem 1rem; margin: 1.2rem 0; font-style: italic;
          }
        `}</style>
      </div>
    </main>
  );
}
