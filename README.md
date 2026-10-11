# Filtored Landing Page

Simple, clean landing page for www.filtored.com

## Structure

- `index.html` - Main HTML page
- `style.css` - All styles
- `script.js` - Email form handling and interactions
- `patch-notes/index.html` - Release notes page
- `patch-notes/feed.xml` - Generated RSS feed of the release notes
- `tools/generate-patch-feed.js` - Regenerates `patch-notes/feed.xml` from the page

## Patch Notes RSS Feed

`https://filtored.com/patch-notes/feed.xml` is a plain RSS 2.0 file that feed readers
and Discord bots (MonitoRSS and similar) can subscribe to.

It is generated from the `<article class="patch-entry">` blocks in
`patch-notes/index.html`, so after adding a release:

1. Add the new `<article class="patch-entry" id="version-x-y-z">` block at the top of the list.
2. Run `node tools/generate-patch-feed.js`.
3. Commit both `patch-notes/index.html` and `patch-notes/feed.xml`.

Use `node tools/generate-patch-feed.js --check` to confirm the committed feed matches the page.

Each entry needs an `id` (used as the item link anchor and the stable feed GUID), an
`<h2 class="patch-version">` title, and a `<time class="patch-date" datetime="YYYY-MM-DD">`.
Don't change the `id` or date of a published entry - feed readers would re-post it.

## Features

- Responsive design (mobile, tablet, desktop)
- Email signup form (ready to connect to backend)
- Modern gradient background
- Feature cards
- Clean typography

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

## Email Backend Integration

The email form currently shows a success message. To actually collect emails:

1. **Mailchimp**: Add Mailchimp form action URL
2. **ConvertKit**: Use ConvertKit API
3. **Custom Backend**: Uncomment fetch code in `script.js` and add your API endpoint
4. **Firebase**: Use Firestore to store emails
5. **Google Sheets**: Use Google Apps Script webhook

## Customization

- Colors: Edit CSS variables in `:root` section of `style.css`
- Content: Edit text in `index.html`
- Features: Add/remove feature cards in the `.features` section

## Domain Setup

Point `www.filtored.com` DNS to your hosting provider:
- Netlify: Add CNAME record
- Vercel: Follow their domain instructions
- Traditional: A record to hosting IP
