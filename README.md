# indicsense-website-2



A modern digital gurukulam for **IndicSense** — the cultural-intellectual society at IIITDM Kancheepuram.

## Stack

- **Astro** — static site framework
- **React** — interactive islands (calendar, gallery, quotes)
- **Tailwind CSS v4** — styling
- **Medium RSS** — auto-syncs Vṛttāntam articles

## Run locally

```bash
cd indicsense-website
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

## Build for production

```bash
npm run build
npm run preview
```

## Site structure

| Route | Feature |
|-------|---------|
| `/` | Homepage — hero, nitya karma, quote, articles, events, SPIC MACAY, videos, gallery |
| `/nitya-karma` | Daily posts feed |
| `/calendar` | Pañcāṅga-style festival calendar |
| `/vrittantam` | Medium articles (RSS) |
| `/events` | Samāgam, Saṅgam, Vīrasat |
| `/gallery` | Photo gallery with filters & lightbox |
| `/team` | Core team (Sevaks) |
| `/mentors` | Faculty mentors |
| `/about` | Club info & socials |

## Updating content

All content is JSON in `src/data/` — no CMS required.

| File | What to edit |
|------|----------------|
| `nitya-karma.json` | Daily posts |
| `quotes.json` | Rotating shlokas (IAST) |
| `calendar-data/2026.json` | Festival calendar (replace with spreadsheet export) |
| `events.json` | Event descriptions |
| `team.json` | Sevak names & quotes |
| `mentors.json` | Mentor bios |
| `gallery.json` | Gallery images (put files in `public/images/`) |
| `videos.json` | YouTube IDs when ready |
| `socials.json` | Instagram, YouTube, etc. URLs |

**Vṛttāntam articles** — keep publishing on [Medium](https://medium.com/@indicsense). They appear automatically via RSS.

## Calendar

The calendar UI is a placeholder. When your Canva design is ready:

1. Export spreadsheet dates to `src/data/calendar-data/YYYY.json`
2. Match the entry format in `2026.json`
3. Optionally restyle `PanchangCalendar.tsx`

## Assets

- Logos: `public/images/logos/`
- Inspiration/reference art: `public/images/inspo/`
- Replace inspo images with real club photos in `gallery.json`

## Gallery Auto-Sync Script

A Node.js script at `scripts/sync-gallery.js` automatically generates `src/data/gallery.json` by scanning image folders in `public/images/`.

### How it works

1. **Dynamic folder discovery** — scans all directories in `public/images/` (no hardcoded list)
2. **Skips static asset folders**: `backgrounds`, `inspo`, `logos`
3. **Normalizes folder names** — collapses consecutive spaces, trims whitespace
4. **Category** extracted by removing 4-digit year and cleaning up spaces (lowercased)
5. **Year** extracted via word-boundary regex `/\b(20\d{2})\b/`
6. **Alt text** generated as `${category} photograph`
7. **Supported formats**: jpg, jpeg, png, webp, svg (recursive scan)

### Usage

```bash
node scripts/sync-gallery.js
```

Run this after adding new event photo folders to `public/images/` to regenerate `gallery.json` without manual edits.

### Current gallery.json structure

Each entry contains:
- `src` — path from public root (e.g., `/images/orientation2024/IMG_123.jpg`)
- `alt` — auto-generated alt text
- `category` — folder-derived slug (e.g., `orientation`, `sangam`, `virasat`)
- `year` — extracted year (e.g., 2024, 2025, 2026)

The gallery page (`/gallery`) filters by category and year using these fields.

## Deploy later

Works on Vercel, Netlify, or any static host:

```bash
npm run build
# deploy the `dist/` folder
```

## Design notes

- **IAST** for Sanskrit — use `class="iast"` or `font-sanskrit`
- Fonts: Cormorant Garamond, Tiro Devanagari Sanskrit, Source Serif 4

### Color palette

| Token | Hex | Use |
|-------|-----|-----|
| `parchment` | `#f5ede0` | Main background |
| `maroon` | `#7b1d1d` | Primary brand |
| `gold` | `#c9933a` | Accent, borders |
| `teal-deep` | `#1e4a4a` | Saṅgam accent |
| `ink` | `#1a1209` | Body text |
| `cream` | `#fdf6ed` | Card backgrounds |

Defined in `src/styles/global.css` (`@theme`).
