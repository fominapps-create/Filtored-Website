#!/usr/bin/env node
/**
 * Generates patch-notes/feed.xml from the entries in patch-notes/index.html.
 *
 * Run `node tools/generate-patch-feed.js` after editing the patch notes page.
 * Pass `--check` to verify the committed feed is up to date without writing it.
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://filtored.com';
const PAGE_URL = `${SITE}/patch-notes/`;
const FEED_URL = `${SITE}/patch-notes/feed.xml`;

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'patch-notes', 'index.html');
const feedPath = path.join(root, 'patch-notes', 'feed.xml');

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function stripTags(html) {
    return html.replace(/<[^>]+>/g, '');
}

function decodeEntities(text) {
    return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&');
}

function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function cdata(content) {
    // Split any literal "]]>" so it cannot terminate the CDATA section early.
    return `<![CDATA[${content.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function normalizeBody(html) {
    const lines = html.replace(/\r\n/g, '\n').split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

    const indents = lines
        .filter((line) => line.trim() !== '')
        .map((line) => line.match(/^ */)[0].length);
    const base = indents.length ? Math.min(...indents) : 0;

    return lines
        .map((line) => line.slice(base))
        .join('\n')
        // Relative links only resolve inside the page, so absolutize them for feed readers.
        .replace(/(href|src)="\.\.\//g, `$1="${SITE}/`)
        .trim();
}

function parseEntries(html) {
    const articleRe = /<article class="patch-entry"([^>]*)>([\s\S]*?)<\/article>/g;
    const entries = [];
    let match;

    while ((match = articleRe.exec(html)) !== null) {
        const [, attrs, inner] = match;

        const titleMatch = inner.match(/<h2 class="patch-version">([\s\S]*?)<\/h2>/);
        const dateMatch = inner.match(/<time class="patch-date" datetime="([^"]+)"/);
        const bodyMatch = inner.match(/<div class="patch-body">([\s\S]*?)<\/div>\s*$/);

        if (!titleMatch || !dateMatch || !bodyMatch) {
            throw new Error(`Could not parse a patch entry near: ${inner.slice(0, 120).trim()}`);
        }

        const title = decodeEntities(stripTags(titleMatch[1])).trim();
        const idMatch = attrs.match(/id="([^"]+)"/);
        const date = new Date(`${dateMatch[1]}T00:00:00Z`);

        if (Number.isNaN(date.getTime())) {
            throw new Error(`Invalid datetime "${dateMatch[1]}" on entry "${title}"`);
        }

        entries.push({
            title,
            slug: idMatch ? idMatch[1] : slugify(title),
            date,
            body: normalizeBody(bodyMatch[1]),
        });
    }

    return entries;
}

function buildFeed(entries) {
    const sorted = [...entries].sort((a, b) => b.date - a.date);
    const lastBuildDate = sorted[0].date.toUTCString();

    const items = sorted
        .map((entry) => {
            const url = `${PAGE_URL}#${entry.slug}`;

            return [
                '        <item>',
                `            <title>${escapeXml(entry.title)}</title>`,
                `            <link>${escapeXml(url)}</link>`,
                `            <guid isPermaLink="false">${escapeXml(url)}</guid>`,
                `            <pubDate>${entry.date.toUTCString()}</pubDate>`,
                '            <category>Release</category>',
                '            <dc:creator>Filtored</dc:creator>',
                `            <description>${cdata(entry.body)}</description>`,
                `            <content:encoded>${cdata(entry.body)}</content:encoded>`,
                '        </item>',
            ].join('\n');
        })
        .join('\n');

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
        '    <channel>',
        '        <title>Filtored Patch Notes</title>',
        `        <link>${PAGE_URL}</link>`,
        '        <description>New features, improvements, and fixes in every Filtored AI Gallery release.</description>',
        '        <language>en</language>',
        `        <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
        '        <ttl>60</ttl>',
        '        <image>',
        '            <title>Filtored Patch Notes</title>',
        `            <url>${SITE}/favicon.png</url>`,
        `            <link>${PAGE_URL}</link>`,
        '        </image>',
        `        <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>`,
        items,
        '    </channel>',
        '</rss>',
        '',
    ].join('\n');
}

const html = fs.readFileSync(sourcePath, 'utf8');
const entries = parseEntries(html);

if (!entries.length) {
    console.error('No patch entries found in patch-notes/index.html - feed not written.');
    process.exit(1);
}

const feed = buildFeed(entries);

if (process.argv.includes('--check')) {
    const current = fs.existsSync(feedPath) ? fs.readFileSync(feedPath, 'utf8') : '';
    if (current !== feed) {
        console.error('patch-notes/feed.xml is out of date. Run: node tools/generate-patch-feed.js');
        process.exit(1);
    }
    console.log(`patch-notes/feed.xml is up to date (${entries.length} entries).`);
} else {
    fs.writeFileSync(feedPath, feed, 'utf8');
    console.log(`Wrote patch-notes/feed.xml with ${entries.length} entries.`);
}
