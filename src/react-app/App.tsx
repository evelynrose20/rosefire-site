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
          <SiteLink className="feature-card feature-discover" style={imageBackground(meta.exploreImage)} href="/explore"><span className="feature-number">01 / EXPLORE</span><h3>Explore San Andreas</h3><p>From the heart of Los Santos to desert towns and northern mountain trails, discover the state.</p><span className="feature-arrow">Explore the guide →</span></SiteLink>
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
          <SiteLink className="button primary" href="/regions/los-santos">Explore the Regions →</SiteLink>
        </div>
      </section>
      <section className="explore-intro">
        <p className="section-kicker">AN ENTIRE STATE TO EXPLORE</p>
        <h2>{meta.introTitle || "Find your kind of adventure."}</h2>
        <p>{meta.introText}</p>
      </section>
      <section className="explore-regions" aria-label="Regions of San Andreas">
        <SiteLink className="region-card" href="/regions/los-santos" style={imageBackground(meta.losSantosImage)}><span className="region-eyebrow">LOS SANTOS</span><h3>Los Santos</h3><p>Vinewood, downtown streets, local shops, and the city's famous neighborhoods.</p><strong>Explore this region →</strong></SiteLink>
        <SiteLink className="region-card" href="/regions/desert" style={imageBackground(meta.desertImage)}><span className="region-eyebrow">BLAINE COUNTY</span><h3>Sandy Shores & the Desert</h3><p>Visit Sandy Shores, Grapeseed, and the shores of the Alamo Sea.</p><strong>Explore this region →</strong></SiteLink>
        <SiteLink className="region-card" href="/regions/paleto-bay" style={imageBackground(meta.paletoImage)}><span className="region-eyebrow">NORTHERN COAST</span><h3>Paleto Bay & the North</h3><p>Take the northern highway to Paleto Bay, forests, and ocean views.</p><strong>Explore this region →</strong></SiteLink>
        <SiteLink className="region-card" href="/regions/coast" style={imageBackground(meta.coastImage)}><span className="region-eyebrow">PACIFIC SHORE</span><h3>Beaches & Coastline</h3><p>Spend a day at Vespucci Beach, Del Perro Pier, or on the coast road.</p><strong>Explore this region →</strong></SiteLink>
        <SiteLink className="region-card" href="/regions/wilderness" style={imageBackground(meta.wildernessImage)}><span className="region-eyebrow">HIGH COUNTRY</span><h3>Mount Chiliad & Wilderness</h3><p>Head up Mount Chiliad for trails, forest roads, and wide views.</p><strong>Explore this region →</strong></SiteLink>
      </section>
      <section className="explore-story">
        <p className="section-kicker">THE LAND AND ITS STORIES</p>
        <article className="markdown-content explore-copy"><Markdown source={body} renderLink={renderLink}/></article>
      </section>
      <section className="explore-next"><p className="section-kicker">YOUR NEXT CHAPTER</p><h2>See something you love? Make it home.</h2><SiteLink className="button primary" href="/getting-started">Plan Your Move →</SiteLink></section>
    </>
  );
}

function RegionPage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const { meta, body } = document;
  const renderLink = (href: string, children: ReactNode) => <SiteLink href={resolveContentHref(href, entries, file)}>{children}</SiteLink>;
  return (
    <>
      <section className="region-hero" style={imageBackground(meta.heroImage)}>
        <div className="region-hero-inner">
          <SiteLink className="region-back" href="/explore">← Explore San Andreas</SiteLink>
          <p className="section-kicker">{meta.kicker || "A SAN ANDREAS DESTINATION"}</p>
          <h1>{meta.title || "A Place to Discover"}</h1>
          {meta.description && <p>{meta.description}</p>}
        </div>
      </section>
      <article className="region-article markdown-content">
        <Markdown source={body} renderLink={renderLink}/>
        <div className="region-ending"><SiteLink href="/explore">← Explore more of San Andreas</SiteLink><SiteLink href="/getting-started">Plan Your Move →</SiteLink></div>
      </article>
    </>
  );
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function LeisurePage({ document }: { document: MarkdownDocument }) {
  const { meta } = document;
  const cards = [
    {label:"WEEKEND DESTINATION", title:"Diamond Casino & Resort", desc:"Gaming, racing, and an evening out in Los Santos.", href:"/city-guide/fun/diamond-casino", image:meta.casinoImage},
    {label:"SPORT & LEISURE", title:"Los Santos Golf Club", desc:"Spend an afternoon on the fairways.", href:"/city-guide/fun/los-santos-golf-club", image:meta.golfImage},
  ];
  return <div className="leisure-page">
    <section className="leisure-hero" style={imageBackground(meta.heroImage)}><div>
      <p className="section-kicker">VISIT SAN ANDREAS / LEISURE</p>
      <h1>Things to Do in San Andreas</h1>
      <p>From a weekend at the Diamond to a day in the mountains, find something to do around the state.</p>
    </div></section>
    <section className="leisure-wrap">
      <p className="section-kicker">ENTERTAINMENT & ATTRACTIONS</p><h2>Plan a day out.</h2>
      <div className="leisure-feature-grid">
        {cards.map(card=><SiteLink key={card.href} href={card.href} className="leisure-feature" style={imageBackground(card.image)}>
          <span>{card.label}</span><h3>{card.title}</h3><p>{card.desc}</p><strong>Visit the guide →</strong>
        </SiteLink>)}
      </div>
      <p className="section-kicker leisure-subhead">FRESH AIR & OPEN COUNTRY</p><h2>Head outdoors.</h2>
      <div className="leisure-small-grid">
        <div className="leisure-activity"><h3>Fishing</h3><p>Pack your tackle and spend a quiet morning near the water.</p></div>
        <div className="leisure-activity"><h3>Hunting</h3><p>Explore the rural country and follow local regulations.</p></div>
        <div className="leisure-activity"><h3>Discoveries & Collections</h3><p>Keep an eye out for unusual finds while you explore the state.</p></div>
      </div>
      <div className="leisure-links">
        <SiteLink href="/explore">Explore the regions →</SiteLink>
        <SiteLink href="/city-guide/celebrations">Annual celebrations calendar →</SiteLink>
      </div>
    </section>
    <section className="leisure-season" style={imageBackground(meta.winterImage)}>
      <div><p className="section-kicker">NOVEMBER 1 – MARCH 31</p><h2>Winter in San Andreas</h2>
      <p>Snow remains on the ground throughout the five-month winter season. See where to go and what to expect before setting off.</p>
      <SiteLink className="button primary" href="/city-guide/winter">Winter travel guide →</SiteLink></div>
    </section>
    <section className="leisure-wrap leisure-calendar-teaser"><p className="section-kicker">THROUGHOUT THE YEAR</p><h2>Something on the calendar.</h2>
      <p>Browse the annual calendar, from New Year's Day to the December holidays. Listings describe the dates, not guaranteed organized events.</p>
      <SiteLink className="button secondary" href="/city-guide/celebrations">View the full annual calendar →</SiteLink>
    </section>
  </div>;
}

function CalendarPage({ document }: { document: MarkdownDocument }) {
  const currentMonth = new Date().getMonth();
  const sections = document.body.split(/^## (January|February|March|April|May|June|July|August|September|October|November|December)\s*$/m);
  const events = new Map<string,string[]>();
  for(let i=1;i<sections.length;i+=2) events.set(sections[i],sections[i+1].split("\n").map(x=>x.trim()).filter(x=>x.startsWith("- ")).map(x=>x.slice(2)));
  const seasons = ["Winter","Winter","Winter","Spring","Spring","Summer","Summer","Summer","Autumn","Autumn","Winter","Winter"];
  const currentSeason = seasons[currentMonth];
  return <div className="calendar-page">
    <section className="leisure-hero" style={imageBackground(document.meta.heroImage)}><div>
      <p className="section-kicker">THE SAN ANDREAS YEAR</p><h1>Annual Celebrations</h1>
      <p>Mark the dates that bring people together. Every month is listed, with the current season highlighted.</p>
    </div></section>
    <div className="leisure-wrap">
      <p className="calendar-current">Current season: <strong>{currentSeason}</strong></p>
      <div className="calendar-grid">
        {MONTHS.map((month,index)=><section key={month} className={`calendar-month${seasons[index]===currentSeason?" current-season":""}${index===currentMonth?" current-month":""}`}>
          <div className="calendar-month-heading"><span>{String(index+1).padStart(2,"0")}</span><h2>{month}</h2></div>
          <p className="calendar-season">{seasons[index]}</p>
          <ul>{(events.get(month)||[]).map((event,i)=><li key={i}>{event}</li>)}</ul>
        </section>)}
      </div>
      <p className="calendar-note">Holiday dates are listed for reference. Local celebrations and event schedules may be announced separately.</p>
      <SiteLink href="/city-guide/winter">About the November–March winter season →</SiteLink>
    </div>
  </div>;
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
      ) : path.startsWith("/regions/") ? (
        <RegionPage document={document} entries={indexedEntries} file={activeFile} />
      ) : path === "/city-guide/fun" ? (
        <LeisurePage document={document}/>
      ) : path === "/city-guide/celebrations" ? (
        <CalendarPage document={document}/>
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
