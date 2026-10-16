#!/bin/bash
set -e
cd /home/dataspace/.openclaw/workspace/cloudflare/vgallery.space

# Main HTML
for f in index.html gallery.html studio.html office.html artist-statement.html guest-list.html privacy-policy.html terms-conditions.html docent-lounge.html feed.xml sitemap.xml; do
  curl -sL "https://vgallery.space/$f" > "$f"
done

# Favicons
for f in favicon.ico favicon.svg favicon-16.png favicon-32.png favicon-48.png favicon-192.png favicon-512.png apple-touch-icon.png; do
  curl -sL "https://vgallery.space/$f" > "$f"
done

# CSS/JS
curl -sL "https://vgallery.space/css/resa-widget.css" > css/resa-widget.css
curl -sL "https://vgallery.space/js/resa-widget.js" > js/resa-widget.js

# Exhibition pages
for f in ad-art-show-2020.html ad-art-show-2021.html archscul.html auto-mnemonic-body.html auto-nature.html biz-zine-no-1.html codes-gallery.html infinity-museum-xtz.html internet-lounge.html moma-postcard-installation.html osg.html prototype-no-5.html prototype-no-6.html vgalleryspace-ebay.html vgalleryspace-metaverse-exhibition.html; do
  curl -sL "https://vgallery.space/exhibitions/$f" > "exhibitions/$f"
done

# Exhibition assets
curl -sL "https://vgallery.space/exhibitions/assets/RESA1.jpeg" > "exhibitions/assets/RESA1.jpeg"

# All assets
for asset in   ARTSY_vGallerySpace.webp   GIFTSHOP-1.webp   MvVO_vGallerySpace.webp   "OpenSea-Full-Logo (dark).webp"   RESA1.jpeg   RESA2.jpeg   ad2020-larger-new.webp   ad2020-marquee-new.webp   ad2021-adart-new.webp   alleyway.webp   amb-autobodyshop.webp   amb-balance.webp   archscul-loop-i-thumb.webp   archscul-loop-i.mp4   archscul01.webp   archscul03.webp   archscul04.webp   archscul05.webp   archscul06.webp   biz-zine-03.webp   biz-zine-04.webp   biz-zine-05.webp   biz-zine-07.webp   biz-zine-08.webp   biz-zine-09.webp   biz-zine-10.webp   biz-zine-11.webp   biz-zine-12.webp   biz-zine-13.webp   biz-zine-14.webp   biz-zine-cliffcaves.webp   biz-zine-cover.webp   biz-zine-snowperson.webp   branches_1.webp   cliffhanger.webp   clouds.webp   codes-gallery-card.webp   darkwoods.webp   digitalhiker.webp   docent-knowledge.json   electricspirit.webp   footbridge.webp   framous_black.webp   infinity-collection.webp   infinity-loop.mp4   infinity-thumbnail.webp   internet-lounge-vj-loop.mp4   lighteningarch.webp   metaverse-artwork.webp   metaverse-exhibition.mp4   metaverse-stratosphere.webp   metaverse-thumbnail.webp   moma.webp   nads01_a.webp   nads02_a.webp   nads03_a.webp   nads04_a.webp   nads05_a.webp   nads06_a.webp   nads07_a.webp   nads08_a.webp   nads09_a.webp   nads10_a.webp   nads11_a.webp   nads12_a.webp   nads13_a.webp   osg-gallery.webp   osg-office.webp   osg-studio.webp   poster3a_1_2.webp   privategreens.webp   prono7a-carousel.webp   prono7b-carousel.webp   prono7c-carousel.webp   proto5-poster1a.webp   proto5-poster2a_1.webp   proto5-vj-loop-1-thumb.webp   proto5-vj-loop-1.mp4   proto5-vj-loop-2-thumb.webp   proto5-vj-loop-2.mp4   proto6-archscul-loop-iii.mp4   proto6-archsculiii-poster.webp   proto6-fronts1.webp   proto6-fronts2.webp   proto6-fronts4.webp   proto6-fronts5.webp   proto6-fronts6.webp   proto6-fronts7.webp   proto6-thumbnail.webp   proto6-xxiv.webp   quarryhouse.webp   rotatingsculpture.gif   social-card.png   soundsculpture01.webp   soundsculpture03.webp   soundsculpture05.webp   soundsculpture06.webp   spatial_logo.webp   stratosphere2022.webp   stream.webp   sundaydriver.webp   sundaydriverorange.png   sundaydriverorange.webp   treebark.webp   treefield.webp   treetops.webp   twilight.webp   twoskies_1-2.webp   "vG_Internet_Lounge_opt-1024x768.webp"   "vGallerySpaceFinal_originalmotion_working.webp"   vGallerySpaceFinalpost.webp   vGmagento.webp   vgebay-new.webp   vgebay.webp   waterfall_1.webp   wildplants.webp   yellowroad_1.webp; do
  encoded=$(printf '%s' "$asset" | sed 's/ /%20/g; s/(/%28/g; s/)/%29/g')
  curl -sL "https://vgallery.space/assets/$encoded" > "assets/$asset"
done

# Subdirectory index files
curl -sL "https://vgallery.space/docent-lounge.html" > docent-lounge/index.html
curl -sL "https://vgallery.space/office.html" > office/index.html
curl -sL "https://vgallery.space/studio.html" > studio/index.html

# Config files from github
for f in .gitignore .assetsignore DEPLOYMENT_GUIDE.md DEPLOY-NOTES.md DOCENT_THOUGHTS.md wrangler.toml serve.py add-post-to-feed.py; do
  curl -sL "https://raw.githubusercontent.com/vgallery-space/vgallery-space/main/$f" > "$f"
done

echo "Done"
