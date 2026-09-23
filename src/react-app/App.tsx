import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  CONTENT_STORAGE_KEY,
  defaultContent,
  type SiteContent,
} from "./siteContent";

const pageLinks = [
  ["/getting-started", "Start Here"],
  ["/rules", "Rules"],
  ["/government", "Government"],
  ["/world", "World"],
  ["/faq", "FAQ"],
] as const;

function loadContent(): SiteContent {
  try {
    const saved = localStorage.getItem(CONTENT_STORAGE_KEY);
    return saved ? { ...defaultContent, ...JSON.parse(saved) } : defaultContent;
  } catch {
    return defaultContent;
  }
}

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
        if (
          href.startsWith("/") &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey
        ) {
          event.preventDefault();
          navigate(href);
        }
      }}
    >
      {children}
    </a>
  );
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">RF</span>
        <span>
          <strong>STATE OF ROSEFIRE</strong>
          <small>OFFICIAL COMMUNITY PORTAL</small>
        </span>
      </Link>
      <nav className="nav">
        {pageLinks.map(([href, label]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div>
        <strong>STATE OF ROSEFIRE</strong>
        <p>A FiveM survival roleplay community.</p>
      </div>
      <div className="footer-links">
        <Link href="/faq">FAQ</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </footer>
  );
}

function StatusRow({
  label,
  value,
  reforming,
}: {
  label: string;
  value: string;
  reforming?: boolean;
}) {
  return (
    <div className="status-row">
      <dt>{label}</dt>
      <dd>
        {reforming && <span className="mini-status" />}
        {value}
      </dd>
    </div>
  );
}

function Home({ content }: { content: SiteContent }) {
  const cards = [
    ["/getting-started", "01", "New to Rosefire?", "Getting Started", "Everything a new survivor needs before stepping into Rosefire."],
    ["/rules", "02", "Community Standard", "Server Rules", "The rules that keep roleplay fair, readable, and fun."],
    ["/government", "03", "Rebuilding the State", "Government", "Institutions, public projects, notices, and the state as it takes shape."],
    ["/world", "04", "Know the World", "Lore & Guides", "Learn the setting without needing homework just to join."],
  ] as const;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">{content.state.tagline.toUpperCase()}</p>
          <h1>
            Rebuild. <span>Survive.</span>
            <br />
            Decide what comes next.
          </h1>
          <p className="lede">
            The State of Rosefire is a persistent FiveM survival roleplay world set after the collapse.
            Scavenge, trade, work, heal, build communities, and take part in a state finding its feet again.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/getting-started">Enter Rosefire</Link>
            <Link className="button secondary" href="/rules">Read the rules</Link>
          </div>
        </div>

        <aside className="state-card">
          <div className="seal">
            <span className="seal-ring">ROSEFIRE</span>
            <strong>R</strong>
            <small>EST. AFTER THE FALL</small>
          </div>
          <p className="status-label">STATE STATUS</p>
          <p className="status-value"><span /> {content.state.status.toUpperCase()}</p>
          <dl>
            <StatusRow label="Capital" value={content.state.capital} reforming />
            <StatusRow label="Counties" value={content.state.counties} reforming />
            <StatusRow label="Security" value={content.state.security} reforming />
          </dl>
          <p className="state-card-note">
            Security remains tied to Merryweather-era remnants. Cerberus State Guard is not yet formed.
          </p>
        </aside>
      </section>

      <section className="notice">
        <span>PUBLIC NOTICE // ROSEFIRE TRANSITION</span>
        <p>{content.state.notice}</p>
      </section>

      <section className="cards">
        {cards.map(([href, index, eyebrow, title, text]) => (
          <Link className="portal-card" href={href} key={href}>
            <span className="card-index">{index}</span>
            <div>
              <p>{eyebrow}</p>
              <h2>{title}</h2>
              <span>{text}</span>
            </div>
            <strong>↗</strong>
          </Link>
        ))}
      </section>
    </>
  );
}

function ContentPage({
  content,
  pageKey,
}: {
  content: SiteContent;
  pageKey: keyof SiteContent["pages"];
}) {
  const page = content.pages[pageKey];
  return (
    <section className="page-shell">
      <p className="section-kicker">STATE OF ROSEFIRE</p>
      <h1>{page.title}</h1>
      <p className="page-intro">{page.intro}</p>
      <div className="page-body">
        {page.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="page-callout">
        <strong>Page status</strong>
        <span>This page is live and ready for its full Rosefire content pass.</span>
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

function Admin({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
}) {
  const [draft, setDraft] = useState<SiteContent>(content);
  const [message, setMessage] = useState("");

  const updateState = (key: keyof SiteContent["state"], value: string) => {
    setDraft((current) => ({
      ...current,
      state: { ...current.state, [key]: value },
    }));
  };

  const updatePage = (
    key: keyof SiteContent["pages"],
    field: "title" | "intro" | "body",
    value: string,
  ) => {
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
  };

  const save = () => {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(draft));
    setContent(draft);
    setMessage("Draft saved in this browser.");
  };

  const reset = () => {
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    setDraft(defaultContent);
    setContent(defaultContent);
    setMessage("Browser draft reset to the live defaults.");
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rosefire-content.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="admin-shell">
      <div className="admin-heading">
        <div>
          <p className="section-kicker">ROSEFIRE CMS</p>
          <h1>Admin Dashboard</h1>
          <p>
            Edit site copy without hunting through components. For now, saves are a safe browser-only
            draft; the next step is wiring publishing to Cloudflare storage with login protection.
          </p>
        </div>
        <div className="admin-actions">
          <button className="button primary" onClick={save}>Save Draft</button>
          <button className="button secondary" onClick={exportJson}>Export JSON</button>
          <button className="text-button" onClick={reset}>Reset Draft</button>
        </div>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <p>Homepage</p>
          <h2>State Status Card</h2>
        </div>
        <div className="admin-grid">
          <Field label="State status" value={draft.state.status} onChange={(v) => updateState("status", v)} />
          <Field label="Capital" value={draft.state.capital} onChange={(v) => updateState("capital", v)} />
          <Field label="Counties" value={draft.state.counties} onChange={(v) => updateState("counties", v)} />
          <Field label="Security" value={draft.state.security} onChange={(v) => updateState("security", v)} />
        </div>
        <label className="admin-field full">
          <span>Public notice</span>
          <textarea value={draft.state.notice} onChange={(e) => updateState("notice", e.target.value)} />
        </label>
      </section>

      {(Object.keys(draft.pages) as Array<keyof SiteContent["pages"]>).map((key) => {
        const page = draft.pages[key];
        return (
          <section className="admin-panel" key={key}>
            <div className="admin-panel-heading">
              <p>Page</p>
              <h2>{page.title}</h2>
            </div>
            <Field label="Title" value={page.title} onChange={(v) => updatePage(key, "title", v)} />
            <label className="admin-field full">
              <span>Intro</span>
              <textarea value={page.intro} onChange={(e) => updatePage(key, "intro", e.target.value)} />
            </label>
            <label className="admin-field full">
              <span>Body — separate paragraphs with a blank line</span>
              <textarea
                className="large"
                value={page.body.join("\n\n")}
                onChange={(e) => updatePage(key, "body", e.target.value)}
              />
            </label>
          </section>
        );
      })}
    </section>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [content, setContent] = useState<SiteContent>(() => loadContent());

  useEffect(() => {
    const handle = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);

  const page = useMemo(() => {
    if (path === "/") return <Home content={content} />;
    if (path === "/getting-started") return <ContentPage content={content} pageKey="gettingStarted" />;
    if (path === "/rules") return <ContentPage content={content} pageKey="rules" />;
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
      <Header />
      {page}
      <Footer />
    </main>
  );
}

export default App;
