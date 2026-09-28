export const siteConfig = {
  name: "ROSEFIRE RP",
  shortMark: "RF",
  subtitle: "COMMUNITY PORTAL",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Start Here", href: "/getting-started" },
    { label: "Rules", href: "/rules" },
    { label: "City Guide", href: "/city-guide" },
    { label: "Lore", href: "/lore" },
    { label: "Changelog", href: "/changelog" },
    { label: "FAQ", href: "/faq" },
  ],
  pages: {
    "/": "home.md",
    "/getting-started": "getting-started.md",
    "/rules": "rules.md",
    "/city-guide": "city-guide.md",
    "/lore": "lore.md",
    "/changelog": "changelog.md",
    "/faq": "faq.md",
  } as Record<string, string>,
};
