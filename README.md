# CAI Global — Website

Static website for **CAI | Canada–Asia Council for AI & Digital Innovation**.

Live site: `https://caiglobal.ai`

## Structure

```
.
├── index.html              # Home
├── team.html               # Team
├── content/index.html      # Content (News · Research · Books)
├── studio.html             # AI Venture Studio
├── studio/for-founders/    # Studio audience pages
├── studio/for-companies/
├── studio/for-partners/
├── portfolio.html          # Studio pipeline + advisory
├── ecosystem/index.html    # Hubs + trusted ecosystem
├── ecosystem/network/      # Full partner network
├── future-leaders/         # Future Leaders Initiative
├── connect.html            # Contact
├── terms.html · privacy.html
├── 404.html                # GitHub Pages not-found page
├── robots.txt · sitemap.xml
├── news.html · news/       # Redirect → /content/
├── corridor.html · corridor/  # Redirect → /ecosystem/
├── partials/               # Footer + research banner (source for sync-chrome)
├── scripts/sync-chrome.mjs # Propagate partials to all HTML pages
├── package.json            # npm run sync-chrome
├── css/style.css           # Shared stylesheet
├── js/main.js              # Mobile nav, scroll reveal, team modal, scroll-spy
├── img/
│   ├── logo.png · logo-dark.png
│   ├── cai-favicon-dark.png
│   ├── books/ · content/ · ecosystem/ · team/
├── research/               # White paper PDFs
├── CNAME                   # Custom domain (caiglobal.ai)
└── .nojekyll               # GitHub Pages — disable Jekyll
```

## Navigation

| Label     | URL           |
|-----------|---------------|
| Team      | `/team.html`  |
| Content   | `/content/`   |
| Studio    | `/studio.html`|
| Portfolio | `/portfolio.html` |
| Ecosystem | `/ecosystem/` |
| Connect   | `/connect.html` |

Footer adds Studio subpages, Future Leaders, Terms, Privacy, and social links.

## Content page (`/content/`)

Three sections with sticky sub-navigation:

- **News** — CAI Nexus roundtables + Luma archive link
- **Research** — CAI × HFTC AI Governance White Paper, with PDF downloads
- **Books** — Translation and contribution publications

## Site-wide features

- **White paper banner** — Inline HTML on content pages (EN/CN PDF + link to `/content/#research`)
- **Logo & favicon** — PNG assets in `img/`; paths are root-relative (`/img/...`)
- **Redirects** — `/news`, `/news.html`, `/corridor`, `/corridor.html` → Content / Ecosystem
- **Legacy** — `/studio/for-investors/` redirects to `/studio/for-partners/`

## Deploying with GitHub Pages

1. Push to GitHub, branch `main`.
2. **Settings → Pages** → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Custom domain `caiglobal.ai` is set via `CNAME` + DNS.

## Design system

Brand palette (CSS custom properties in `css/style.css`):

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0A1B33` | Hero, quote breaks, footer |
| `--accent` | `#0D47A1` | Buttons, links, tags |
| `--bg` | `#F7F9FC` | Light background |
| `--ink` | `#0F1117` | Headings on light background |

Typography: **Space Grotesk** (display), **Inter** (body), **IBM Plex Mono** (labels).

## Maintenance notes

- **Shared chrome:** Edit `partials/footer.html` or `partials/research-banner.html`, then run `npm run sync-chrome` (requires Node.js) to propagate across all pages.
- Header, research banner, and footer are duplicated in HTML until sync is run — the partials + script reduce drift risk.
