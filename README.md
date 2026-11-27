# Filtored Landing Page

Simple, clean landing page for www.filtored.com

## Structure

- `index.html` - Homepage
- `site.css` - Shared styles for every page (dark theme)
- `pages.css` - Extra styles for the inner pages, loaded after `site.css`
- `site.js` - Shared scripts: nav, animations, homepage demos, footer signup, cookie consent
- `promo.js` - Promo banner and countdown
- `<page>/index.html` - Inner pages (pricing, faq, contact, blog, patch-notes, privacy, terms)
- `features/`, `download/`, `download.html` - Noindex redirects kept for old links
- `patch-notes/index.html` - Release notes page
- `patch-notes/feed.xml` - Generated RSS feed of the release notes
- `tools/generate-patch-feed.js` - Regenerates `patch-notes/feed.xml` from the page

## Patch Notes RSS Feed

`https://filtored.com/patch-notes/feed.xml` is a plain RSS 2.0 file that feed readers
and Discord bots (MonitoRSS and similar) can subscribe to.

It is generated from the latest `<article class="patch-entry">` block and the
`<details class="patch-fold">` blocks under "Previous releases" in
`patch-notes/index.html`, so after adding a release:

1. Add the new `<article class="patch-entry" id="version-x-y-z">` block at the top of the list.
2. Move the previous latest release into a `<details class="patch-fold">` block at the top of
   "Previous releases" (same `id`, `<div class="patch-body">` unchanged).
3. Run `node tools/generate-patch-feed.js`.
4. Commit both `patch-notes/index.html` and `patch-notes/feed.xml`.

Use `node tools/generate-patch-feed.js --check` to confirm the committed feed matches the page.

Each entry needs an `id` (used as the item link anchor and the stable feed GUID), an
`<h2 class="patch-version">` title, and a `<time class="patch-date" datetime="YYYY-MM-DD">`.
Don't change the `id` or date of a published entry - feed readers would re-post it.

## Features

- Responsive design (mobile, tablet, desktop)
- Footer email signup posting to Formspree
- PostHog analytics, opted out until the visitor accepts the cookie banner

The homepage "Feature guides" section has six YouTube-hosted video guides. Each
guide's video ID is the `data-video` attribute of its `.guide-btn` in `index.html`.
The player loads only after the visitor selects Play. Preview frames are
`assets/v2/guide-*.jpg`. Videos are currently in English.

## Deployment Options

### Option 1: Netlify (Recommended - Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `Filtored` folder
3. Configure custom domain to `www.filtored.com`

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory
3. Follow prompts and add domain

### Option 3: GitHub Pages
1. Create GitHub repo
2. Push these files
3. Enable GitHub Pages in settings
4. Configure custom domain

### Option 4: Traditional Hosting
1. Upload files via FTP to your hosting provider
2. Point domain to hosting

## Email Signup

The footer signup form posts to Formspree (`action` on `.foot-signup`); `site.js`
submits it in the background and shows the status message.

## Customization

- Colors: Edit CSS variables in `:root` section of `site.css`
- Content: Edit text in `index.html` or the page's `index.html`
- Cache busting: pages load shared files with `?v=N`; bump N on every page after editing them

## Domain Setup

Point `www.filtored.com` DNS to your hosting provider:
- Netlify: Add CNAME record
- Vercel: Follow their domain instructions
- Traditional: A record to hosting IP
