# vgallery.space deploy notes

## Current architecture
- **Domain:** `vgallery.space`
- **Hosting:** Cloudflare Pages
- **Local source folder:** `/home/dataspace/.openclaw/workspace/cloudflare/vgallery.space`
- **Default branch:** `main`

## Main deployment flow
1. Edit files in the local source folder.
2. Commit changes:
   ```bash
   cd /home/dataspace/.openclaw/workspace/cloudflare/vgallery.space
   git add .
   git commit -m "Describe change"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```
4. Cloudflare Pages auto-deploys from the GitHub repo.
