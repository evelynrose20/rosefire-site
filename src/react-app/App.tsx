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
  const categories = [
    "Community Conduct",
    "Roleplay Standards",
    "Characters",
    "Combat & Hostile RP",
    "Crime & Robbery",
    "Medical, Injuries & Death",
    "Government & Organizations",
    "Economy & Exploits",
    "Staff & Reports",
    "Streaming & Content",
  ];

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
        <div className="rules-category-grid">
          {categories.map((category, index) => (
            <div className="rules-category-card" key={category}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{category}</strong>
              <small>Content coming with the rules migration.</small>
            </div>
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

function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json() as Promise<{ configured: boolean }>)
      .then((data) => setConfigured(data.configured))
      .catch(() => setConfigured(false));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("Signing in…");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json() as { error?: string };
    if (!response.ok) {
      setMessage(data.error || "Unable to sign in.");
      return;
    }
    setMessage("");
    onLogin();
  };

  return (
    <section className="login-shell">
      <p className="section-kicker">ROSEFIRE CMS</p>
      <h1>Admin Login</h1>
      <p>Use the private dashboard password to edit and publish the entire public portal.</p>
      {!configured && (
        <div className="admin-message">
          Cloudflare secrets still need to be configured before login can work.
        </div>
      )}
      <form className="login-card" onSubmit={submit}>
        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="button primary" type="submit">Sign in</button>
        {message && <p className="login-message">{message}</p>}
      </form>
    </section>
  );
}

function Admin({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<SiteContent>(content);
  const [message, setMessage] = useState("");

  const checkSession = async () => {
    const response = await fetch("/api/admin/session");
    const data = await response.json() as { authenticated: boolean };
    setAuthenticated(data.authenticated);
  };

  useEffect(() => {
    void checkSession();
  }, []);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  if (authenticated === null) {
    return <section className="admin-shell"><p>Loading dashboard…</p></section>;
  }

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  const setBrand = (key: keyof SiteContent["brand"], value: string) =>
    setDraft((current) => ({ ...current, brand: { ...current.brand, [key]: value } }));

  const setHero = (key: keyof SiteContent["hero"], value: string) =>
    setDraft((current) => ({ ...current, hero: { ...current.hero, [key]: value } }));

  const setState = (key: Exclude<keyof SiteContent["state"], "tracker">, value: string) =>
    setDraft((current) => ({ ...current, state: { ...current.state, [key]: value } }));

  const setFooter = (key: keyof SiteContent["footer"], value: string) =>
    setDraft((current) => ({ ...current, footer: { ...current.footer, [key]: value } }));

  const setRulesLanding = (
    field: "title" | "principle" | "closing" | "categoriesTitle" | "categoriesIntro" | "intro",
    value: string,
  ) =>
    setDraft((current) => ({
      ...current,
      rulesLanding: {
        ...current.rulesLanding,
        [field]: field === "intro" ? value.split("\n\n").filter(Boolean) : value,
      },
    }));

  const setRulesCard = (
    index: number,
    field: "title" | "body" | "emphasis",
    value: string,
  ) =>
    setDraft((current) => ({
      ...current,
      rulesLanding: {
        ...current.rulesLanding,
        cards: current.rulesLanding.cards.map((card, cardIndex) =>
          cardIndex === index
            ? { ...card, [field]: field === "body" ? value.split("\n\n").filter(Boolean) : value }
            : card
        ),
      },
    }));

  const setTracker = (index: number, patch: Partial<TrackerItem>) =>
    setDraft((current) => ({
      ...current,
      state: {
        ...current.state,
        tracker: current.state.tracker.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item
        ),
      },
    }));

  const setNav = (index: number, field: "label" | "href", value: string) =>
    setDraft((current) => ({
      ...current,
      navigation: current.navigation.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));

  const setCard = (index: number, field: keyof SiteContent["cards"][number], value: string) =>
    setDraft((current) => ({
      ...current,
      cards: current.cards.map((card, cardIndex) =>
        cardIndex === index ? { ...card, [field]: value } : card
      ),
    }));

  const setPage = (
    key: PageKey,
    field: keyof SiteContent["pages"][PageKey],
    value: string,
  ) =>
    setDraft((current) => ({
      ...current,
      pages: {
        ...current.pages,
        [key]: {
          ...current.pages[key],
          [field]: field === "body" ? value.split("\n\n").filter(Boolean) : value,
        },
      },
    }));

  const publish = async () => {
    setMessage("Publishing…");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Publish failed." })) as { error?: string };
      setMessage(data.error || "Publish failed.");
      if (response.status === 401) setAuthenticated(false);
      return;
    }
    setContent(draft);
    setMessage("Published. The public site is updated.");
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  };

  return (
    <section className="admin-shell">
      <div className="admin-heading">
        <div>
          <p className="section-kicker">ROSEFIRE CMS</p>
          <h1>Admin Dashboard</h1>
          <p>
            Everything public-facing on the portal can be edited here and published to persistent
            Cloudflare storage.
          </p>
        </div>
        <div className="admin-actions">
          <button className="button primary" onClick={publish}>Publish Changes</button>
          <button className="text-button" onClick={logout}>Sign out</button>
        </div>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <section className="admin-panel">
        <div className="admin-panel-heading"><p>Global</p><h2>Brand</h2></div>
        <div className="admin-grid">
          <Field label="Site name" value={draft.brand.name} onChange={(v) => setBrand("name", v)} />
          <Field label="Short mark" value={draft.brand.shortMark} onChange={(v) => setBrand("shortMark", v)} />
          <Field label="Portal label" value={draft.brand.portalLabel} onChange={(v) => setBrand("portalLabel", v)} />
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><p>Homepage</p><h2>Hero</h2></div>
        <div className="admin-grid">
          <Field label="Kicker" value={draft.hero.kicker} onChange={(v) => setHero("kicker", v)} />
          <Field label="Headline line 1" value={draft.hero.lineOne} onChange={(v) => setHero("lineOne", v)} />
          <Field label="Accent word" value={draft.hero.accent} onChange={(v) => setHero("accent", v)} />
          <Field label="Headline line 2" value={draft.hero.lineTwo} onChange={(v) => setHero("lineTwo", v)} />
          <Field label="Primary button" value={draft.hero.primaryLabel} onChange={(v) => setHero("primaryLabel", v)} />
          <Field label="Primary link" value={draft.hero.primaryHref} onChange={(v) => setHero("primaryHref", v)} />
          <Field label="Secondary button" value={draft.hero.secondaryLabel} onChange={(v) => setHero("secondaryLabel", v)} />
          <Field label="Secondary link" value={draft.hero.secondaryHref} onChange={(v) => setHero("secondaryHref", v)} />
        </div>
        <label className="admin-field full">
          <span>Hero description</span>
          <textarea value={draft.hero.lede} onChange={(e) => setHero("lede", e.target.value)} />
        </label>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><p>Homepage</p><h2>State Tracker</h2></div>
        <div className="admin-grid">
          <Field label="Status label" value={draft.state.statusLabel} onChange={(v) => setState("statusLabel", v)} />
          <Field label="Overall status" value={draft.state.status} onChange={(v) => setState("status", v)} />
          <Field label="Seal top" value={draft.state.sealTop} onChange={(v) => setState("sealTop", v)} />
          <Field label="Seal bottom" value={draft.state.sealBottom} onChange={(v) => setState("sealBottom", v)} />
          <Field label="Notice label" value={draft.state.noticeLabel} onChange={(v) => setState("noticeLabel", v)} />
        </div>
        <label className="admin-field full">
          <span>Public notice</span>
          <textarea value={draft.state.notice} onChange={(e) => setState("notice", e.target.value)} />
        </label>

        <div className="tracker-editor">
          {draft.state.tracker.map((item, index) => (
            <div className="tracker-edit-row" key={index}>
              <input value={item.label} onChange={(e) => setTracker(index, { label: e.target.value })} />
              <input value={item.value} onChange={(e) => setTracker(index, { value: e.target.value })} />
              <select
                value={item.tone}
                onChange={(e) => setTracker(index, { tone: e.target.value as TrackerItem["tone"] })}
              >
                <option value="declared">Declared</option>
                <option value="stagnant">Stagnant</option>
                <option value="limited">Limited</option>
                <option value="unformed">Unformed</option>
              </select>
              <button
                className="remove-button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    state: {
                      ...current.state,
                      tracker: current.state.tracker.filter((_, i) => i !== index),
                    },
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          className="button secondary"
          onClick={() =>
            setDraft((current) => ({
              ...current,
              state: {
                ...current.state,
                tracker: [
                  ...current.state.tracker,
                  { label: "New area", value: "Not established", tone: "unformed" },
                ],
              },
            }))
          }
        >
          Add Tracker Item
        </button>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><p>Global</p><h2>Navigation</h2></div>
        {draft.navigation.map((item, index) => (
          <div className="admin-grid compact" key={index}>
            <Field label="Label" value={item.label} onChange={(v) => setNav(index, "label", v)} />
            <Field label="Link" value={item.href} onChange={(v) => setNav(index, "href", v)} />
          </div>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><p>Homepage</p><h2>Portal Cards</h2></div>
        {draft.cards.map((card, index) => (
          <div className="card-editor" key={index}>
            <div className="admin-grid">
              <Field label="Index" value={card.index} onChange={(v) => setCard(index, "index", v)} />
              <Field label="Eyebrow" value={card.eyebrow} onChange={(v) => setCard(index, "eyebrow", v)} />
              <Field label="Title" value={card.title} onChange={(v) => setCard(index, "title", v)} />
              <Field label="Link" value={card.href} onChange={(v) => setCard(index, "href", v)} />
            </div>
            <label className="admin-field full">
              <span>Description</span>
              <textarea value={card.text} onChange={(e) => setCard(index, "text", e.target.value)} />
            </label>
          </div>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><p>Rules</p><h2>Rulebook Landing Page</h2></div>
        <Field label="Main title" value={draft.rulesLanding.title} onChange={(v) => setRulesLanding("title", v)} />
        <label className="admin-field full">
          <span>Opening copy — blank line starts a new paragraph</span>
          <textarea
            className="large"
            value={draft.rulesLanding.intro.join("\n\n")}
            onChange={(e) => setRulesLanding("intro", e.target.value)}
          />
        </label>
        <div className="admin-grid">
          <Field label="Principle" value={draft.rulesLanding.principle} onChange={(v) => setRulesLanding("principle", v)} />
          <Field label="Closing line" value={draft.rulesLanding.closing} onChange={(v) => setRulesLanding("closing", v)} />
          <Field label="Sections heading" value={draft.rulesLanding.categoriesTitle} onChange={(v) => setRulesLanding("categoriesTitle", v)} />
          <Field label="Sections intro" value={draft.rulesLanding.categoriesIntro} onChange={(v) => setRulesLanding("categoriesIntro", v)} />
        </div>
        {draft.rulesLanding.cards.map((card, index) => (
          <div className="card-editor" key={index}>
            <Field label={`Intro card ${index + 1} title`} value={card.title} onChange={(v) => setRulesCard(index, "title", v)} />
            <label className="admin-field full">
              <span>Card body — blank line starts a new paragraph</span>
              <textarea
                className="large"
                value={card.body.join("\n\n")}
                onChange={(e) => setRulesCard(index, "body", e.target.value)}
              />
            </label>
            <Field label="Card emphasis" value={card.emphasis} onChange={(v) => setRulesCard(index, "emphasis", v)} />
          </div>
        ))}
      </section>

      {(Object.keys(draft.pages) as PageKey[]).map((key) => {
        const page = draft.pages[key];
        return (
          <section className="admin-panel" key={key}>
            <div className="admin-panel-heading"><p>Page</p><h2>{page.title}</h2></div>
            <div className="admin-grid">
              <Field label="Eyebrow" value={page.eyebrow} onChange={(v) => setPage(key, "eyebrow", v)} />
              <Field label="Title" value={page.title} onChange={(v) => setPage(key, "title", v)} />
              <Field label="Callout title" value={page.calloutTitle} onChange={(v) => setPage(key, "calloutTitle", v)} />
              <Field label="Callout text" value={page.calloutText} onChange={(v) => setPage(key, "calloutText", v)} />
            </div>
            <label className="admin-field full">
              <span>Intro</span>
              <textarea value={page.intro} onChange={(e) => setPage(key, "intro", e.target.value)} />
            </label>
            <label className="admin-field full">
              <span>Body — blank line starts a new paragraph</span>
              <textarea
                className="large"
                value={page.body.join("\n\n")}
                onChange={(e) => setPage(key, "body", e.target.value)}
              />
            </label>
          </section>
        );
      })}

      <section className="admin-panel">
        <div className="admin-panel-heading"><p>Global</p><h2>Footer</h2></div>
        <div className="admin-grid">
          <Field label="Footer title" value={draft.footer.lineOne} onChange={(v) => setFooter("lineOne", v)} />
          <Field label="Footer line" value={draft.footer.lineTwo} onChange={(v) => setFooter("lineTwo", v)} />
        </div>
      </section>
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
    fetch("/api/content")
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
    if (path === "/admin") return <Admin content={content} setContent={setContent} />;
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
