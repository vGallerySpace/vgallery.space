# vgallery.space — Deployment & Architecture Guide

## 📌 Production Architecture Overview

* **Primary Domain**: `https://vgallery.space` & `https://www.vgallery.space`
* **Cloudflare Infrastructure**: Cloudflare Worker with Static Assets
* **Worker Name**: `vgallery-space`
* **Worker Endpoint**: `https://vgallery-space.framous.workers.dev`
* **Active Working Repository Path**: `/home/dataspace/Videos/vgallery.space`
* **GitHub Repository**: `https://github.com/vGallerySpace/vgallery.space.git` (`main` branch)

> **Important Deployment Note**: `vgallery.space` is hosted as a **Cloudflare Worker with Static Assets** (using `wrangler.toml`), *not* a Cloudflare Pages project. To deploy changes directly to the live production domain `vgallery.space`, you must run `npx wrangler deploy`.

---

## 🎨 Unified Navbar Specification (26 Site Pages)

To prevent header menu deviations, font size jumps, and shopping cart shifting across pages, all 26 site HTML files enforce a locked style block placed as the **last element inside `<head>`** (`<style id="unified-navbar-styles">`).

### Navbar Sizing & Spacing Standards:

* **Desktop Viewport (>768px)**:
  * **Font Size**: `13px !important`
  * **Kerning**: `letter-spacing: .12em !important`
  * **Font Family**: `'Avenir Next', 'Nunito', 'Quicksand', 'Segoe UI', Arial, sans-serif !important`
  * **Link Gap Spacing**: `1.5rem !important`
  * **Link Padding**: `0.5rem 0.5rem !important`
  * **Active Link Color**: `#444444 !important`
  * **Container Alignment**: `max-width: 1320px !important`, side padding `24px !important`

* **Mobile Viewport (≤768px)**:
  * **Font Size**: `11px !important`
  * **Kerning**: `letter-spacing: .12em !important`
  * **Link Gap Spacing**: `0.75rem !important`
  * **Link Padding**: `0.4rem 0.25rem !important`
  * **Container Alignment**: Side padding `16px !important`

* **Scrollbar Gutter Lock**:
  ```css
  html {
    scrollbar-gutter: stable !important;
    overflow-y: scroll !important;
  }
  ```
  *Reserves identical vertical scrollbar width across short (`STUDIO`/`OFFICE`) and long (`GALLERY`/`EXHIBITS`) pages to eliminate horizontal cart shifting.*

---

## 🛠️ Step-by-Step Workflow for Editing & Deploying Changes

### 1. Edit Local Files
Navigate to the active repository directory and make your edits:
```bash
cd /home/dataspace/Videos/vgallery.space
```

### 2. Commit and Push to GitHub
Sync your local changes with the GitHub repository:
```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

### 3. Deploy Live to Cloudflare Worker (`vgallery.space`)
Deploy static assets and Worker function directly to the production domain:
```bash
npx wrangler deploy
```

### 4. Verify Live Deployment
Run a quick health check to verify that your new changes are serving live on `vgallery.space`:
```bash
curl -sL https://vgallery.space/ | grep -c "unified-navbar-styles"
```
*(A output of `1` confirms that the unified stylesheet is actively serving on the live domain).*

---

## 📂 Managed Site Pages (26 Total)

1. `index.html` (`GALLERY`)
2. `studio.html` (`STUDIO`)
3. `office.html` (`OFFICE`)
4. `docent-lounge.html`
5. `artist-statement.html`
6. `guest-list.html`
7. `privacy-policy.html`
8. `terms-conditions.html`
9. `studio/index.html`
10. `office/index.html`
11. `docent-lounge/index.html`
12–26. All 16 exhibition pages in `exhibitions/`
