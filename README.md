# CAI Global — Website

Static website for **CAI | Canada–Asia Council for AI & Digital Innovation**.

Live site (once deployed): `https://caiglobal.ai`

## Structure

```
.
├── index.html          # Home
├── team.html            # Team
├── news.html             # News & Research (AI Governance white papers, Nexus Series)
├── studio.html           # AI Venture Studio (Bio + Applied AI)
├── portfolio.html        # Studio pipeline + advisory engagements
├── corridor.html         # Hubs + trusted ecosystem
├── connect.html          # Contact
├── css/
│   └── style.css         # Shared stylesheet (design tokens + components)
├── js/
│   └── main.js           # Shared behavior (scroll reveal)
├── img/                  # Image assets (logos, photography — none yet)
├── .nojekyll              # Disables Jekyll processing on GitHub Pages
└── README.md
```

Each page is a self-contained static HTML file that shares `css/style.css` and
`js/main.js`. There is no build step — this repo can be deployed as-is.

## Design system

Brand palette (CSS custom properties, defined in `css/style.css`):

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0A1B33` | Deep Tech Blue — hero, quote breaks, footer |
| `--accent` | `#0D47A1` | Highlight blue — buttons, links, tags |
| `--bg` | `#F7F9FC` | Light institutional background (body sections) |
| `--ink` | `#0F1117` | Graphite black — headings on light background |
| `--silver` | `#5B6478` / `#8892A6` | Secondary text (light / dark background) |

Typography: **Space Grotesk** (display), **Inter** (body), **IBM Plex Mono**
(labels, data, coordinates) — loaded via Google Fonts.

## Deploying with GitHub Pages

1. Push this repository to GitHub (e.g. `cai-global/website`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save. GitHub will publish at `https://<org>.github.io/<repo>/`.
5. To use the custom domain `caiglobal.ai`:
   - Add a file named `CNAME` to the repo root containing exactly:
     `caiglobal.ai`
   - In GoDaddy's DNS management for `caiglobal.ai`, add:
     - Four `A` records pointing `@` to GitHub Pages' IPs
       (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
       `185.199.111.153`)
     - A `CNAME` record for `www` pointing to `<org>.github.io`
   - Back in GitHub, under **Settings → Pages**, enter `caiglobal.ai` as the
     custom domain and enable **Enforce HTTPS** once DNS propagates.

## Editing content

All copy lives directly in each page's HTML — search for the relevant
section heading (e.g. `PUBLICATIONS & ROUNDTABLES` in `news.html`) and edit
in place. Shared visual styling (colors, spacing, type) lives in
`css/style.css` only — change it once, and it updates every page.

## Notes for maintainers

- **Portfolio and advisory client names are intentionally withheld** pending
  confirmation of what can be disclosed publicly. See `portfolio.html`.
- No photography is currently used; the visual system relies on an abstract
  SVG "orbit" motif and typography. Add real photography to `img/` and
  reference it directly in each page's `<section class="hero">` if desired.
