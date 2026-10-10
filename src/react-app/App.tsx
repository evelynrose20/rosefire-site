import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
        <div className="explore-copy">
          {body.split(/^## (.+)\s*$/m).slice(1).reduce<{title:string;content:string}[]>((parts,part,index,all)=>{
            if(index%2===0) parts.push({title:part.trim(),content:all[index+1]?.trim()||""});
            return parts;
          },[]).map((part,index)=><article className="explore-story-block" key={index}>
            <span className="explore-story-number">{String(index+1).padStart(2,"0")}</span>
            <div className="explore-story-body markdown-content"><h2>{part.title}</h2><Markdown source={part.content} renderLink={renderLink}/></div>
          </article>)}
        </div>
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
  const today = new Date();
  const currentMonth = today.getMonth();
  const day = today.getDate();
  const sections = document.body.split(/^## (January|February|March|April|May|June|July|August|September|October|November|December)\s*$/m);
  const entries = new Map<string,string[]>();
  const descriptions = new Map<string,string>();
  const activities = new Map<string,string[]>();
  for (let i=1;i<sections.length;i+=2) {
    const lines = sections[i+1].split("\n").map(line=>line.trim());
    entries.set(sections[i],lines.filter(line=>line.startsWith("- ") && !line.startsWith("- Activity: ")).map(line=>line.slice(2)));
    activities.set(sections[i],lines.filter(line=>line.startsWith("- Activity: ")).map(line=>line.slice(12)));
    descriptions.set(sections[i],lines.find(line=>line.startsWith("> "))?.slice(2) || "");
  }
  const seasonGroups = [
    {name:"Winter",subtitle:"November – March",intro:"Five months of snow-covered streets, mountain roads, and winter holidays.",months:[10,11,0,1,2]},
    {name:"Spring",subtitle:"April – May",intro:"Longer days and an excuse to spend more time outdoors.",months:[3,4]},
    {name:"Summer",subtitle:"June – August",intro:"Beach trips, warmer weather, and long days around the state.",months:[5,6,7]},
    {name:"Autumn",subtitle:"September – October",intro:"Anniversary celebrations in September and Halloween throughout October.",months:[8,9]}
  ];
  const active = seasonGroups.find(group=>group.months.includes(currentMonth))!;
  const activeIndex = seasonGroups.findIndex(group=>group.name===active.name);
  const orderedSeasons = [...seasonGroups.slice(activeIndex),...seasonGroups.slice(0,activeIndex)];
  const special = currentMonth===11 ? (day>=26?"New Year's celebrations":"Christmas season") :
    currentMonth===0 && day<=9 ? "New Year's celebrations" :
    ({1:"Valentine's Month",3:"Easter celebrations",8:"Rosefire Anniversary Month",9:"Halloween Month",10:"Thanksgiving Month"} as Record<number,string>)[currentMonth] || active.name+" in San Andreas";
  const celebrationDates = currentMonth===11 ? (day>=26?"December 26 – January 9":"December 1 – 25") :
    currentMonth===0 && day<=9 ? "December 26 – January 9" :
    ({1:"February 1 – 28/29",3:"April 1 – 30",8:"September 1 – 30",9:"October 1 – 31",10:"November 1 – 30"} as Record<number,string>)[currentMonth] || active.subtitle;
  const monthActivities = activities.get(MONTHS[currentMonth]) || [];
  const activeActivities = currentMonth===11 && day>=26 ? monthActivities.filter(item=>/new year/i.test(item)) :
    currentMonth===11 ? monthActivities.filter(item=>!/new year/i.test(item)) : monthActivities;
  return <div className="calendar-page">
    <section className="leisure-hero" style={imageBackground(document.meta.heroImage)}><div>
      <p className="section-kicker">A YEAR IN SAN ANDREAS</p><h1>Annual Celebrations</h1>
      <p>Seasonal traditions, community holidays, and a few good reasons to get together throughout the year.</p>
    </div></section>
    <div className="leisure-wrap">
      <section className={`calendar-spotlight season-${active.name.toLowerCase()}`}>
        {active.name==="Winter" && <span className="winter-flurries" aria-hidden="true"/>}
        <div className="calendar-spotlight-copy">
          <p className="section-kicker">THIS MONTH IN SAN ANDREAS · {MONTHS[currentMonth].toUpperCase()}</p>
          <h2>{special}</h2>
          <p className="calendar-spotlight-description">{descriptions.get(MONTHS[currentMonth]) || active.intro}</p>
          <p className="calendar-spotlight-dates">{celebrationDates}</p>
          <span className="spotlight-season">{active.name} season</span>
        </div>
        {activeActivities.length>0 && <aside className="calendar-spotlight-events">
          <p className="section-kicker">HAPPENING THIS MONTH</p>
          <ul>{activeActivities.map(item=><li key={item}>{item}</li>)}</ul>
        </aside>}
      </section>
      <div className="calendar-sections">
        {orderedSeasons.map(group=><section key={group.name} className={`calendar-season-section season-${group.name.toLowerCase()}`}>
          <div className="calendar-section-heading">
            <div><p className="section-kicker">{group.subtitle}</p><h2>{group.name} in San Andreas</h2><p>{group.intro}</p></div>
            {group.name===active.name && <span className="calendar-active-label">Current season</span>}
          </div>
          {group.name==="Winter" && <span className="winter-flurries" aria-hidden="true"/>}
          <div className="calendar-months">
            {group.months.map(index=><article key={index} className={`calendar-month${index===currentMonth?" current-month":""}`}>
              <div className="calendar-month-heading"><span>{String(index+1).padStart(2,"0")}</span><h3>{MONTHS[index]}</h3></div>
              {index===currentMonth && <span className="calendar-month-now">This month</span>}
              {descriptions.get(MONTHS[index]) && <p className="calendar-month-description">{descriptions.get(MONTHS[index])}</p>}
              <ul>{(entries.get(MONTHS[index])||[]).map((entry,i)=><li key={i}>{entry}</li>)}</ul>
              {(activities.get(MONTHS[index])||[]).length>0 && <div className="calendar-month-activities"><span>Seasonal traditions</span><ul>{activities.get(MONTHS[index])!.map(item=><li key={item}>{item}</li>)}</ul></div>}
            </article>)}
          </div>
        </section>)}
      </div>
      <p className="calendar-note">Holiday periods are part of the annual calendar. Individual activities and gatherings are announced when arranged.</p>
      <SiteLink href="/city-guide/winter">Visit the winter travel guide →</SiteLink>
    </div>
  </div>;
}

function WinterPage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const { meta, body } = document;
  const renderLink = (href: string, children: ReactNode) => <SiteLink href={resolveContentHref(href, entries, file)}>{children}</SiteLink>;
  const parts = body.split(/^## (Police Advisory|Department of Transportation|Emergency Medical Services|Winter Destinations|Winter Holidays)\s*$/m);
  const intro = parts[0].replace(/^# Winter in San Andreas\s*/,"").trim();
  const sections = new Map<string,string>();
  for (let i=1;i<parts.length;i+=2) sections.set(parts[i],parts[i+1].trim());
  const notices = [
    {heading:"Police Advisory",office:"LOCAL LAW ENFORCEMENT",symbol:"POLICE"},
    {heading:"Department of Transportation",office:"SAN ANDREAS DEPARTMENT OF TRANSPORTATION",symbol:"DOT"},
    {heading:"Emergency Medical Services",office:"EMERGENCY MEDICAL SERVICES",symbol:"EMS"}
  ];
  return <div className="winter-page">
    <section className="winter-hero" style={imageBackground(meta.heroImage)}>
      <span className="winter-flurries" aria-hidden="true"/>
      <div className="winter-hero-inner"><p className="section-kicker">SAN ANDREAS / SEASONAL TRAVEL</p>
        <h1>Winter in San Andreas</h1><p>Five months of snow-covered roads, neighborhoods, and mountains.</p>
        <div className="winter-dates"><span>SEASON BEGINS <strong>NOVEMBER 1</strong></span><span>SEASON ENDS <strong>MARCH 31</strong></span></div>
      </div>
    </section>
    <section className="winter-intro"><div className="winter-article markdown-content"><Markdown source={intro} renderLink={renderLink}/></div></section>
    <section className="winter-advisories"><div className="winter-advisories-inner">
      <p className="section-kicker">PUBLIC INFORMATION</p><h2>Winter notices from local services</h2>
      <p className="winter-advisories-lede">A little preparation makes winter travel safer. Read the seasonal guidance from agencies serving communities across the state.</p>
      <div className="winter-notice-grid">{notices.map(notice=><article className="winter-notice" key={notice.symbol}>
        <div className="winter-notice-heading"><span className="winter-agency-seal">{notice.symbol}</span><div><p>{notice.office}</p><h3>{notice.heading}</h3></div></div>
        <div className="markdown-content winter-notice-copy"><Markdown source={sections.get(notice.heading)||""} renderLink={renderLink}/></div>
      </article>)}</div></div></section>
    <section className="winter-extras">
      <div className="winter-extra-card"><p className="section-kicker">OUT & ABOUT</p><h2>See the state in winter</h2><div className="markdown-content"><Markdown source={sections.get("Winter Destinations")||""} renderLink={renderLink}/></div><SiteLink href="/explore">Explore San Andreas →</SiteLink></div>
      <div className="winter-extra-card"><p className="section-kicker">ON THE CALENDAR</p><h2>Winter holidays</h2><div className="markdown-content"><Markdown source={sections.get("Winter Holidays")||""} renderLink={renderLink}/></div><SiteLink href="/city-guide/celebrations">Annual celebrations →</SiteLink></div>
    </section>
    <div className="winter-return"><SiteLink href="/city-guide/fun">← Back to Things to Do</SiteLink></div>
  </div>;
}

function DiamondPage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const { meta, body } = document;
  const renderLink = (href: string, children: ReactNode) => <SiteLink href={resolveContentHref(href, entries, file)}>{children}</SiteLink>;
  const sectionNames = ["The Casino Floor","Inside Track & Rosefire Racing","Table Games","Membership & Chips","Dining & Nightlife","Penthouse Residences"];
  const parts = body.split(/^## (The Casino Floor|Inside Track & Rosefire Racing|Table Games|Membership & Chips|Dining & Nightlife|Penthouse Residences)\s*$/m);
  const intro = parts[0].replace(/^# Diamond Casino & Resort\s*/,"").trim();
  const sections = new Map<string,string>();
  for(let i=1;i<parts.length;i+=2) sections.set(parts[i],parts[i+1].trim());
  const penthouseStatus = meta.penthouseStatus || "Coming Soon";
  const penthouseReady = penthouseStatus.toLowerCase()==="available";
  return <div className="diamond-page">
    <section className="diamond-hero" style={imageBackground(meta.heroImage)}>
      <div className="diamond-hero-inner"><p className="section-kicker">LOS SANTOS / CASINO & RESORT</p>
        <h1>Diamond Casino <span>& Resort</span></h1>
        <p>{meta.description || "An evening out, a seat at the tables, and something worth dressing up for."}</p>
        <SiteLink className="diamond-hero-anchor" href="/city-guide/fun">← More things to do</SiteLink>
      </div>
    </section>
    <section className="diamond-hours"><div><span>WEEKEND VISITING HOURS</span><strong>Friday, 8:00 PM – Sunday, midnight</strong></div><div><span>ON THE CASINO FLOOR</span><strong>Games · Racing · High-limit tables</strong></div></section>
    <section className="diamond-intro"><div className="markdown-content"><Markdown source={intro} renderLink={renderLink}/></div></section>
    <section className="diamond-main">
      <p className="section-kicker">INSIDE THE DIAMOND</p><h2>Something for every evening.</h2>
      <div className="diamond-offerings">
        {sectionNames.slice(0,5).map((section,index)=><article className="diamond-offering" key={section}>
          <div className="diamond-offering-heading"><span>0{index+1}</span><h3>{section}</h3></div>
          <div className="markdown-content diamond-copy"><Markdown source={sections.get(section)||""} renderLink={renderLink}/></div>
        </article>)}
      </div>
    </section>
    <section className="diamond-penthouse" style={imageBackground(meta.penthouseImage)}>
      <div className="diamond-penthouse-content">
        <div className="diamond-penthouse-top"><p className="section-kicker">RESIDENCES AT THE DIAMOND</p><span className={`diamond-status${penthouseReady?" is-available":""}`}>{penthouseStatus}</span></div>
        <h2>{meta.penthouseTitle || "A Place Above It All."}</h2>
        <p className="diamond-penthouse-lede">{meta.penthouseDescription || "An exclusive residential address is taking shape at the Diamond Casino & Resort."}</p>
        <div className="markdown-content diamond-penthouse-copy"><Markdown source={sections.get("Penthouse Residences")||""} renderLink={renderLink}/></div>
      </div>
    </section>
    <div className="diamond-footer"><SiteLink href="/city-guide/fun">← Back to Things to Do</SiteLink></div>
  </div>;
}

function GolfPage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const { meta, body } = document;
  const renderLink = (href: string, children: ReactNode) => <SiteLink href={resolveContentHref(href, entries, file)}>{children}</SiteLink>;
  const sections = body.split(/^## (Nine Holes Available|A Message from Cait, Club Owner|Looking Ahead)\s*$/m);
  const parts = new Map<string,string>();
  for (let i=1;i<sections.length;i+=2) parts.set(sections[i],sections[i+1].trim());
  const intro = sections[0].replace(/^# Los Santos Golf Club\s*/,"").replace(/!\[\[Pasted image 20261004061402\.png\]\]/,"").trim();
  return <div className="golf-page">
    <section className="golf-hero" style={imageBackground(meta.heroImage || "images/Pasted image 20261004061402.png")}>
      <div className="golf-hero-content"><p className="section-kicker">LOS SANTOS / GOLF & LEISURE</p>
        <h1>Los Santos Golf Club</h1><p>Enjoy a round on the fairways while the club prepares for its next chapter.</p>
        <SiteLink href="/city-guide/fun" className="golf-back">← Things to Do in San Andreas</SiteLink>
      </div>
    </section>
    <section className="golf-status-bar">
      <div><span>COURSE STATUS</span><strong>{meta.clubStatus || "Limited Play"}</strong></div>
      <div><span>CURRENTLY AVAILABLE</span><strong>9 Holes</strong></div>
      <div><span>FULL REOPENING GOAL</span><strong>{meta.reopening || "Next Summer — Tentative"}</strong></div>
    </section>
    <section className="golf-welcome">
      <div className="golf-welcome-heading"><p className="section-kicker">THE COURSE TODAY</p><h2>A round is waiting.</h2></div>
      <div className="markdown-content golf-welcome-copy"><Markdown source={intro+"\n\n"+(parts.get("Nine Holes Available")||"")} renderLink={renderLink}/></div>
    </section>
    <section className="golf-owner">
      <div className="golf-owner-inner"><p className="section-kicker">FROM THE CLUB</p>
        <h2>A note from Cait</h2>
        <div className="markdown-content golf-owner-copy"><Markdown source={parts.get("A Message from Cait, Club Owner")||""} renderLink={renderLink}/></div>
        <p className="golf-owner-signature">CAIT · CLUB OWNER</p>
      </div>
    </section>
    <section className="golf-future" style={imageBackground(meta.reopeningImage)}>
      <div className="golf-future-inner"><p className="section-kicker">LOOKING AHEAD</p>
        <h2>More Golf. More to Enjoy.</h2>
        <span className="golf-future-status">{meta.reopening || "Next Summer — Tentative"}</span>
        <div className="markdown-content golf-future-copy"><Markdown source={parts.get("Looking Ahead")||""} renderLink={renderLink}/></div>
      </div>
    </section>
    <div className="golf-return"><SiteLink href="/city-guide/fun">← Back to Things to Do</SiteLink></div>
  </div>;
}

function UnderworldTerminal({ onExit }: { onExit: () => void }) {
  const bootLines = [
    "> connection lost: public network",
    "> switching relay ...",
    "> negotiating encrypted tunnel ...",
    "> identity withheld",
    "> accessing /rosefire/underground",
    "> handshake accepted"
  ];
  const [stage,setStage]=useState<"shutdown"|"boot"|"uplink"|"welcome">("shutdown");
  const [typed,setTyped]=useState("");
  const [uplinkSeconds,setUplinkSeconds]=useState(12);
  const [showLeads,setShowLeads]=useState(false);
  const fullText=bootLines.join("\n");
  useEffect(()=>{
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const shutdown=setTimeout(()=>setStage("boot"),2100);
    return ()=>{clearTimeout(shutdown);document.body.style.overflow=oldOverflow;};
  },[]);
  useEffect(()=>{
    if(stage!=="boot")return;
    let index=0;
    const timer=window.setInterval(()=>{
      index=Math.min(index+2,fullText.length);
      setTyped(fullText.slice(0,index));
      if(index===fullText.length){window.clearInterval(timer);finish=setTimeout(()=>setStage("uplink"),900);}
    },33);
    let finish:ReturnType<typeof setTimeout>|undefined;
    return ()=>{window.clearInterval(timer);if(finish)clearTimeout(finish);};
  },[stage,fullText]);
  useEffect(()=>{
    if(stage!=="uplink")return;
    setUplinkSeconds(12);
    let remaining=12;
    const countdown=window.setInterval(()=>{
      remaining-=1;
      setUplinkSeconds(remaining);
      if(remaining<=0){window.clearInterval(countdown);setStage("welcome");}
    },1000);
    return ()=>window.clearInterval(countdown);
  },[stage]);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")onExit();};
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[onExit]);
  return createPortal(<div className={`underworld-overlay underworld-${stage}`} style={{position:"fixed",top:0,left:0,right:"auto",bottom:"auto",width:"100vw",height:"100dvh",minWidth:"100vw",maxWidth:"none",margin:0,padding:0,zIndex:2147483647,background:"#030807",color:"#c9ebd1",overflowY:"auto",overflowX:"hidden",fontFamily:"Consolas, monospace",fontSize:16,lineHeight:1.65,isolation:"isolate"}} role="dialog" aria-modal="true" aria-label="Underground network">
    <button className="underworld-exit" type="button" onClick={onExit} style={{position:"fixed",top:18,right:20,zIndex:10002,padding:"10px 16px",background:"#13271b",border:"1px solid #578968",color:"#d1f4d5",fontFamily:"monospace",cursor:"pointer"}}>EXIT / ESC</button>
    {stage==="shutdown" ? <div className="underworld-blackout underworld-glitch" style={{minHeight:"100dvh",display:"grid",placeItems:"center",letterSpacing:".24em",color:"#f1b4ca"}}>
        <div className="underworld-glitch-frame"><p>ROSEFIRE / PUBLIC INFORMATION NETWORK</p><strong data-text="SIGNAL CORRUPTED">SIGNAL CORRUPTED</strong><span>CONNECTION INTERRUPTED // ERR 0x91</span><small>RECONNECTING TO UNKNOWN RELAY...</small></div>
      </div> :
      (stage==="boot" || stage==="uplink") ? <div className="underworld-boot" style={{minHeight:"100dvh",padding:"clamp(100px,15vh,180px) clamp(22px,6vw,110px) 60px"}}><p style={{fontSize:12,letterSpacing:".13em",color:"#89c49a",borderBottom:"1px solid #31513c",paddingBottom:16}}>RECOVERY CONSOLE // UNREGISTERED NODE</p><pre style={{fontFamily:"Consolas, monospace",fontSize:"clamp(14px,1.6vw,19px)",lineHeight:1.9,whiteSpace:"pre-wrap",color:"#c9e8cd"}}>{typed}<span className="underworld-cursor">█</span></pre>
      {stage==="uplink" && <div className="underworld-uplink"><p>ENCRYPTED UPLINK STARTING IN <strong>{String(uplinkSeconds).padStart(2,"0")}</strong> SECONDS</p><div className="underworld-uplink-track"><span style={{width:`${(12-uplinkSeconds)/12*100}%`}}/></div><p className="underworld-uplink-note">READBACK COMPLETE / PRIVATE TERMINAL INITIALIZING</p></div>}
      </div> :
      <div className="underworld-interface" style={{maxWidth:1280,margin:"65px auto 30px",padding:"0 clamp(18px,3vw,35px)"}}>
        <header><span>◈ UNDERGROUND RELAY</span><span>PRIVATE CONNECTION / IDENTITY MASKED</span></header>
        <div className="underworld-window" style={{padding:"clamp(25px,5vw,70px)",border:"1px solid #446b51",background:"#091710"}}>
          <p className="underworld-overline">INCOMING MESSAGE · UNKNOWN CONTACT</p>
          <h1>Well, look what found its way down here.</h1>
          <p>Call me <strong>Vesper</strong>. No need for names on your end, sweetheart. You've slipped past the polished brochures and the friendly faces. Welcome to Rosefire's underworld.</p>
          <p>Down here, people trade in favors, rumors, and opportunities that don't make the morning paper. Maybe you're curious. Maybe you're looking for something you shouldn't be. Either way, you're at the door now.</p>
          <p>So, what's it going to be? Have a look around ... or run right back to the safety of the streets above.</p>
          {!showLeads ? <div className="underworld-choices"><button type="button" onClick={()=>setShowLeads(true)}>Show me what's out there →</button><button type="button" onClick={onExit}>Take me back to safety</button></div> :
            <div className="underworld-leads"><p className="underworld-overline">THE UNDERGROUND / RUMORS & CONNECTIONS</p>
              <div><article><h2>Whispers</h2><p>Every city has secrets. Finding the right person is half the work.</p></article><article><h2>Favors</h2><p>Some doors only open when someone owes you something.</p></article><article><h2>After Dark</h2><p>The city changes after sundown. Pay attention to who stays awake.</p></article></div>
              <p className="underworld-muted">More connections will surface in time. Until then, keep your eyes open.</p>
              <button type="button" onClick={onExit}>Disappear back into Rosefire →</button>
            </div>}
        </div>
        <footer>ROSEFIRE / NO RECORD OF THIS SESSION</footer>
      </div>}
  </div>, document.documentElement);
}

function CityGuidePage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const {meta,body}=document;
  const [underworldOpen,setUnderworldOpen]=useState(false);
  const renderLink=(href:string,children:ReactNode)=><SiteLink href={resolveContentHref(href,entries,file)}>{children}</SiteLink>;
  const sections=body.split(/^## (.+)\s*$/m);
  const intro=sections[0].replace(/^# .+\n/,"").trim();
  const cards:{title:string;content:string}[]=[];
  for(let i=1;i<sections.length;i+=2)cards.push({title:sections[i].trim(),content:sections[i+1]?.trim()||""});
  return <div className="resident-guide">
    <section className="resident-guide-hero" style={imageBackground(meta.heroImage)}>
      <div className="resident-guide-hero-inner">
        <p className="section-kicker">{meta.kicker || "SAN ANDREAS / RESIDENT INFORMATION"}</p>
        <h1>{meta.title || "Living in San Andreas"}</h1>
        <p>{meta.description || "A practical guide to daily life, work, and services throughout the state."}</p>
      </div>
    </section>
    <section className="resident-guide-overview">
      <div><p className="section-kicker">A GUIDE FOR RESIDENTS</p><h2>{meta.introTitle || "Find what you need."}</h2></div>
      <div className="markdown-content"><Markdown source={intro} renderLink={renderLink}/></div>
    </section>
    <section className="resident-guide-directory">
      <div className="resident-guide-directory-title"><p className="section-kicker">RESIDENT DIRECTORY</p><h2>Life around the state.</h2></div>
      <div className="resident-guide-grid">
        {cards.map((card,i)=><article className="resident-guide-card" key={card.title}>
          <span className="resident-guide-number">{String(i+1).padStart(2,"0")}</span>
          <h3>{card.title}</h3>
          <div className="markdown-content resident-guide-card-copy"><Markdown source={card.content} renderLink={renderLink}/></div>
        </article>)}
      </div>
      <div className="underworld-discovery"><button className="underworld-signal" type="button" aria-label="Investigate unusual signal" title="Unidentified signal" onClick={()=>setUnderworldOpen(true)}><span className="underworld-shard" aria-hidden="true"><span className="underworld-shard-core"/><span className="underworld-shard-fracture"/><span className="underworld-shard-spark"/></span></button></div>
    </section>
    {underworldOpen && <UnderworldTerminal onExit={()=>setUnderworldOpen(false)}/>}
    <section className="resident-guide-end">
      <div><p className="section-kicker">A PLACE TO CALL HOME</p><h2>New to San Andreas?</h2><p>Get acquainted with the state, explore its communities, and find the information you need to settle in.</p></div>
      <div className="resident-guide-end-links"><SiteLink href="/getting-started">New resident information →</SiteLink><SiteLink href="/explore">Explore San Andreas →</SiteLink></div>
    </section>
  </div>;
}

function PublicServicePage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const {meta,body}=document;
  const renderLink=(href:string,children:ReactNode)=><SiteLink href={resolveContentHref(href,entries,file)}>{children}</SiteLink>;
  const type=file.includes("/police.md")?"police":file.includes("/ems-fire.md")?"medical":"transport";
  const labels=type==="police"?["PUBLIC SAFETY","COMMUNITY PROTECTION"]:type==="medical"?["MEDICAL & FIRE","EMERGENCY RESPONSE"]:["ROAD SERVICES","STATE TRANSPORTATION"];
  const parts=body.split(/^## (.+)\s*$/m);
  const intro=parts[0].replace(/^# [^\n]+/,"").trim();
  const sections:{heading:string;content:string}[]=[];
  for(let i=1;i<parts.length;i+=2)sections.push({heading:parts[i].trim(),content:parts[i+1]?.trim()||""});
  return <div className={`service-page service-${type}`}>
    <section className="service-hero" style={imageBackground(meta.heroImage)}>
      <div className="service-hero-inner"><SiteLink href="/city-guide" className="service-back">← Resident Guide</SiteLink>
        <p className="section-kicker">SAN ANDREAS · {labels[0]}</p>
        <span className="service-dept-mark">{meta.departmentMark||"SA"} <small>{labels[1]}</small></span>
        <h1>{meta.title}</h1><p>{meta.description}</p>
      </div>
    </section>
    <section className="service-intro"><div className="service-intro-label"><p className="section-kicker">ABOUT THE DEPARTMENT</p><h2>Serving San Andreas.</h2></div><div className="markdown-content"><Markdown source={intro} renderLink={renderLink}/></div></section>
    <section className="service-directory"><p className="section-kicker">INFORMATION & SERVICES</p>
      <div className="service-section-grid">{sections.map((part,i)=><article className="service-section" key={part.heading}>
        <span className="service-section-number">{String(i+1).padStart(2,"0")}</span><h2>{part.heading}</h2>
        <div className="markdown-content"><Markdown source={part.content} renderLink={renderLink}/></div>
      </article>)}</div>
    </section>
    {meta.recruitmentTitle && <section className="service-recruitment-banner">
      <div><p className="section-kicker">DEPARTMENT RECRUITMENT</p><h2>{meta.recruitmentTitle}</h2><p>{meta.recruitmentText||"Visit a public library or use your own laptop or desktop computer in San Andreas to view the department's website and recruitment information."}</p></div>
      <div className="service-recruitment-instructions"><span>WHERE TO APPLY</span><strong>At an in-city computer</strong><p>Visit the department's website on a library computer, laptop, or desktop. Applications are handled there, not on this visitor guide.</p></div>
    </section>}
    <div className="service-more"><SiteLink href="/city-guide/public-services/police">Police</SiteLink><SiteLink href="/city-guide/public-services/ems-fire">EMS & Fire</SiteLink><SiteLink href="/city-guide/public-services/dot">DOT</SiteLink></div>
  </div>;
}

function HousingPage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const {meta,body}=document;
  const renderLink=(href:string,children:ReactNode)=><SiteLink href={resolveContentHref(href,entries,file)}>{children}</SiteLink>;
  return <div className="housing-page">
    <section className="housing-hero" style={imageBackground(meta.heroImage)}><div className="housing-hero-inner">
      <SiteLink href="/city-guide">← Resident Guide</SiteLink><p className="section-kicker">SAN ANDREAS · HOMES & PROPERTY</p>
      <h1>{meta.title||"Find a Place to Call Home."}</h1><p>{meta.description}</p>
    </div></section>
    <section className="housing-intro"><div><p className="section-kicker">HOMES ACROSS THE STATE</p><h2>Settling in starts here.</h2></div><article className="markdown-content"><Markdown source={body} renderLink={renderLink}/></article></section>
    <section className="housing-contact"><p className="section-kicker">PROPERTY ENQUIRIES</p><h2>Looking for a home?</h2><p>Ask D8 about homes available for sale or lease and the arrangements for viewing a property. For current listings and property records, use the real estate services available within San Andreas.</p></section>
  </div>;
}

function JobsPage({ document, entries, file }: { document: MarkdownDocument; entries: ContentEntry[]; file: string }) {
  const {meta,body}=document;
  const renderLink=(href:string,children:ReactNode)=><SiteLink href={resolveContentHref(href,entries,file)}>{children}</SiteLink>;
  const parts=body.split(/^## (.+)\s*$/m);
  const intro=parts[0].replace(/^# [^\n]+/,"").trim();
  const sections=new Map<string,string>();
  for(let i=1;i<parts.length;i+=2) sections.set(parts[i].trim(),parts[i+1]?.trim()||"");
  const opportunities=[
    {label:"LOS SANTOS SANITATION",title:"Sanitation & Collection",description:"Keep the neighborhoods clean and complete scheduled refuse routes.",href:"/city-guide/jobs/garbage-job",image:meta.sanitationImage},
    {label:"JONNY SHAPIRO GAS SPECIALIST",title:"Propane Delivery",description:"Service customer propane tanks throughout Los Santos and Blaine County.",href:"/city-guide/jobs/propane-job",image:meta.propaneImage},
    {label:"UTILITIES",title:"Power Services",description:"Work connected to the state's electrical supply and infrastructure.",href:"/city-guide/jobs/power",image:meta.powerImage},
    {label:"UTILITIES",title:"Water Services",description:"Find out about work supporting the state's water services.",href:"/city-guide/jobs/water",image:meta.waterImage},
    {label:"TRANSPORTATION",title:"Taxi Services",description:"Learn about driving fares and passenger transportation.",href:"/city-guide/jobs/taxi",image:meta.taxiImage}
  ];
  return <div className="jobs-page">
    <section className="jobs-hero" style={imageBackground(meta.heroImage)}>
      <div className="jobs-hero-inner"><SiteLink href="/city-guide" className="jobs-back">← Resident Guide</SiteLink>
        <p className="section-kicker">SAN ANDREAS / EMPLOYMENT & CAREERS</p>
        <h1>{meta.title||"Find Your Next Opportunity."}</h1>
        <p>{meta.description||"Discover work, careers, and business opportunities throughout San Andreas."}</p>
      </div>
    </section>
    <section className="jobs-intro"><div><p className="section-kicker">WORKING IN SAN ANDREAS</p><h2>{meta.introTitle||"A living starts somewhere."}</h2></div>
      <div className="markdown-content"><Markdown source={intro} renderLink={renderLink}/></div>
    </section>
    <section className="jobs-opportunities"><p className="section-kicker">WORK OPPORTUNITIES</p><h2>On the job across San Andreas.</h2>
      <div className="jobs-opportunity-grid">{opportunities.map(item=><SiteLink className="jobs-opportunity-card" key={item.href} href={item.href} style={imageBackground(item.image)}>
        <span>{item.label}</span><h3>{item.title}</h3><p>{item.description}</p><strong>Employment information →</strong>
      </SiteLink>)}</div>
    </section>
    <section className="jobs-pathways">
      <article><p className="section-kicker">PUBLIC SERVICE</p><h2>Serve your community.</h2>
        <div className="markdown-content"><Markdown source={sections.get("Public Service Careers")||""} renderLink={renderLink}/></div>
        <div className="jobs-path-links"><SiteLink href="/city-guide/public-services/police">Police Department →</SiteLink><SiteLink href="/city-guide/public-services/ems-fire">EMS & Fire →</SiteLink><SiteLink href="/city-guide/public-services/dot">DOT Services →</SiteLink></div>
      </article>
      <article><p className="section-kicker">PRIVATE EMPLOYMENT</p><h2>Find a place on the team.</h2>
        <div className="markdown-content"><Markdown source={sections.get("Local Businesses & Employment")||""} renderLink={renderLink}/></div>
      </article>
    </section>
    <section className="jobs-more"><div><p className="section-kicker">YOUR NEXT STEP</p><h2>Looking for work?</h2>
      <div className="markdown-content"><Markdown source={sections.get("Finding Work")||""} renderLink={renderLink}/></div></div>
      <div className="jobs-more-note"><span>EMPLOYMENT INFORMATION</span><p>Use a public library computer, laptop, or desktop in San Andreas to view available positions and department websites.</p></div>
    </section>
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
      ) : path === "/city-guide/jobs" ? (
        <JobsPage document={document} entries={indexedEntries} file={activeFile}/>
      ) : path === "/city-guide/housing" ? (
        <HousingPage document={document} entries={indexedEntries} file={activeFile}/>
      ) : path.startsWith("/city-guide/public-services/") ? (
        <PublicServicePage document={document} entries={indexedEntries} file={activeFile}/>
      ) : path === "/city-guide" ? (
        <CityGuidePage document={document} entries={indexedEntries} file={activeFile}/>
      ) : path === "/city-guide/fun/los-santos-golf-club" ? (
        <GolfPage document={document} entries={indexedEntries} file={activeFile}/>
      ) : path === "/city-guide/fun/diamond-casino" ? (
        <DiamondPage document={document} entries={indexedEntries} file={activeFile}/>
      ) : path === "/city-guide/fun" ? (
        <LeisurePage document={document}/>
      ) : path === "/city-guide/winter" ? (
        <WinterPage document={document} entries={indexedEntries} file={activeFile}/>
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
