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
        <p>We use <a style={link} href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer">Plausible</a>,
        which is cookieless and aggregate-only. We also use <strong>Google Analytics</strong> and the{' '}
        <strong>Meta (Facebook) pixel</strong>, which do set cookies, measure at the level of an
        individual browser, and tell us whether an ad we ran actually sent anyone here. We would
        rather name them than file them under &ldquo;privacy-respecting analytics.&rdquo;</p>

        <h2 style={h2}>4. Advertising</h2>
        <p>The free version of the Game carries <strong>Google AdSense</strong>. AdSense sets its own
        cookies and may personalise what it shows you, under{' '}
        <a style={link} href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google&apos;s policies</a>,
        not ours. Ads appear on menus and end screens only — never during a hand. Buying the
        premium unlock removes them entirely.</p>
        <p>You can opt out at the source via{' '}
        <a style={link} href="https://myadcenter.google.com" target="_blank" rel="noopener noreferrer">Google&apos;s Ad Settings</a> or{' '}
        <a style={link} href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer">Meta&apos;s ad preferences</a>,
        or with any decent content blocker. We are not going to sulk about it.</p>
        <p>What we don&apos;t do: sell or rent your data, build profiles of you as a product, or track you
        across unrelated sites for our own purposes. The ads pay for hosting and the odd commissioned
        illustration. Sister Wendy is not funding a yacht.</p>

        <h2 style={h2}>5. Third-Party Links</h2>
        <p>The Game links to other Screwcap Games properties and external sites. We are not responsible
        for the privacy practices of sites we do not operate.</p>

        <h2 style={h2}>6. Children</h2>
        <p>The Game is suitable for general audiences and does not knowingly collect personal
        information from children.</p>

        <h2 style={h2}>7. Changes</h2>
        <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above reflects the
        current version.</p>

        <h2 style={h2}>8. Contact</h2>
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
