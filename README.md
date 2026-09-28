# Rosefire RP Website

Public website for Rosefire RP.

## Editing the site

Normal site content lives in `public/content/` as Markdown. You should not need to edit React to update rules, guides, lore, the FAQ, or the changelog.

- `home.md` — homepage copy and status
- `getting-started.md` — new player guide
- `rules.md` — canonical server rules
- `city-guide.md` — systems and resident services
- `lore.md` — public lore
- `changelog.md` — player-facing updates
- `faq.md` — frequently asked questions

Edit the Markdown file, commit it, and push. The deployed site reads those files directly.

## Local development

```bash
npm install
npm run dev
```

Build verification:

```bash
npm run check
```

## Architecture

The React application is intentionally kept as the presentation layer. Navigation is defined in `src/react-app/siteConfig.ts`, Markdown parsing/rendering lives in `src/react-app/markdown.tsx`, and visual styling lives in `src/react-app/App.css`.

**Rosefire:** Playable at 1. Alive at 50.
