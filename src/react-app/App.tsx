import { useEffect, useMemo, useState, type ReactNode } from "react";
import "./App.css";
import { Markdown, parseDocument, type MarkdownDocument } from "./markdown";
import { siteConfig } from "./siteConfig";

type ContentEntry = {
  route: string;
  file: string;
  title: string;
  nav: boolean;
  navOrder: number;
};

const BASE_PATH = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL.slice(0, -1) : import.meta.env.BASE_URL;

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

function normalizeLookup(value: string) {
  return decodeURIComponent(value)
    .replace(/^\.\//, "")
    .replace(/\\/g, "/")
    .replace(/\.md$/i, "")
    .replace(/^\/+/, "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
}

function resolveContentHref(href: string, entries: ContentEntry[], currentFile?: string) {
  if (/^(https?:)?\/\//i.test(href) || href.startsWith("#") || href.startsWith("mailto:")) return href;
  if (href.startsWith("/")) return href;

  const raw = normalizeLookup(href);
  const currentDir = currentFile?.includes("/") ? currentFile.slice(0, currentFile.lastIndexOf("/")) : "";
  const relativeCandidate = normalizeLookup(currentDir ? `${currentDir}/${href}` : href);

  const match = entries.find(entry => {
    const fileNoExt = normalizeLookup(entry.file);
    const basename = fileNoExt.split("/").pop() ?? fileNoExt;
    const route = normalizeLookup(entry.route);
    const title = normalizeLookup(entry.title);

    return fileNoExt === relativeCandidate ||
      fileNoExt === raw ||
      basename === raw ||
      route === raw ||
      title === raw;
  });

  return match?.route ?? href;
}

function SiteLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
  return (
    <a
      href={external ? href : toSiteUrl(href)}
      className={className}
      onClick={(event) => {
        if (!external && !href.startsWith("#") && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
          event.preventDefault();
          navigate(href);
        }
      }}
    >
      {children}
    </a>
  );
}

function Header({ entries }: { entries: ContentEntry[] }) {
  const markdownNav = entries
    .filter(entry => entry.nav)
    .sort((a, b) => a.navOrder - b.navOrder || a.title.localeCompare(b.title))
    .map(entry => ({ label: entry.title, href: entry.route }));

  const navigation = markdownNav.length ? markdownNav : siteConfig.navigation;

  return (
    <header className="site-header">
      <SiteLink className="brand" href="/">
        <span className="brand-mark">{siteConfig.shortMark}</span>
        <span>
          <strong>{siteConfig.name}</strong>
          <small>{siteConfig.subtitle}</small>
        </span>
      </SiteLink>
      <nav className="nav" aria-label="Primary navigation">
        {navigation.map(item => <SiteLink href={item.href} key={item.href}>{item.label}</SiteLink>)}
      </nav>
    </header>
  );
}

function Home({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const { meta, body } = document;
  const renderLink = (href: string, children: ReactNode) => <SiteLink href={resolveContentHref(href, entries, file)}>{children}</SiteLink>;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">{meta.kicker || "ROSEFIRE ROLEPLAY"}</p>
          <h1>{meta.title || "ROSEFIRE RP"}</h1>
          <p className="hero-motto">{meta.motto || "MAKE A LIFE. BUILD A LEGACY."}</p>
          <p className="lede">{meta.description}</p>
          <div className="hero-actions">
            <SiteLink className="button primary" href="/getting-started">Enter Rosefire</SiteLink>
            <SiteLink className="button secondary" href="/rules">Read the rules</SiteLink>
          </div>
        </div>
        <aside className="state-card">
          <p className="status-label">CURRENT STATUS</p>
          <p className="status-value"><span /> {meta.status || "FOUNDING TESTERS"}</p>
          <p>{meta.statusText || "Rosefire is in active development and preparing for its first outside testers."}</p>
        </aside>
      </section>
      <article className="markdown-content home-content">
        <Markdown source={body} renderLink={renderLink} />
      </article>
    </>
  );
}

function DocumentPage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const renderLink = (href: string, children: ReactNode) => <SiteLink href={resolveContentHref(href, entries, file)}>{children}</SiteLink>;

  return (
    <article className="page-shell markdown-content">
      {document.meta.eyebrow && <p className="section-kicker">{document.meta.eyebrow}</p>}
      <Markdown source={document.body} renderLink={renderLink} />
      {document.meta.updated && <p className="updated">Last updated: {document.meta.updated}</p>}
    </article>
  );
}

function App() {
  const [path, setPath] = useState(currentSitePath());
  const [entries, setEntries] = useState<ContentEntry[] | null>(null);
  const [document, setDocument] = useState<MarkdownDocument | null>(null);
  const [activeFile, setActiveFile] = useState("");
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const handlePopState = () => setPath(currentSitePath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content-index.json`)
      .then(response => {
        if (!response.ok) throw new Error("Unable to load content index");
        return response.json() as Promise<ContentEntry[]>;
      })
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  const pageMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of entries ?? []) map.set(entry.route, entry.file);
    for (const [route, file] of Object.entries(siteConfig.pages)) {
      if (!map.has(route)) map.set(route, file);
    }
    return map;
  }, [entries]);

  useEffect(() => {
    if (entries === null) return;

    const file = pageMap.get(path);
    setDocument(null);
    setActiveFile(file ?? "");
    setMissing(!file);

    if (!file) return;

    fetch(`${import.meta.env.BASE_URL}content/${encodeURI(file)}`)
      .then(response => {
        if (!response.ok) throw new Error("Unable to load page");
        return response.text();
      })
      .then(source => {
        setDocument(parseDocument(source));
        setMissing(false);
      })
      .catch(() => {
        setDocument(null);
        setMissing(true);
      });
  }, [entries, pageMap, path]);

  const indexedEntries = entries ?? [];

  return (
    <main>
      <Header entries={indexedEntries} />
      {missing ? (
        <section className="page-shell">
          <p className="section-kicker">404</p>
          <h1>That road is closed.</h1>
          <p className="page-intro">The page you were looking for does not exist.</p>
          <SiteLink className="button primary" href="/">Return home</SiteLink>
        </section>
      ) : !document ? (
        <section className="page-shell"><p className="page-intro">Loading Rosefire…</p></section>
      ) : path === "/" ? (
        <Home document={document} entries={indexedEntries} file={activeFile} />
      ) : (
        <DocumentPage document={document} entries={indexedEntries} file={activeFile} />
      )}
      <footer>
        <div>
          <strong>ROSEFIRE RP</strong>
          <p>Make a Life. Build a Legacy.</p>
        </div>
        <SiteLink href="/rules">Rules</SiteLink>
      </footer>
    </main>
  );
}

export default App;
