export type SiteContent = {
  state: {
    name: string;
    tagline: string;
    status: string;
    capital: string;
    counties: string;
    security: string;
    notice: string;
  };
  pages: {
    gettingStarted: { title: string; intro: string; body: string[] };
    rules: { title: string; intro: string; body: string[] };
    government: { title: string; intro: string; body: string[] };
    world: { title: string; intro: string; body: string[] };
    faq: { title: string; intro: string; body: string[] };
  };
};

export const defaultContent: SiteContent = {
  state: {
    name: "State of Rosefire",
    tagline: "The old world ended. Rosefire did not.",
    status: "Rebuilding",
    capital: "Reforming",
    counties: "Reforming",
    security: "Reforming",
    notice:
      "Existing county and city names remain in use. Rosefire is the new state identity created during reconstruction.",
  },
  pages: {
    gettingStarted: {
      title: "Getting Started",
      intro: "Your first steps into Rosefire.",
      body: [
        "Rosefire is a persistent FiveM survival roleplay world set after the collapse. New players should be able to arrive, understand the premise, and begin playing without studying a lore bible first.",
        "This page will become the home for connection details, character expectations, first-spawn guidance, starter information, and the opening player loop.",
      ],
    },
    rules: {
      title: "Server Rules",
      intro: "Clear rules, readable sections, one source of truth.",
      body: [
        "The existing Nightrose rules will be migrated here and rewritten only where the setting or terminology needs to change.",
        "Discord can link directly to individual rule sections while this site remains the canonical version.",
      ],
    },
    government: {
      title: "Government",
      intro: "Rosefire is rebuilding its institutions in public.",
      body: [
        "The state government is de facto and still forming. Public works, medical services, security, laws, records, and civic projects can expand through roleplay and world events.",
        "Cerberus State Guard is a future institution. It has not formed yet; the security presence that may eventually become Cerberus still traces back to Merryweather.",
      ],
    },
    world: {
      title: "World & Lore",
      intro: "Deep enough to discover. Simple enough to join.",
      body: [
        "The recognizable counties, cities, and locations of San Andreas remain. Rosefire is the new state identity created during reconstruction.",
        "Supernatural elements can exist in the setting without becoming mandatory homework for ordinary survivor characters. Deeper truths are meant to be discovered through play.",
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      intro: "Quick answers before you need to ask staff.",
      body: [
        "This page will collect short, searchable answers to common questions about joining, roleplay, survival systems, applications, lore, and server expectations.",
      ],
    },
  },
};

export const CONTENT_STORAGE_KEY = "rosefire-site-content-v1";
