# IndicSense Website

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
