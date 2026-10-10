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

**Rosefire:** Make a Life. Build a Legacy.

## Obsidian navigation and homepage pictures

The website scans `public/content/` recursively at build time. In Obsidian, add frontmatter to a Markdown page to include it in the **main navigation**:

```yaml
---
nav: true
navOrder: 4
navTitle: Explore Rosefire
---
```

The homepage logo provides Home; Rules, FAQ and Getting Started stay in the OOC utility area, while other `nav: true` pages automatically appear in the main navigation. If no public pages are marked `nav: true`, the default navigation is used. Any Markdown page can still be visited at its automatically generated URL whether or not it's in the menu. Commit and push new pages to publish them.

### Change hero and card banners without touching React or CSS

Open `public/content/home.md` in Obsidian and edit these **optional** frontmatter keys:

```yaml
heroImage: images/los-santos-skyline.webp
exploreImage: images/city-guide.webp
workImage: images/jobs.webp
homeImage: images/housing.webp
```

Put the images in `public/content/images/` (inside the Obsidian content folder) and push them along with the Markdown update. Filenames, including spaces, are supported. You can also use a root-relative path such as `/images/rosefire-hero.webp` for files in `public/images/`, or a full HTTPS URL. Leave a key empty to keep the built-in gradient. Banner images use `cover` and a contrast overlay: wide screenshots work best; narrow screens crop the sides without stretching the page.

### Insert additional images into homepage text

Use the existing Obsidian embed syntax anywhere in the **body** of `home.md`:

```md
![[my-city-photo.webp]]
```

Or Markdown syntax: `![Downtown Rosefire](images/my-city-photo.webp)`.

Place the file in `public/content/images/`. Embedded photographs get a full-width row on the homepage and display at a maximum height of 460px with `object-fit: contain`, so different image sizes won't distort the editorial grid. On other Markdown pages images keep the existing responsive renderer.
