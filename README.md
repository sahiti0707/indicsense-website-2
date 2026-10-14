# indicsense-website-2



A modern digital gurukulam for **IndicSense** — the cultural-intellectual society at IIITDM Kancheepuram.

## Stack

- **Astro** — static site framework
- **React** — interactive islands (calendar, gallery, quotes)
- **Tailwind CSS v4** — styling
- **Medium RSS** — auto-syncs Vṛttāntam articles

## Run locally

```bash
git clone https://github.com/IndicSense-IIITDM/Website.git
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
| `/` | Homepage — hero, quote, articles, events, SPIC MACAY, gallery |
| `/vrittantam` | Medium articles (RSS) |
| `/events` | Samāgam, Saṅgam, Vīrasat |
| `/gallery` | Photo gallery with filters & lightbox |
| `/team` | Core team (Sevaks) |
| `/about` | Club info & socials , our initiatives|


## Assets

- Logos: `public/images/logos/`
- Inspiration/reference art: `public/images/inspo/`
- Event photos:`public/images/<eventname year>/`

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

## Event Registration System

Registration is controlled through JSON config files. The page reads the config and behaves accordingly.

### Config files

| Event | File |
|---|---|
| Samāgam | `src/data/events/samagam.json` |
| Saṅgam | `src/data/events/sangam.json` |
| Vīrasat | `src/data/events/virasat.json` |

### Fields (identical in all three files)

| Field | Type | Default | Description |
|---|---|---|---|
| `isRegistrationOpen` | boolean | `false` | `true` opens registration, `false` closes it |
| `registrationFormUrl` | string | `""` | Registration form URL; leave empty or as a placeholder when closed |
| `isGuidelinesUploaded` | boolean | `false` | Set to `true` when the guidelines PDF is available |
| `guidelinesPdfUrl` | string | `""` | Guidelines PDF URL; leave empty when not uploaded |

### Updating the settings (Samāgam example)

```bash
# Turn registration ON
cd indicsense-website-2
sed -i 's/"isRegistrationOpen": false/"isRegistrationOpen": true/' src/data/samagam.json
sed -i 's/"registrationFormUrl": ""/"registrationFormUrl": "https://your-form-url.com"/' src/data/samagam.json

# Upload guidelines
cat >> src/data/samagam.json << 'EOF'
  "isGuidelinesUploaded": true,
  "guidelinesPdfUrl": "https://your-guidelines-url.com.pdf"
EOF
```

### Behavior (same for every event slug: samagam, sangam, virasat)

| State | Condition | Result |
|---|---|---|
| Registration open | `isRegistrationOpen: true` + valid URL | "Register Now" opens the form in a new tab |
| Registration closed | `isRegistrationOpen: false` or missing URL | Modal: "Registration is currently closed" |
| Guidelines uploaded | `isGuidelinesUploaded: true` + valid URL | "Guidelines" opens the PDF in a new tab |
| Guidelines not ready | `isGuidelinesUploaded: false` or missing URL | Modal: "Guidelines are not yet uploaded" |

"Event Gallery" and "Guidelines" buttons continue to work as before when registration is open. No standard browser alerts are used, only the custom modal.


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
