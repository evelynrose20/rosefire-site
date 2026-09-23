import "./App.css";

const sections = [
  {
    eyebrow: "New to Rosefire?",
    title: "Getting Started",
    text: "Everything a new survivor needs before stepping into the State of Rosefire.",
    href: "#getting-started",
  },
  {
    eyebrow: "Community Standard",
    title: "Server Rules",
    text: "The rules that keep roleplay fair, readable, and fun for everyone.",
    href: "#rules",
  },
  {
    eyebrow: "Rebuilding the State",
    title: "Government",
    text: "Public information, institutions, projects, notices, and the state as it takes shape.",
    href: "#government",
  },
  {
    eyebrow: "Know the World",
    title: "Lore & Guides",
    text: "Learn what happened, what is known, and how Rosefire works without needing homework to join.",
    href: "#lore",
  },
];

function App() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="State of Rosefire home">
          <span className="brand-mark" aria-hidden="true">RF</span>
          <span>
            <strong>STATE OF ROSEFIRE</strong>
            <small>OFFICIAL COMMUNITY PORTAL</small>
          </span>
        </a>

        <nav className="nav" aria-label="Primary navigation">
          <a href="#getting-started">Start Here</a>
          <a href="#rules">Rules</a>
          <a href="#government">Government</a>
          <a href="#lore">World</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">THE OLD WORLD ENDED. ROSEFIRE DID NOT.</p>
          <h1>
            Rebuild.
            <span> Survive.</span>
            <br />
            Decide what comes next.
          </h1>
          <p className="lede">
            The State of Rosefire is a persistent FiveM survival roleplay world set after the collapse.
            Scavenge, trade, work, heal, build communities, and take part in a state finding its feet again.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#getting-started">Enter Rosefire</a>
            <a className="button secondary" href="#rules">Read the rules</a>
          </div>
        </div>

        <aside className="state-card" aria-label="Rosefire status">
          <div className="seal" aria-hidden="true">
            <span className="seal-ring">ROSEFIRE</span>
            <strong>R</strong>
            <small>EST. AFTER THE FALL</small>
          </div>
          <p className="status-label">STATE STATUS</p>
          <p className="status-value"><span></span> REBUILDING</p>
          <dl>
            <div>
              <dt>Capital</dt>
              <dd>Forming</dd>
            </div>
            <div>
              <dt>Counties</dt>
              <dd>San Andreas counties retained</dd>
            </div>
            <div>
              <dt>Security</dt>
              <dd>Cerberus State Guard</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="notice">
        <span>PUBLIC NOTICE // ROSEFIRE TRANSITION</span>
        <p>
          Existing county and city names remain in use. Rosefire is the new state identity created during
          reconstruction.
        </p>
      </section>

      <section className="cards" aria-label="Rosefire information">
        {sections.map((section) => (
          <a className="portal-card" href={section.href} key={section.title}>
            <span className="card-index">0{sections.indexOf(section) + 1}</span>
            <div>
              <p>{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <span>{section.text}</span>
            </div>
            <strong aria-hidden="true">↗</strong>
          </a>
        ))}
      </section>

      <section className="content-section" id="getting-started">
        <p className="section-kicker">START HERE</p>
        <h2>Welcome to Rosefire.</h2>
        <p>
          This section will become the clean first-stop guide for joining the server, creating a character,
          understanding the setting, and knowing what to do during the first hour.
        </p>
        <div className="section-note">Getting Started guide is being prepared.</div>
      </section>

      <section className="content-section split" id="rules">
        <div>
          <p className="section-kicker">COMMUNITY STANDARD</p>
          <h2>Rules without a wall of Discord text.</h2>
        </div>
        <div>
          <p>
            Rosefire's full rules will live here in readable sections with direct links from Discord.
            The existing rules can be migrated and lightly rewritten for the new setting without losing
            the framework that already works.
          </p>
          <div className="section-note">Rules migration is next.</div>
        </div>
      </section>

      <section className="content-section split" id="government">
        <div>
          <p className="section-kicker">THE STATE REFORMS</p>
          <h2>Government is something players will watch grow.</h2>
        </div>
        <div>
          <p>
            Rosefire is not pretending the collapse never happened. Administration, public works,
            medical services, security, and civic projects can expand through world events and roleplay.
          </p>
          <p className="cerberus">CERBERUS STATE GUARD <span>CSG</span></p>
        </div>
      </section>

      <section className="content-section" id="lore">
        <p className="section-kicker">WORLD & LORE</p>
        <h2>Deep enough to discover. Simple enough to join.</h2>
        <p>
          New players should be able to arrive as ordinary survivors without studying a lore bible.
          Deeper Rosefire lore—including its more unusual inhabitants—can be discovered naturally in play.
        </p>
      </section>

      <footer>
        <div>
          <strong>STATE OF ROSEFIRE</strong>
          <p>A FiveM survival roleplay community.</p>
        </div>
        <p>Reconstruction is ongoing.</p>
      </footer>
    </main>
  );
}

export default App;
