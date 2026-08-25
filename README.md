<<<<<<< HEAD
=======
# indicsense-website-2

>>>>>>> 4c841488f1ca02a53f2a23c9069038e1a5a2299c


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
| `/initiatives/indicsense` | IndicSense initiative details |
| `/initiatives/ebsb` | Ek Bharat Shreshtha Bharat initiative details |
| `/initiatives/spic-macay` | SPIC MACAY IIITDM initiative details |

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
| `initiatives.json` | Three initiative cards (IndicSense, EBSB, SPIC MACAY) |

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

## Event Registration System

### Samāgam Event Registration

A new JSON configuration file was added at `src/data/samagam.json` to manage the state of the Samāgam event registration system. This system allows club members to easily control registration status without editing Astro components.

#### Fields

- `isRegistrationOpen` (boolean): Set to `true` to open registration, `false` to close it. Defaults to `false`.
- `registrationFormUrl` (string): The URL of the registration form. Leave empty or as placeholder when registration is closed.
- `isGuidelinesUploaded` (boolean): Set to `true` when guidelines PDF is available. Defaults to `false`.
- `guidelinesPdfUrl` (string): The URL of the guidelines PDF. Leave empty when guidelines are not uploaded.

#### How to Control Registration Status

Future club members can simply update these settings in `src/data/samagam.json`:

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

**No Astro component edits required!** The system automatically reads the JSON configuration and behaves accordingly:

- **When registration is open** (`isRegistrationOpen: true` + valid URL):
  - "Register Now" button opens the registration form in a new tab
  - "Event Gallery" and "Guidelines" buttons continue to work as before

- **When registration is closed** (`isRegistrationOpen: false` or missing URL):
  - "Register Now" button shows a beautiful modal with the message "Registration is currently closed"
  - Clean theme-matched custom pop-up uses maroon (#6b1d1d) and cream (#fdfbf7) colors
  - No standard alerts are shown — only the custom modal

- **When guidelines are uploaded** (`isGuidelinesUploaded: true` + valid URL):
  - "Guidelines" button directly opens the PDF in a new tab

- **When guidelines are not ready** (`isGuidelinesUploaded: false` or missing URL):
  - "Guidelines" button shows a modal with the message "Guidelines are not yet uploaded"

#### Button Behavior

Both primary buttons now use custom HTML attributes:

```html
<button id="register-btn" class="btn-primary" data-open={samagam.isRegistrationOpen} data-url={samagam.registrationFormUrl}>Register Now</button>
<button id="guidelines-btn" class="btn-primary" data-uploaded={samagam.isGuidelinesUploaded} data-url={samagam.guidelinesPdfUrl}>Guidelines</button>
```

The JavaScript reads these attributes and decides between:

1. **Opening URLs in new tabs** (when metrics are valid)
2. **Displaying themed modals** (when metrics are false or missing)

#### Modal Features

The custom modal (`#custom-modal`) provides:

- **Clean, theme-matched design** with maroon (#6b1d1d) and cream (#fdfbf7) colors
- **Responsive layout** that works on all devices
- **Smooth animations** and transitions
- **Keyboard navigation** (Escape key to close)
- **Click-outside-to-close** functionality
- **No browser alerts** — all user feedback is through the custom modal

## Saṅgam and Vīrasat Event Registration System

We've extended the dynamic registration system to both Saṅgam (`src/data/events/sangam.json`) and Vīrasat (`src/data/events/virasat.json`) events. The identical button logic now works for all three event types:

**Updated Configuration Fields**:

- `src/data/events/sangam.json`
  - `isRegistrationOpen: false` (set to `true` to open)
  - `registrationFormUrl: ""` (URL when open, empty when closed)
  - `isGuidelinesUploaded: false` (set to `true` when PDF available)
  - `guidelinesPdfUrl: ""` (PDF URL when available)

- `src/data/events/virasat.json`
  - `isRegistrationOpen: false` (set to `true` to open)
  - `registrationFormUrl: ""` (URL when open, empty when closed)
  - `isGuidelinesUploaded: false` (set to `true` when PDF available)
  - `guidelinesPdfUrl: ""` (PDF URL when available)

**Dynamic Behavior**:

The buttons in `/events/[slug].astro` read these dynamic props:

```astro
<button id="register-btn" class="btn-primary" data-open={event.isRegistrationOpen} data-url={event.registrationFormUrl}>Register Now</button>
<button id="guidelines-btn" class="btn-primary" data-uploaded={event.isGuidelinesUploaded} data-url={event.guidelinesPdfUrl}>Guidelines</button>
```

**For each event slug** (samagam, sangam, virasat), the system:

1. **When open/active** → Opens URLs directly in new tab
2. **When closed/missing** → Shows clean themed modal with relevant status message

The same JavaScript modal handlers (`BaseLayout.astro:65-130`) work automatically across all event pages, reading the data attributes and providing consistent user experience regardless of which event is currently being viewed.
