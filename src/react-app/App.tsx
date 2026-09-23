import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { defaultContent, type SiteContent, type TrackerItem } from "./siteContent";

type PageKey = keyof SiteContent["pages"];

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Link({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (href.startsWith("/") && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
          event.preventDefault();
          navigate(href);
        }
      }}
    >
      {children}
    </a>
  );
}

function Header({ content }: { content: SiteContent }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">{content.brand.shortMark}</span>
        <span>
          <strong>{content.brand.name}</strong>
          <small>{content.brand.portalLabel}</small>
        </span>
      </Link>
      <nav className="nav">
        {content.navigation.map((item) => (
          <Link href={item.href} key={item.href}>{item.label}</Link>
        ))}
      </nav>
    </header>
  );
}

function Footer({ content }: { content: SiteContent }) {
  return (
    <footer>
      <div>
        <strong>{content.footer.lineOne}</strong>
        <p>{content.footer.lineTwo}</p>
      </div>
      <div className="footer-links">
        <Link href="/faq">FAQ</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </footer>
  );
}

function StatusRow({ item }: { item: TrackerItem }) {
  return (
    <div className="status-row">
      <dt>{item.label}</dt>
      <dd>
        <span className={`mini-status tone-${item.tone}`} />
        {item.value}
      </dd>
    </div>
  );
}

function Home({ content }: { content: SiteContent }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">{content.hero.kicker}</p>
          <h1>
            {content.hero.lineOne} <span>{content.hero.accent}</span>
            <br />
            {content.hero.lineTwo}
          </h1>
          <p className="lede">{content.hero.lede}</p>
          <div className="hero-actions">
            <Link className="button primary" href={content.hero.primaryHref}>
              {content.hero.primaryLabel}
            </Link>
            <Link className="button secondary" href={content.hero.secondaryHref}>
              {content.hero.secondaryLabel}
            </Link>
          </div>
        </div>

        <aside className="state-card">
          <div className="seal">
            <span className="seal-ring">{content.state.sealTop}</span>
            <strong>{content.brand.shortMark.slice(0, 1)}</strong>
            <small>{content.state.sealBottom}</small>
          </div>
          <p className="status-label">{content.state.statusLabel}</p>
          <p className="status-value"><span /> {content.state.status}</p>
          <dl>
            {content.state.tracker.map((item, index) => (
              <StatusRow item={item} key={`${item.label}-${index}`} />
            ))}
          </dl>
        </aside>
      </section>

      <section className="notice">
        <span>{content.state.noticeLabel}</span>
        <p>{content.state.notice}</p>
      </section>

      <section className="cards">
        {content.cards.map((card) => (
          <Link className="portal-card" href={card.href} key={card.index}>
            <span className="card-index">{card.index}</span>
            <div>
              <p>{card.eyebrow}</p>
              <h2>{card.title}</h2>
              <span>{card.text}</span>
            </div>
            <strong>↗</strong>
          </Link>
        ))}
      </section>
    </>
  );
}


function RulesPage({ content }: { content: SiteContent }) {
  const rules = content.rulesLanding;
  return (
    <section className="rules-shell">
      <section className="rules-opening">
        <p className="rules-kicker">OFFICIAL ROSEFIRE RULEBOOK</p>
        <h1>{rules.title}</h1>
        <div className="rules-opening-copy">
          {rules.intro.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          <p className="rules-principle">{rules.principle}</p>
          <p className="rules-closing">{rules.closing}</p>
        </div>
      </section>

      <section className="rules-intro-grid">
        {rules.cards.map((card, index) => (
          <article className="rules-intro-card" key={index}>
            <span className="rules-card-number">0{index + 1}</span>
            <h2>{card.title}</h2>
            {card.body.map((paragraph, bodyIndex) => <p key={bodyIndex}>{paragraph}</p>)}
            <strong>{card.emphasis}</strong>
          </article>
        ))}
      </section>

      <section className="rules-categories">
        <p className="section-kicker">RULEBOOK</p>
        <h2>{rules.categoriesTitle}</h2>
        <p>{rules.categoriesIntro}</p>
        <div className="rules-section-list">
          {rules.sections.map((section) => (
            <article className="rule-section" key={section.number}>
              <header className="rule-section-header">
                <span>{section.number.padStart(2, "0")}</span>
                <h3>{section.title}</h3>
              </header>
              {section.intro && <p className="rule-section-intro">{section.intro}</p>}
              <div className="rule-entry-list">
                {section.entries.map((entry, index) => (
                  <section className="rule-entry" key={index}>
                    <h4>{entry.title}</h4>
                    {entry.body.map((paragraph, bodyIndex) => <p key={bodyIndex}>{paragraph}</p>)}
                    {entry.emphasis && <strong>{entry.emphasis}</strong>}
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function ContentPage({ content, pageKey }: { content: SiteContent; pageKey: PageKey }) {
  const page = content.pages[pageKey];
  return (
    <section className="page-shell">
      <p className="section-kicker">{page.eyebrow}</p>
      <h1>{page.title}</h1>
      <p className="page-intro">{page.intro}</p>
      <div className="page-body">
        {page.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <div className="page-callout">
        <strong>{page.calloutTitle}</strong>
        <span>{page.calloutText}</span>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Admin() {
  return (
    <section className="admin-shell">
      <p className="section-kicker">ROSEFIRE CMS</p>
      <h1>Content Dashboard</h1>
      <p className="page-intro">
        Rosefire content is managed through Pages CMS. Changes made there are saved to GitHub and
        picked up by the site automatically.
      </p>
      <a
        className="button primary"
        href="https://app.pagescms.org"
        target="_blank"
        rel="noreferrer"
      >
        Open Pages CMS
      </a>
    </section>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    const handle = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);

  useEffect(() => {
    fetch("/content/site.json")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load content");
        return response.json() as Promise<SiteContent>;
      })
      .then(setContent)
      .catch(() => setContent(defaultContent));
  }, []);

  const page = useMemo(() => {
    if (path === "/") return <Home content={content} />;
    if (path === "/getting-started") return <ContentPage content={content} pageKey="gettingStarted" />;
    if (path === "/rules") return <RulesPage content={content} />;
    if (path === "/government") return <ContentPage content={content} pageKey="government" />;
    if (path === "/world") return <ContentPage content={content} pageKey="world" />;
    if (path === "/faq") return <ContentPage content={content} pageKey="faq" />;
    if (path === "/admin") return <Admin />;
    return (
      <section className="page-shell">
        <p className="section-kicker">404</p>
        <h1>That road is closed.</h1>
        <p className="page-intro">The page you were looking for does not exist.</p>
        <Link className="button primary" href="/">Return home</Link>
      </section>
    );
  }, [path, content]);

  return (
    <main>
      <Header content={content} />
      {page}
      <Footer content={content} />
    </main>
  );
}

export default App;
