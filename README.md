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
├── portfolio.html          # Studio pipeline + advisory
├── ecosystem/index.html    # Hubs + trusted ecosystem
├── connect.html            # Contact
├── news.html               # Redirect → /content/
├── corridor.html           # Redirect → /ecosystem/
├── css/style.css           # Shared stylesheet
├── js/main.js              # Scroll reveal + site-wide white paper banner
├── img/
│   ├── logo.png            # Header logo (light background)
│   ├── logo-dark.png       # Footer logo (dark background)
│   ├── favicon.png         # Browser tab icon
│   ├── books/              # Book cover images
│   └── content/            # Content page media
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

## Content page (`/content/`)

Three sections with sticky sub-navigation:

- **News** — Luma calendar + CAI Nexus I, II, III roundtables
- **Research** — Nexus IV white paper (CAI × HFTC), with PDF downloads
- **Books** — Translation and contribution publications

## Site-wide features

- **White paper banner** — Injected on every page via `js/main.js` (Harvard AI × HFTC Policy White Paper 2026 No.1)
- **Logo & favicon** — PNG assets in `img/`; all asset paths are root-relative (`/img/...`)
- **Redirects** — `/news` → `/content/`, `/corridor` → `/ecosystem/`

## Deploying with GitHub Pages

1. Push to GitHub, branch `main`.
2. **Settings → Pages** → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Custom domain `caiglobal.ai` is set via `CNAME` + DNS (four GitHub Pages A records + `www` CNAME).

## Design system

Brand palette (CSS custom properties in `css/style.css`):

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0A1B33` | Hero, quote breaks, footer |
| `--accent` | `#0D47A1` | Buttons, links, tags |
| `--bg` | `#F7F9FC` | Light background |
| `--ink` | `#0F1117` | Headings on light background |

Typography: **Space Grotesk** (display), **Inter** (body), **IBM Plex Mono** (labels).
