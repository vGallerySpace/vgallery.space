# vgallery.space Deploy Notes

For full architecture details, navbar specifications, and deployment steps, see **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**.

## Quick Deployment Commands

```bash
# 1. Go to repository
cd /home/dataspace/Videos/vgallery.space

# 2. Sync with GitHub
git add .
git commit -m "Describe your update"
git push origin main

# 3. Deploy live to production Cloudflare Worker (vgallery.space)
npx wrangler deploy
```
