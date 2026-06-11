import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — Sister Wendy Dominoes',
  description: 'Terms of Service for Sister Wendy Dominoes, a Screwcap Games property.',
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

export default function TermsPage() {
  return (
    <main style={wrap}>
      <div style={inner}>
        <h1 style={h1}>Terms of Service</h1>
        <div style={meta}>SISTER WENDY DOMINOES · A SCREWCAP GAMES PROPERTY · LAST UPDATED 2026</div>

        <p>Welcome to Sister Wendy Dominoes (the &ldquo;Game&rdquo;), operated by Screwcap Games, LLC
        (&ldquo;Screwcap,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). By playing the Game you agree to these Terms. If you do not
        agree, please do not use the Game.</p>

        <h2 style={h2}>1. The Game</h2>
        <p>The Game is provided free of charge for entertainment. It is a single-player dominoes
        experience played against an AI opponent. We may update, change, or discontinue any part of
        the Game at any time without notice.</p>

        <h2 style={h2}>2. Acceptable Use</h2>
        <p>You agree not to misuse the Game, including attempting to disrupt it, reverse-engineer it
        for commercial purposes, or use it in any unlawful way. The Game is for personal,
        non-commercial use.</p>

        <h2 style={h2}>3. Intellectual Property</h2>
        <p>The Game, including its characters, artwork, dialogue, code, and branding, is owned by
        Screwcap Games, LLC and is protected by applicable intellectual-property laws. &ldquo;Sister
        Wendy Calhoun&rdquo; is a fictional character. Nothing here grants you rights to our content
        beyond playing the Game.</p>

        <h2 style={h2}>4. No Warranty</h2>
        <p>The Game is provided &ldquo;as is,&rdquo; without warranties of any kind. We do not warrant that
        the Game will be uninterrupted, error-free, or that any progress saved locally will persist.</p>

        <h2 style={h2}>5. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, Screwcap Games, LLC will not be liable for any
        indirect, incidental, or consequential damages arising from your use of the Game.</p>

        <h2 style={h2}>6. Changes</h2>
        <p>We may revise these Terms from time to time. Continued use of the Game after changes
        constitutes acceptance of the revised Terms.</p>

        <h2 style={h2}>7. Contact</h2>
        <p>Questions? Reach us via <a style={link} href="https://screwcap.games" target="_blank" rel="noopener noreferrer">screwcap.games</a>.</p>

        <p style={{ marginTop: '3rem' }}>
          <Link href="/" style={link}>&larr; Back to the game</Link>
          <span style={{ opacity: 0.4 }}>{'   ·   '}</span>
          <Link href="/privacy" style={link}>Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}
