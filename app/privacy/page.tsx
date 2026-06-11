import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Sister Wendy Dominoes',
  description: 'Privacy Policy for Sister Wendy Dominoes, a Screwcap Games property.',
};

const wrap: React.CSSProperties = {
  minHeight: '100vh', background: '#0d0a06', color: 'rgba(245,234,216,0.82)',
  fontFamily: 'Georgia, serif', padding: '3rem 1.25rem 5rem', lineHeight: 1.7,
};
const inner: React.CSSProperties = { maxWidth: 720, margin: '0 auto' };
const h1: React.CSSProperties = { fontFamily: 'var(--font-bebas), sans-serif', fontSize: '2.4rem', letterSpacing: '0.06em', color: '#e8b840', marginBottom: '0.25rem' };
const h2: React.CSSProperties = { fontFamily: 'var(--font-bebas), sans-serif', fontSize: '1.25rem', letterSpacing: '0.05em', color: '#c49020', margin: '2rem 0 0.5rem' };
const meta: React.CSSProperties = { fontFamily: 'var(--font-mono), monospace', fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(196,144,32,0.6)', marginBottom: '2rem' };
const link: React.CSSProperties = { color: '#e8b840', textDecoration: 'none' };

export default function PrivacyPage() {
  return (
    <main style={wrap}>
      <div style={inner}>
        <h1 style={h1}>Privacy Policy</h1>
        <div style={meta}>SISTER WENDY DOMINOES · A SCREWCAP GAMES PROPERTY · LAST UPDATED 2026</div>

        <p>Screwcap Games, LLC (&ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy. This policy explains what
        Sister Wendy Dominoes (the &ldquo;Game&rdquo;) does and does not collect.</p>

        <h2 style={h2}>1. Data We Store</h2>
        <p>The Game stores your progress, settings, and stats <strong>locally in your own browser</strong>
        (via localStorage — keys such as game state, mute preference, and statistics). This data
        never leaves your device and is not transmitted to us. Clearing your browser storage deletes it.</p>

        <h2 style={h2}>2. Information We Do Not Collect</h2>
        <p>We do not require an account. We do not collect your name, email, or payment information to
        play. We do not sell personal data.</p>

        <h2 style={h2}>3. Analytics</h2>
        <p>We may use privacy-respecting, aggregate analytics to understand how the Game is used (for
        example, page views and feature usage). Where used, such analytics are designed to avoid
        collecting personally identifying information.</p>

        <h2 style={h2}>4. Third-Party Links</h2>
        <p>The Game links to other Screwcap Games properties and external sites. We are not responsible
        for the privacy practices of sites we do not operate.</p>

        <h2 style={h2}>5. Children</h2>
        <p>The Game is suitable for general audiences and does not knowingly collect personal
        information from children.</p>

        <h2 style={h2}>6. Changes</h2>
        <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above reflects the
        current version.</p>

        <h2 style={h2}>7. Contact</h2>
        <p>Questions about privacy? Reach us via <a style={link} href="https://screwcap.games" target="_blank" rel="noopener noreferrer">screwcap.games</a>.</p>

        <p style={{ marginTop: '3rem' }}>
          <Link href="/" style={link}>&larr; Back to the game</Link>
          <span style={{ opacity: 0.4 }}>{'   ·   '}</span>
          <Link href="/terms" style={link}>Terms of Service</Link>
        </p>
      </div>
    </main>
  );
}
