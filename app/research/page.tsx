import Link from 'next/link';

export const metadata = {
  title: 'The Nun, the Boneyard, and the Roast Chicken — Sister Wendy Dominoes',
  description: 'A playful academic defense of Sister Wendy Dominoes as a behavioral strategy game — game theory, loss aversion, nudges, MDA, and one roast chicken.',
};

const wrap: React.CSSProperties = { minHeight: '100vh', background: '#0d0a06', color: 'rgba(245,234,216,0.82)', fontFamily: 'Georgia, serif', padding: '3rem 1.25rem 5rem', lineHeight: 1.7 };
const inner: React.CSSProperties = { maxWidth: 720, margin: '0 auto' };
const h1: React.CSSProperties = { fontFamily: 'var(--font-bebas), sans-serif', fontSize: '2.6rem', letterSpacing: '0.04em', color: '#e8b840', marginBottom: '0.35rem', lineHeight: 1.05 };
const sub: React.CSSProperties = { fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(245,234,216,0.65)', marginBottom: '1rem' };
const h2: React.CSSProperties = { fontFamily: 'var(--font-bebas), sans-serif', fontSize: '1.3rem', letterSpacing: '0.04em', color: '#c49020', margin: '2.2rem 0 0.5rem' };
const meta: React.CSSProperties = { fontFamily: 'var(--font-mono), monospace', fontSize: '0.68rem', letterSpacing: '0.16em', color: 'rgba(196,144,32,0.6)', margin: '0.5rem 0 1.5rem' };
const link: React.CSSProperties = { color: '#e8b840', textDecoration: 'none' };
const back: React.CSSProperties = { ...link, fontFamily: 'var(--font-mono), monospace', fontSize: '0.8rem' };
const quote: React.CSSProperties = { borderLeft: '3px solid #c49020', paddingLeft: '1rem', margin: '1.25rem 0', fontStyle: 'italic', color: 'rgba(245,234,216,0.92)' };
const disclaimer: React.CSSProperties = { background: 'rgba(196,144,32,0.08)', border: '1px solid rgba(196,144,32,0.25)', borderRadius: 10, padding: '0.85rem 1.1rem', fontSize: '0.85rem', color: 'rgba(245,234,216,0.7)', margin: '0 0 2rem' };
const td: React.CSSProperties = { borderBottom: '1px solid rgba(196,144,32,0.18)', padding: '8px 10px', verticalAlign: 'top', fontFamily: 'Georgia, serif', fontSize: '0.92rem' };
const th: React.CSSProperties = { ...td, color: '#c49020', fontFamily: 'var(--font-mono), monospace', fontSize: '0.66rem', letterSpacing: '0.08em', textTransform: 'uppercase' };
const refs: React.CSSProperties = { fontSize: '0.82rem', color: 'rgba(245,234,216,0.6)', lineHeight: 1.6 };

const TAXONOMY = [
  ['Level 0: Survivalist', 'Can I play anything?', 'Plays first legal tile'],
  ['Level 1: Scorer', 'Can I score now?', 'Maximizes immediate points'],
  ['Level 2: Blocker', 'What does this give Wendy?', 'Balances scoring and defense'],
  ['Level 3: Inference Goblin', "What does Wendy's draw imply?", 'Uses passes/draws to infer hidden tiles'],
  ['Level 4: Table Poet', 'How do I manipulate her future choices?', 'Trades current points for control'],
];

export default function ResearchPage() {
  return (
    <main style={wrap}>
      <div style={inner}>
        <Link href="/" style={back}>&larr; Back to the table</Link>
        <h1 style={{ ...h1, marginTop: '1.25rem' }}>The Nun, the Boneyard, and the Roast Chicken</h1>
        <div style={sub}>A Playful Academic Defense of Sister Wendy Dominoes as a Behavioral Strategy Game</div>
        <div style={meta}>WORKING PAPER / GAME THEORY NOTE · SCREWCAP GAMES</div>
        <div style={disclaimer}>This is a working design-theory essay, not a peer-reviewed academic publication. Cited gleefully; concluded with a chicken.</div>

        <h2 style={h2}>Abstract</h2>
        <p><em>Sister Wendy Dominoes</em> is a digital strategy game built around All-Fives / Horse Race domino mechanics, but its deeper value is behavioral. The game places players in a compact decision environment involving incomplete information, sequential play, score pressure, risk, regret, nudges, and opponent modeling. This paper argues that the game can be academically framed through five overlapping traditions: classical game theory, behavioral game theory, behavioral economics, choice architecture, and game design theory. Nash supplies the idealized rational baseline; Camerer and colleagues explain bounded strategic reasoning; Kahneman and Tversky explain loss aversion and reference dependence; Thaler, Sunstein, and Balz explain the role of interface as choice architecture; and Hunicke, LeBlanc, and Zubek&apos;s MDA framework explains how rules become player experience. Finally, with deliberate unseriousness and actual relevance, Martha Stewart&apos;s roast chicken is introduced as a procedural analogy: good games, like good recipes, require ingredients, sequence, heat, feedback, and restraint.</p>

        <h2 style={h2}>1. Why This Game Deserves an Academic Frame</h2>
        <p>A good domino game is not just arithmetic with bones. It is a compact economy. Players manage scarce tiles, infer hidden information, decide when to score, when to block, when to draw, when to preserve flexibility, and when to accept an ugly little move because the board has become a courtroom with pips.</p>
        <p><em>Sister Wendy Dominoes</em> succeeds because it turns these decisions into a legible, emotionally textured experience. The player faces strategic uncertainty through hidden hands and the boneyard; reference dependence through score state and target score; loss aversion when a missed scoring move feels larger than an equal gain; bounded rationality when players reason only one or two moves ahead; nudges through score previews, legal-move highlights, and rules feedback; and social framing through Sister Wendy&apos;s character and commentary.</p>

        <h2 style={h2}>2. Game Theory: Nash Is the Cathedral, Wendy Is the Tour Guide With Opinions</h2>
        <p>Classical game theory gives us the formal baseline. Nash&apos;s equilibrium concept describes a situation where each player&apos;s strategy is optimal given the strategies of others. That is the marble-column version of strategic play: elegant, clean, and unbothered by the fact that real people forget what suit was passed three turns ago.</p>
        <p>In <em>Sister Wendy Dominoes</em>, Nash equilibrium is useful as an ideal horizon rather than a realistic model of actual player behavior. A perfectly rational player would evaluate tile distributions, scoring opportunities, blocking incentives, boneyard probability, and opponent inference. A normal human player sees a playable double and thinks, &ldquo;Surely this is destiny.&rdquo; Then Wendy scores fifteen and looks spiritually disappointed.</p>
        <p>This is where behavioral game theory matters. Camerer&apos;s work argues that real players are bounded, adaptive, emotional, and heterogeneous in strategic depth. Cognitive hierarchy theory, developed by Camerer, Ho, and Chong, is especially useful. It suggests that players reason in levels: some play almost randomly, some best-respond to simple players, and others anticipate deeper chains of reasoning.</p>

        <h2 style={h2}>3. Behavioral Economics: Loss Aversion at a Table With Pips</h2>
        <p>Kahneman and Tversky&apos;s Prospect Theory argues that people do not evaluate outcomes in a purely expected-value manner. They evaluate gains and losses relative to a reference point, and losses tend to loom larger than equivalent gains.</p>
        <p>Dominoes is a beautiful little machine for producing reference points: current score, opponent score, target score, previous turn result, best possible move, missed scoring opportunity, boneyard count, and the quiet feeling that &ldquo;I was winning before Wendy did that frankly theatrical thing.&rdquo;</p>
        <p>The game can measure whether players take higher-variance moves when trailing, avoid risky moves when leading, overreact after drawing several tiles, use undo more after loss-framed outcomes, rage-rematch after perceived unfairness, and misremember bad outcomes as more frequent than good outcomes.</p>

        <h2 style={h2}>4. Nudges: Legal-Move Highlights Are Mercy, Not Cheating</h2>
        <p>Thaler, Sunstein, and Balz define choice architecture as the design of the environment in which choices are made. The key point is not to force outcomes. It is to improve mapping, feedback, error anticipation, and comprehension.</p>
        <p>Good nudges for the game include legal-move highlighting, score previews, visible boneyard count, one-tile-at-a-time draw animation, move logs, post-move score explanations, and Forgiving-mode undo. The ethical rule is simple: the game should help players understand, not herd them into dependency. Wendy may be cutting, but the interface should remain honorable.</p>

        <h2 style={h2}>5. MDA: Mechanics, Dynamics, Aesthetics, and the Terrifying Power of a Good Halo</h2>
        <p>Hunicke, LeBlanc, and Zubek&apos;s MDA framework separates game design into Mechanics, Dynamics, and Aesthetics. In <em>Sister Wendy Dominoes</em>, mechanics include scoring, boneyard drawing, doubles, bonus turns, target score, and legal endpoint play. Dynamics include chasing points, blocking opponents, drawing under uncertainty, preserving flexible tiles, and exploiting opponent passes. Aesthetics include rivalry, wit, tension, competence, embarrassment, revenge, and &ldquo;I cannot believe this fictional nun just read me like a wine list.&rdquo;</p>
        <p>This matters because game greatness is not only rule correctness. It is the conversion of rules into memorable feeling.</p>

        <h2 style={h2}>6. Why the Fiction Matters: Half-Real, Fully Judgmental</h2>
        <p>Jesper Juul&apos;s <em>Half-Real</em> argues that video games are composed of real rules and fictional worlds. This is exactly the point of <em>Sister Wendy Dominoes</em>. The scoring rules are real. The nun is fiction. The player experience emerges from both.</p>
        <p>If Wendy were removed, the game would still function. But it would lose social pressure, humor, memory, and ritual. The fiction gives emotional meaning to the formal system. A +10 score is arithmetic. A +10 score after Wendy says something dry and devastating becomes theater.</p>

        <h2 style={h2}>7. Flow and Self-Determination: Why People Keep Playing</h2>
        <p>Ryan and Deci&apos;s Self-Determination Theory emphasizes autonomy, competence, and relatedness as foundations of intrinsic motivation. <em>Sister Wendy Dominoes</em> can support autonomy through mode and move choice, competence through score previews and explanations, and relatedness through opponent personality.</p>
        <p>Csikszentmihalyi&apos;s concept of flow is also relevant: clear goals, immediate feedback, and challenge-skill balance. A first-to-61 domino game has a clean goal. Each tile provides immediate feedback. Difficulty modes can tune challenge. If the game hides AI draws, mislabels rules, or fails to explain scoring, flow breaks.</p>

        <h2 style={h2}>8. The Martha Stewart Roast Chicken Principle</h2>
        <p>A Martha Stewart roast chicken recipe is not academic evidence that <em>Sister Wendy Dominoes</em> is a great game. Let us not become maniacs. But it is a useful procedural analogy. A good recipe has defined ingredients, ordered steps, controlled heat, timing, feedback, and a repeatable outcome.</p>
        <p>A good domino game has the same architecture: defined rules, ordered turns, controlled uncertainty, timing, feedback, and a repeatable feeling of fairness.</p>
        <blockquote style={quote}>Good game design is roast chicken design: simple ingredients, strict sequence, honest heat, and no unnecessary paprika in the rules engine.</blockquote>

        <h2 style={h2}>9. Site-Ready Thesis</h2>
        <p><em>Sister Wendy Dominoes</em> is a behavioral strategy game disguised as a stylish table game. Its All-Fives / Horse Race mechanics create a repeated-choice environment involving risk, regret, inference, blocking, and reward timing. Its interface operates as choice architecture, helping players understand legal moves, scoring consequences, and uncertainty without removing agency. Its character layer turns abstract rules into social play. The result is a game that can entertain casual players while also supporting serious research into behavioral economics, bounded rationality, and strategic learning.</p>

        <h2 style={h2}>10. The Short Version</h2>
        <p>At first glance, <em>Sister Wendy Dominoes</em> is a stylish domino game with a sharp-tongued opponent and a suspiciously confident halo. Underneath, it is a compact behavioral-economics machine.</p>
        <p>Every move asks a real strategic question: score now, block Wendy, preserve flexibility, or draw into uncertainty. Every score changes the player&apos;s reference point. Every missed opportunity triggers regret. Every bonus turn creates a tiny reward loop. Every boneyard draw tests patience and trust.</p>
        <p>The game draws from ideas in game theory, behavioral economics, and choice architecture: Nash equilibrium, bounded rationality, loss aversion, nudges, flow, and the mechanics-dynamics-aesthetics framework of game design. Also, yes, we cite Martha Stewart&apos;s roast chicken. Because good games, like good recipes, depend on ingredients, timing, sequence, and not randomly throwing paprika into the rules engine.</p>

        <h2 style={h2}>Player-Level Taxonomy</h2>
        <table style={{ borderCollapse: 'collapse', width: '100%', margin: '0.5rem 0 1rem' }}>
          <thead><tr><th style={th}>Player Type</th><th style={th}>What They Think</th><th style={th}>What They Do</th></tr></thead>
          <tbody>{TAXONOMY.map((r) => (<tr key={r[0]}><td style={{ ...td, color: '#e8b840', fontWeight: 700 }}>{r[0]}</td><td style={td}>{r[1]}</td><td style={td}>{r[2]}</td></tr>))}</tbody>
        </table>

        <h2 style={h2}>References</h2>
        <div style={refs}>
          <p>Caillois, R. (1961). <em>Man, Play and Games.</em> University of Illinois Press.</p>
          <p>Camerer, C. F. (2003). <em>Behavioral Game Theory.</em> Princeton University Press.</p>
          <p>Camerer, C. F., Ho, T.-H., &amp; Chong, J.-K. (2004). A cognitive hierarchy model of games. <em>QJE, 119</em>(3), 861–898.</p>
          <p>Csikszentmihalyi, M. (1990). <em>Flow: The Psychology of Optimal Experience.</em> Harper &amp; Row.</p>
          <p>Hunicke, R., LeBlanc, M., &amp; Zubek, R. (2004). <a style={link} href="https://users.cs.northwestern.edu/~hunicke/MDA.pdf" target="_blank" rel="noopener noreferrer">MDA: A formal approach to game design.</a> AAAI.</p>
          <p>Juul, J. (2005). <em>Half-Real.</em> MIT Press.</p>
          <p>Kahneman, D., &amp; Tversky, A. (1979). Prospect theory. <em>Econometrica, 47</em>(2), 263–291.</p>
          <p>Nash, J. F. (1950). Equilibrium points in n-person games. <em>PNAS, 36</em>(1), 48–49.</p>
          <p>Ryan, R. M., &amp; Deci, E. L. (2000). Intrinsic and extrinsic motivations. <em>Contemporary Educational Psychology, 25</em>(1), 54–67.</p>
          <p>Stewart, M. (n.d.). <a style={link} href="https://www.marthastewart.com/356165/perfect-roast-chicken" target="_blank" rel="noopener noreferrer">Perfect roast chicken.</a> Martha Stewart.</p>
          <p>Thaler, R. H., Sunstein, C. R., &amp; Balz, J. P. (2013). Choice architecture. In <em>The Behavioral Foundations of Public Policy.</em> Princeton University Press.</p>
          <p>Tversky, A., &amp; Kahneman, D. (1991). Loss aversion in riskless choice. <em>QJE, 106</em>(4), 1039–1061.</p>
        </div>

        <p style={{ marginTop: '2.5rem' }}>
          <Link href="/" style={link}>← Back to Sister Wendy</Link> &middot;{' '}
          <a style={link} href="https://screwcap.games" target="_blank" rel="noopener noreferrer">A Screwcap Games property</a>
        </p>
      </div>
    </main>
  );
}
