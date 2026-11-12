# Rixon Sunny — AI Video Creator Portfolio

Official portfolio website for **Rixon Sunny**, AI Video Creator based in Wayanad, Kerala, working worldwide.

The portfolio is built with clean, zero-dependency HTML5, CSS3, and JavaScript, featuring a dark aesthetic, autoplaying category tiles, responsive dual-orientation video galleries, and an accessible YouTube lightbox.

---

## 📁 Codebase Structure

```text
My-Portfolio/
├── index.html                  # Main homepage (Hero, Selected Work, About, Services, Workflow, Tools, Contact CTA)
│
├── pages/                      # Website subpages & category showcases
│   ├── cinematic.html          # Cinematic Films gallery
│   ├── fashion-jewellery.html  # Fashion & Jewellery visuals gallery
│   ├── commercial.html         # Commercial Ads gallery
│   ├── brand-films.html        # Brand Films gallery
│   ├── food-retail.html        # Retail & Shopping gallery
│   ├── app-promos.html         # App Promo Videos gallery
│   ├── contact.html            # Dedicated contact page & minimal lead form
│   └── work.html               # Redirect to index.html#projects
│
├── assets/                     # Static assets & client-side bundles
│   ├── css/                    # Stylesheets
│   │   ├── style.css           # Source stylesheet
│   │   └── style.min.css       # Minified production stylesheet
│   ├── js/                     # Client-side scripts
│   │   ├── app.js              # Source script (gallery loader, lightbox, navigation)
│   │   └── app.min.js          # Minified production script
│   ├── data/                   # Structured data
│   │   ├── works.json          # Portfolio gallery video database (50 projects)
│   │   └── panels.json         # Homepage category panels configuration
│   ├── brands/                 # Client brand logos
│   ├── fonts/                  # Self-hosted WOFF2 fonts (Antonio, Inter)
│   ├── posters/                # WebP & JPG video poster fallbacks
│   ├── videos/                 # Compressed looping preview MP4s
│   ├── favicon.svg             # Vector favicon
│   └── me*.webp                # Profile photos
│
├── scripts/                    # Development & build tooling
│   ├── server.ps1              # Local HTTP development server with video Range streaming
│   ├── build.ps1               # Native PowerShell asset minifier (zero dependencies)
│   └── build_assets.js         # Node.js asset minifier
│
├── resume.pdf                  # Professional resume / CV document
├── robots.txt                  # Search engine crawler instructions
├── vercel.json                 # Vercel deployment configuration & URL rewrites
└── .gitignore                  # Git hygiene rules
```

---

## 🚀 Getting Started

### Local Development Server

Start the included local development server (supports HTTP 206 Partial Content for video seeking):

```powershell
powershell -ExecutionPolicy Bypass -File scripts\server.ps1
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

### Building & Minifying Assets

To compile and minify updated CSS and JS files:

**Using PowerShell (native Windows, no Node.js required):**
```powershell
powershell -ExecutionPolicy Bypass -File scripts\build.ps1
```

**Using Node.js:**
```bash
node scripts/build_assets.js
```

Both build scripts read from `assets/css/style.css` and `assets/js/app.js` and generate optimized production files (`style.min.css` and `app.min.js`).

---

## 🌐 Deployment

The project is pre-configured for **Vercel** with `vercel.json`:
- **Clean URLs & Rewrites**: Root routes such as `/contact` and `/cinematic` automatically rewrite to their respective files in `pages/` without file extensions.
- **Cache Headers**: Static media, fonts, CSS, and JS files are served with immutable long-term cache headers (`max-age=31536000`), while HTML pages use `no-cache` for instant updates.

It can also be deployed seamlessly on **Netlify**, **Cloudflare Pages**, or **GitHub Pages**.
