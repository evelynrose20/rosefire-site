import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
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
const CONTENT_REQUEST_VERSION = Date.now().toString();

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

function SiteLink({ href, children, className, style }: { href: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  const external = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
  return (
    <a
      href={external ? href : toSiteUrl(href)}
      className={className}
      style={style}
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

function contentImageUrl(value?: string) {
  if (!value?.trim()) return "";
  const image = value.trim();
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return toSiteUrl(image);
  const file = image.replace(/^\.\//, "").replace(/^content\//, "");
  const relative = file.startsWith("images/") ? file : `images/${file}`;
  return `${import.meta.env.BASE_URL}content/${encodeURI(relative)}`;
}

function imageBackground(value?: string): CSSProperties | undefined {
  const url = contentImageUrl(value);
  if (!url) return undefined;
  return { backgroundImage: `linear-gradient(90deg, rgba(15,7,12,.88), rgba(15,7,12,.40)), url("${url.replace(/"/g, "%22")}")` };
}

function Header({ entries }: { entries: ContentEntry[] }) {
  const mainNav = entries.filter(entry => entry.nav && !["/", "/rules", "/faq", "/getting-started"].includes(entry.route))
    .sort((a, b) => a.navOrder - b.navOrder || a.title.localeCompare(b.title));
  const navigation = mainNav.length
    ? mainNav.map(entry => ({ label: entry.title, href: entry.route }))
    : siteConfig.navigation;

  return (
    <>
      <div className="utility-bar">
        <div className="utility-inner">
          <span>THE OFFICIAL ROSEFIRE COMMUNITY PORTAL</span>
          <div className="utility-links">
            <SiteLink href="/getting-started">New Player Guide</SiteLink>
            <SiteLink href="/rules">Community Rules</SiteLink>
            <SiteLink href="/faq">Help & FAQ</SiteLink>
          </div>
        </div>
      </div>
      <header className="site-header">
        <SiteLink className="brand" href="/">
          <span className="brand-mark">{siteConfig.shortMark}</span>
          <span>
            <strong>ROSEFIRE</strong>
            <small>MAKE A LIFE. BUILD A LEGACY.</small>
          </span>
        </SiteLink>
        <nav className="nav" aria-label="Primary navigation">
          {navigation.map(item => <SiteLink href={item.href} key={item.href}>{item.label}</SiteLink>)}
        </nav>
        <SiteLink className="resident-link" href="/getting-started">Plan Your Move <span aria-hidden="true">↗</span></SiteLink>
      </header>
    </>
  );
}

function Home({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const { meta, body } = document;
  const renderLink = (href: string, children: ReactNode) => <SiteLink href={resolveContentHref(href, entries, file)}>{children}</SiteLink>;

  return (
    <>
      <section className={`hero tourism-hero${meta.heroImage ? " has-custom-hero" : ""}`} style={imageBackground(meta.heroImage)}>
        <div className="hero-copy">
          <p className="kicker">{meta.kicker || "WELCOME TO ROSEFIRE"}</p>
          <h1>{meta.title || "A Place to Call Home."}</h1>
          <p className="hero-motto">{meta.motto || "MAKE A LIFE. BUILD A LEGACY."}</p>
          <p className="lede">{meta.description}</p>
          <div className="hero-actions">
            <SiteLink className="button primary" href="/getting-started">Plan Your Move <span aria-hidden="true">→</span></SiteLink>
            <SiteLink className="button secondary" href="/explore">Discover Rosefire</SiteLink>
          </div>
        </div>
        <div className="hero-seal" aria-hidden="true"><span>ROSEFIRE</span><strong>RF</strong><small>YOUR FUTURE BEGINS HERE</small></div>
      </section>
      <section className="welcome-strip" aria-label="About Rosefire">
        <div><span className="section-kicker">A NEW CHAPTER AWAITS</span><h2>Find your place. Build your future.</h2></div>
        <p>Whether you're looking for a fresh start, a new career, or somewhere to put down roots, there's a place for you in Rosefire.</p>
      </section>
      <section className="discover-section" aria-labelledby="discover-heading">
        <p className="section-kicker">LIFE IN ROSEFIRE</p>
        <h2 id="discover-heading">Everything you need to make it yours.</h2>
        <div className="discover-grid">
          <SiteLink className="feature-card feature-discover" style={imageBackground(meta.exploreImage)} href="/explore"><span className="feature-number">01 / EXPLORE</span><h3>Discover the City</h3><p>From bustling streets to places worth getting lost in, see what Rosefire has to offer.</p><span className="feature-arrow">Explore the guide →</span></SiteLink>
          <SiteLink className="feature-card feature-work" style={imageBackground(meta.workImage)} href="/city-guide"><span className="feature-number">02 / OPPORTUNITY</span><h3>Find Your Calling</h3><p>Explore local work, professional careers, and opportunities to make a name for yourself.</p><span className="feature-arrow">Explore opportunities →</span></SiteLink>
          <SiteLink className="feature-card feature-home" style={imageBackground(meta.homeImage)} href="/getting-started"><span className="feature-number">03 / NEW BEGINNINGS</span><h3>Make Yourself at Home</h3><p>Get acquainted with the city, establish your footing, and begin your next chapter.</p><span className="feature-arrow">Plan your move →</span></SiteLink>
        </div>
      </section>
      <section className="editorial-section">
        <div className="editorial-intro"><p className="section-kicker">WELCOME TO YOUR NEXT CHAPTER</p><h2>There's more than one way to build a legacy.</h2></div>
        <article className="markdown-content home-content">
          <Markdown source={body} renderLink={renderLink} />
        </article>
      </section>
      <section className="move-cta"><p className="section-kicker">READY FOR A FRESH START?</p><h2>Your future is waiting in Rosefire.</h2><p>Start with the essentials, get to know your new home, and see where the road takes you.</p><SiteLink className="button primary" href="/getting-started">Start Your Journey →</SiteLink></section>
      <section className="community-note"><div><p className="section-kicker">OUT OF CHARACTER / COMMUNITY</p><h2>Here for the roleplay community?</h2><p>Find the rules, connection instructions, and player guides in our dedicated community information area.</p></div><div className="community-actions"><SiteLink href="/rules">Community Rules →</SiteLink><SiteLink href="/getting-started">Player Getting Started →</SiteLink><SiteLink href="/faq">Help & FAQ →</SiteLink></div></section>
    </>
  );
}

function ExplorePage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const { meta, body } = document;
  const renderLink = (href: string, children: ReactNode) => <SiteLink href={resolveContentHref(href, entries, file)}>{children}</SiteLink>;
  return (
    <>
      <section className={`explore-hero${meta.heroImage ? " has-image" : ""}`} style={imageBackground(meta.heroImage)}>
        <div className="explore-hero-inner">
          <p className="section-kicker">{meta.kicker || "DISCOVER ROSEFIRE"}</p>
          <h1>{meta.title || "Explore Rosefire"}</h1>
          <p>{meta.description}</p>
          <SiteLink className="button primary" href="/city-guide">Browse the City Guide →</SiteLink>
        </div>
      </section>
      <section className="explore-intro">
        <p className="section-kicker">THE CITY IS YOURS TO DISCOVER</p>
        <h2>{meta.introTitle || "Find your kind of adventure."}</h2>
        <p>{meta.introText}</p>
      </section>
      <section className="explore-destinations" aria-label="Discover Rosefire">
        <SiteLink className="explore-tile" href="/city-guide/fun"><span>01 / CULTURE & ENTERTAINMENT</span><h3>Things to Do</h3><p>Find places to unwind, spend an afternoon, or make a night of it.</p><strong>Discover activities →</strong></SiteLink>
        <SiteLink className="explore-tile" href="/city-guide/jobs"><span>02 / PEOPLE & OPPORTUNITY</span><h3>Work & Careers</h3><p>Find a new direction, meet local businesses, and learn what moves the city.</p><strong>Discover careers →</strong></SiteLink>
        <SiteLink className="explore-tile" href="/city-guide"><span>03 / EVERYDAY LIFE</span><h3>Life in Rosefire</h3><p>Explore services, communities, transportation, and the places residents call home.</p><strong>Explore the city guide →</strong></SiteLink>
      </section>
      <section className="explore-story">
        <p className="section-kicker">GET TO KNOW THE CITY</p>
        <article className="markdown-content explore-copy"><Markdown source={body} renderLink={renderLink}/></article>
      </section>
      <section className="explore-next"><p className="section-kicker">YOUR NEXT CHAPTER</p><h2>See something you love? Make it home.</h2><SiteLink className="button primary" href="/getting-started">Plan Your Move →</SiteLink></section>
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
    fetch(`${import.meta.env.BASE_URL}content-index.json?v=${CONTENT_REQUEST_VERSION}`, { cache: "no-store" })
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

    fetch(`${import.meta.env.BASE_URL}content/${encodeURI(file)}?v=${CONTENT_REQUEST_VERSION}`, { cache: "no-store" })
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
      ) : path === "/explore" ? (
        <ExplorePage document={document} entries={indexedEntries} file={activeFile} />
      ) : (
        <DocumentPage document={document} entries={indexedEntries} file={activeFile} />
      )}
      <footer>
        <div><strong>ROSEFIRE</strong><p>Make a Life. Build a Legacy.</p></div>
        <div className="footer-links"><SiteLink href="/explore">Explore</SiteLink><SiteLink href="/getting-started">New Residents</SiteLink><SiteLink href="/lore">Our Story</SiteLink></div>
        <div className="footer-community"><span>COMMUNITY / OOC</span><SiteLink href="/rules">Rules</SiteLink><SiteLink href="/faq">FAQ</SiteLink><SiteLink href="/changelog">Updates</SiteLink></div>
      </footer>
    </main>
  );
}

export default App;
