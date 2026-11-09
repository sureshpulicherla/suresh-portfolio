# Suresh Pulicherla — Portfolio V2

A cinematic personal portfolio that gives equal space to software, enterprise operations, and creative web experiments. Built with vanilla HTML/CSS/JavaScript and an optional WebGL motorcycle viewer — **no paid hosting, build step, or API keys** required.

## What is included

- Portfolio: immersive, frameless/blended portrait hero, real career timeline, six project showcases, project detail overlays, working filters, email and LinkedIn actions.
- **Dual theme:** Dark Cinematic (default) and Light Studio (warm editorial cream/forest green) with a header toggle. Your choice persists on the same browser, including page refreshes. Bikes and Divine retain their dark immersive stages by design.
- Interactive demos: **clearly labeled frontend simulations** for ShopNest, TuneHub (original generated audio), AI Food Analyzer (sample data), and AWS architecture (educational examples).
- APEX Garage: original low-poly procedural 3D concept motorcycle powered by Three.js, pointer rotation, zoom, paint options, three illustrative fictional models, and configurable prices/specs. Falls back to image if WebGL/Three.js is unavailable.
- Divine Atlas: immersive temple-inspired design, three selectable temple summaries and user-triggered original ambient tones. Background image is concept art, not an actual temple photograph.
- Studio edit mode: local preview edits for profile, projects and experience; **export the actual `data.js`** to deploy the changes. This fixes the old HTML-only export bug.
- Mobile styles, focus indicators, keyboard-accessible buttons/dialog, reduced-motion mode, optimized WebP assets.

## Open and deploy

1. Extract the ZIP. Keep the file structure intact.
2. Open `index.html` in Chrome/Edge or, ideally, use **VS Code → Live Server**. Use the **LIGHT MODE / DARK MODE** switch in the header; your choice is remembered in your browser. Internet is needed for optional Google Fonts and the Three.js CDN script.
3. Create a GitHub repository (e.g. `suresh-portfolio`). Upload **the contents of this extracted folder**, including `index.html`, `css`, `js`, and `assets`.
4. GitHub repository → **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root)**. Save.
5. GitHub Pages provides a free public URL for the site. No domain purchase is needed.

## Change content anytime (recommended)

Open `js/data.js` in VS Code and edit `SITE_DATA`:

- `profile`: name, intro, location, email, LinkedIn, portrait path, award.
- `projects`: project cards and optional Google Drive walkthrough URLs.
- `experience`: roles, organizations, dates, achievements.
- `bikes`, `bikeColors`, `exhausts`, `wheels`: fictional concept showroom specs.
- `temples`: selectable stories and locations.

Replace `assets/profile.webp` with another image **using the same filename**, or edit `profile.portrait` to point to a new image in `/assets`.

## Visual editor (no code to edit your text)

1. Add `?studio=1` to your site URL (for example `http://127.0.0.1:5500/index.html?studio=1`).
2. Use **OPEN STUDIO** to edit the profile, add/edit/delete projects, and add/edit/delete experience.
3. Changes are **local previews in that browser**, not changes to the live GitHub site. Export **DATA.JS** when finished.
4. Replace the existing `js/data.js` with your exported `data.js`, commit and push to GitHub.
5. Do not treat `?studio=1` as authentication. Visitors who discover it can edit *their own browser's preview*, but **cannot change your published site**. No password or server write access exists.

## Limitations and accuracy

- The original project descriptions were based on the uploaded portfolio source. Check all claims/dates yourself before applying to jobs or publishing.
- These four portfolio demos are **not** connected to a production Java/MySQL/AWS system. Original walkthrough links are provided where available.
- Motorcycle names, price and performance values are fictional and illustrative. Viewer has one custom procedural base model styled by selected preset, not downloadable proprietary bike models.
- The Divine background is artistically imagined; not a literal picture of Tirumala, Arunachaleswarar or Virupaksha Temple. Ambient audio is a synthesized tone, not a religious recording, medical intervention, or special frequency claim.
- The 3D viewer depends on Three.js r128 loaded from CDN; if this file is inaccessible or device WebGL is unavailable, users see a still image instead. For fully offline usage, vendor a compatible copy of Three.js locally and change the `<script>` source.
- No analytics, trackers, backend, payment forms, or data collection included.

## File map

```text
index.html           Page structure, sections and controls
css/styles.css       All styles and responsive rules
js/data.js           All editable content
js/app.js            Render, navigation, demos, and Studio editor
js/bike3d.js         Procedural 3D motorcycle scene
assets/*.webp        Optimized images from your original upload
assets/favicon.svg   Website icon
```

## Free upgrades later

Replace the procedural bike with a **properly licensed GLB model** for more photorealistic realism, host the asset under `assets/`, and adapt `js/bike3d.js` with GLTFLoader. This is optional — the current project works as-is.
