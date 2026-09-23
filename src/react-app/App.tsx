import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { defaultContent, type SiteContent, type TrackerItem } from "./siteContent";

type PageKey = keyof SiteContent["pages"];

type CmsPage = SiteContent["pages"][keyof SiteContent["pages"]] & { key: keyof SiteContent["pages"] };
type CmsContent = Omit<SiteContent, "brand" | "hero" | "state" | "rulesLanding" | "pages" | "footer"> & {
  brand: SiteContent["brand"][];
  hero: SiteContent["hero"][];
  state: SiteContent["state"][];
  rulesLanding: SiteContent["rulesLanding"][];
  pages: CmsPage[];
  footer: SiteContent["footer"][];
};

function normalizeCmsContent(raw: CmsContent): SiteContent {
  const pages = { ...defaultContent.pages };
  for (const page of raw.pages ?? []) {
    if (page?.key && page.key in pages) {
      const { key, ...pageContent } = page;
      pages[key] = pageContent;
    }
  }

  return {
    ...defaultContent,
    ...raw,
    brand: raw.brand?.[0] ?? defaultContent.brand,
    hero: raw.hero?.[0] ?? defaultContent.hero,
    state: raw.state?.[0] ?? defaultContent.state,
    rulesLanding: raw.rulesLanding?.[0] ?? defaultContent.rulesLanding,
    pages,
    footer: raw.footer?.[0] ?? defaultContent.footer,
  };
}

const BASE_PATH = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL.slice(0, -1)
  : import.meta.env.BASE_URL;

function toSiteUrl(path: string) {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path || "/"}` || "/";
}

function currentSitePath() {
  const pathname = window.location.pathname;
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    const stripped = pathname.slice(BASE_PATH.length);
    return stripped || "/";
  }
  return pathname || "/";
}

function navigate(path: string) {
  window.history.pushState({}, "", toSiteUrl(path));
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
      href={href.startsWith("/") ? toSiteUrl(href) : href}
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

      {rules.groups.map((group, groupIndex) => (
        <section className="rules-categories" key={groupIndex}>
          <p className="section-kicker">RULEBOOK</p>
          <h2>{group.heading}</h2>
          {group.intro && <p>{group.intro}</p>}
          <div className="rules-section-list">
            {group.sections.map((section, sectionIndex) => (
              <article className="rule-section" key={`${groupIndex}-${sectionIndex}`}>
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
      ))}
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
  const [path, setPath] = useState(currentSitePath());
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    const handle = () => setPath(currentSitePath());
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content/site.json`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load content");
        return response.json() as Promise<CmsContent>;
      })
      .then((raw) => setContent(normalizeCmsContent(raw)))
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
