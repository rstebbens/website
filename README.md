# Rob Stebbens website migration

Static GitHub Pages staging website. **Do not set the custom domain or change DNS yet.**

## Scope
This is a working first-pass foundation, not a verified full copy of Google Sites. The source site could not be programmatically retrieved, so unverified pages are explicitly marked rather than fabricated.

## Known pages and routes
- /
- /about/
- /project-page/
- /project-page/agile-games/
- /project-page/agile-games/icebreakers/
- /project-page/agile-games/flowtris/
- /follow-me/
- /youtube/

The site uses shared HTML/CSS/JS and direct links to the existing GitHub-hosted games, avoiding iframes.

## Review checklist
- [ ] Inventory all Google Sites pages and URLs
- [ ] Copy original page text, images and downloads
- [ ] Verify navigation and social/video destinations
- [ ] Recreate original Antarctic visual assets (only when source assets are available)
- [ ] Verify redirects and historic inbound links
- [ ] Test mobile and desktop
- [ ] Confirm analytics, metadata, sitemap and accessibility
- [ ] Configure GitHub Pages staging
- [ ] Only then configure the custom domain and DNS

## Hosting
Enable GitHub Pages from main/root. Preview at https://rstebbens.github.io/website/ (project-path hosting needs relative paths or a base path; see below).

**Important:** This scaffold currently uses root-relative links, which work at a domain root but not at /website/. For project-path staging, adjust paths to a base path before enabling or use a separate staging domain. No domain configuration has been changed.
