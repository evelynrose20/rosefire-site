# The Daily Globe — Publishing

The newspaper lives at https://rosefires.com/daily-globe.

## Publish a new story

1. On GitHub, open `public/content/daily-globe/articles/` and choose **Add file → Create new file**. If this folder is not present yet, enter the whole path as the new filename.
2. Name your article `your-story-title.md` using lowercase letters and hyphens.
3. Copy the following template, edit the details at the top, then simply paste your article below the second `---`.
4. Commit to `main` and wait for GitHub Pages deployment.
5. Share `https://rosefires.com/daily-globe/articles/your-story-title` in Discord.

```md
---
nav: false
title: Your newspaper headline
date: 2026-10-10
author: The Daily Globe Newsroom
category: Local News
summary: A short teaser for the newspaper's front page.
image:
imageAlt:
caption:
published: true
---

Paste the article text here.

Leave a blank line between paragraphs.

## Optional section heading

More of your article.
```

Images are optional. Upload a photograph to `public/content/images/` and write its filename in `image:`. Articles automatically appear in reverse date order, and category tabs are generated automatically.

To keep a public article out of the newspaper listing, set `published: false`. This is **not** private: the file remains publicly accessible by its direct URL. Keep truly unfinished or confidential drafts out of the public repository.

There is no hand-crafted HTML needed for each article. The site renders titles, dates, authors, article text and lead story cards automatically.
