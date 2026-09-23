export type TrackerItem = {
  label: string;
  value: string;
  tone: "declared" | "stagnant" | "limited" | "unformed";
};

export type NavItem = {
  label: string;
  href: string;
};

export type PortalCard = {
  index: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
};

export type ContentPage = {
  eyebrow: string;
  title: string;
  intro: string;
  body: string[];
  calloutTitle: string;
  calloutText: string;
};

export type RulesIntroCard = {
  title: string;
  body: string[];
  emphasis: string;
};

export type RulesLanding = {
  title: string;
  intro: string[];
  principle: string;
  closing: string;
  cards: RulesIntroCard[];
  categoriesTitle: string;
  categoriesIntro: string;
};

export type SiteContent = {
  brand: {
    name: string;
    shortMark: string;
    portalLabel: string;
  };
  navigation: NavItem[];
  hero: {
    kicker: string;
    lineOne: string;
    accent: string;
    lineTwo: string;
    lede: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  state: {
    statusLabel: string;
    status: string;
    sealTop: string;
    sealBottom: string;
    noticeLabel: string;
    notice: string;
    tracker: TrackerItem[];
  };
  cards: PortalCard[];
  rulesLanding: RulesLanding;
  pages: {
    gettingStarted: ContentPage;
    rules: ContentPage;
    government: ContentPage;
    world: ContentPage;
    faq: ContentPage;
  };
  footer: {
    lineOne: string;
    lineTwo: string;
  };
};

export const defaultContent: SiteContent = {
  brand: {
    name: "STATE OF ROSEFIRE",
    shortMark: "RF",
    portalLabel: "OFFICIAL COMMUNITY PORTAL",
  },
  navigation: [
    { label: "Start Here", href: "/getting-started" },
    { label: "Rules", href: "/rules" },
    { label: "Government", href: "/government" },
    { label: "World", href: "/world" },
    { label: "FAQ", href: "/faq" },
  ],
  hero: {
    kicker: "A STATE DECLARED. A FUTURE UNWRITTEN.",
    lineOne: "Survive.",
    accent: "Endure.",
    lineTwo: "Decide what comes next.",
    lede:
      "The State of Rosefire is a persistent FiveM survival roleplay world after the collapse. The state has been declared, Cayo Perico serves as its seat of power, and almost everything else remains to be built through play.",
    primaryLabel: "Enter Rosefire",
    primaryHref: "/getting-started",
    secondaryLabel: "Read the rules",
    secondaryHref: "/rules",
  },
  state: {
    statusLabel: "STATE STATUS",
    status: "DECLARED",
    sealTop: "ROSEFIRE",
    sealBottom: "EST. AFTER THE FALL",
    noticeLabel: "PUBLIC NOTICE // ROSEFIRE",
    notice:
      "The State of Rosefire has been declared. Existing county and city names remain in use while the state's institutions remain largely unformed.",
    tracker: [
      { label: "Statehood", value: "Declared", tone: "declared" },
      { label: "Seat of Power", value: "Cayo Perico", tone: "declared" },
      { label: "Government", value: "Stagnant", tone: "stagnant" },
      { label: "County Administration", value: "Not established", tone: "unformed" },
      { label: "Security", value: "Not established", tone: "unformed" },
      { label: "Housing", value: "Not established", tone: "unformed" },
      { label: "Medical", value: "Limited", tone: "limited" },
      { label: "Employment", value: "Informal", tone: "limited" },
      { label: "Infrastructure", value: "Stagnant", tone: "stagnant" },
    ],
  },
  cards: [
    {
      index: "01",
      eyebrow: "New to Rosefire?",
      title: "Getting Started",
      text: "Everything a new survivor needs before stepping into Rosefire.",
      href: "/getting-started",
    },
    {
      index: "02",
      eyebrow: "Community Standard",
      title: "Server Rules",
      text: "The rules that keep roleplay fair, readable, and fun.",
      href: "/rules",
    },
    {
      index: "03",
      eyebrow: "State Information",
      title: "Government",
      text: "Public information about the state and the institutions that exist today.",
      href: "/government",
    },
    {
      index: "04",
      eyebrow: "Know the World",
      title: "World & Lore",
      text: "Learn what a resident could reasonably know without spoiling deeper lore.",
      href: "/world",
    },
  ],
  rulesLanding: {
    title: "ROSEFIRE COMMUNITY & ROLEPLAY RULES",
    intro: [
      "Rosefire is built around collaborative storytelling, mutual respect, and creating a world where everyone's actions can contribute to the stories around them.",
      "These rules are not intended to turn roleplay into a maze of technicalities. They exist to establish clear expectations, protect players, and give staff a consistent foundation when problems occur.",
      "Staff should investigate situations rather than automatically assuming an accusation is true or false. When enforcement is necessary, players should understand what rule was involved and why their conduct crossed that line.",
      "Not every possible situation can be anticipated by a written rule. When something is not specifically addressed, use reasonable judgment, respect the people around you, protect the roleplay, and do not exploit technicalities to harm the community.",
    ],
    principle: "\"There isn't a rule saying I can't\" is not permission to abuse a loophole.",
    closing: "We are here to create stories together.",
    cards: [
      {
        title: "THE WORLD OF ROSEFIRE",
        body: [
          "Rosefire is a post-collapse survival roleplay setting where the state has been declared but most institutions remain incomplete or absent.",
          "You do not need to know hidden lore to join. Public setting information should be enough to create a character and begin playing.",
          "A character's identity, background, or personal traits do not limit the stories they may pursue unless a specific in-world rule or roleplay consequence applies.",
        ],
        emphasis: "Rosefire lore supports roleplay; it should not become a barrier to entering it.",
      },
      {
        title: "HOW TO USE THIS RULEBOOK",
        body: [
          "You are expected to understand the rules relevant to the roleplay you participate in, but you are not expected to memorize a giant legal document.",
          "When you're uncertain, return to the basic principles: use reasonable judgment, respect other players, protect the roleplay, and do not exploit technicalities.",
          "Specific sections below explain how those principles apply to common situations.",
        ],
        emphasis: "Use reasonable judgment. Respect other players. Protect the roleplay.",
      },
      {
        title: "WHEN SOMETHING GOES WRONG",
        body: [
          "Do not interrupt an active scene to argue rules, accuse someone of fail-RP, or threaten another player with staff action.",
          "Finish the scene when reasonably possible, disengage safely if necessary, and use Rosefire's reporting process afterward.",
          "Immediate safety concerns may always be brought to staff.",
        ],
        emphasis: "Players roleplay. Staff handle rule enforcement.",
      },
    ],
    categoriesTitle: "RULEBOOK SECTIONS",
    categoriesIntro: "The full rules will be organized below by topic as the existing rule set is migrated into Rosefire.",
  },
  pages: {
    gettingStarted: {
      eyebrow: "START HERE",
      title: "Getting Started",
      intro: "Your first steps into Rosefire.",
      body: [
        "Rosefire is a persistent FiveM survival roleplay world set after the collapse. New players should be able to arrive, understand the premise, and begin playing without studying a lore bible first.",
        "This page will hold connection details, character expectations, first-spawn guidance, starter information, and the opening player loop.",
      ],
      calloutTitle: "Page status",
      calloutText: "This page is ready for the full onboarding guide.",
    },
    rules: {
      eyebrow: "COMMUNITY STANDARD",
      title: "Server Rules",
      intro: "Clear rules, readable sections, one source of truth.",
      body: [
        "The existing rules can be migrated here and lightly rewritten where the setting or terminology needs to change.",
        "Discord can link directly to this page while the website remains the canonical version.",
      ],
      calloutTitle: "Page status",
      calloutText: "Rules migration is ready to begin.",
    },
    government: {
      eyebrow: "STATE INFORMATION",
      title: "Government",
      intro: "The State of Rosefire exists, but most of its institutions do not yet.",
      body: [
        "Rosefire has been declared and Cayo Perico serves as its seat of power. Beyond that, formal state institutions remain limited or unformed.",
        "Public projects, departments, laws, records, housing, medical services, employment systems, infrastructure, and security can be documented here as they actually come into existence.",
      ],
      calloutTitle: "Current posture",
      calloutText: "Declared, but largely stagnant.",
    },
    world: {
      eyebrow: "WORLD & LORE",
      title: "World & Lore",
      intro: "Deep enough to discover. Simple enough to join.",
      body: [
        "The recognizable counties, cities, and locations of San Andreas remain. Rosefire is the new state identity declared after the collapse.",
        "This public page should contain only information an ordinary resident could reasonably know. Deeper setting secrets can stay in-game until you choose to reveal them.",
      ],
      calloutTitle: "Lore policy",
      calloutText: "Public knowledge only. Spoilers stay out of the portal.",
    },
    faq: {
      eyebrow: "HELP",
      title: "Frequently Asked Questions",
      intro: "Quick answers before you need to ask staff.",
      body: [
        "This page will collect short, searchable answers to common questions about joining, roleplay, survival systems, applications, lore, and server expectations.",
      ],
      calloutTitle: "Page status",
      calloutText: "FAQ entries can be expanded as real questions come in.",
    },
  },
  footer: {
    lineOne: "STATE OF ROSEFIRE",
    lineTwo: "A FiveM survival roleplay community.",
  },
};
