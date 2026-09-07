#!/usr/bin/env python3
"""
vGallerySpace RSS Feed Manager
Adds a new exhibition or post to feed.xml in valid RSS 2.0 format.

Usage:
  python3 scripts/add-post-to-feed.py --title "Exhibition Title" --slug "my-exhibition.html" --desc "Artist statement or description"
"""

import sys, os, re, argparse
from datetime import datetime, timezone

def main():
    parser = argparse.ArgumentParser(description="Add a post to vGallerySpace RSS feed")
    parser.add_argument("--title", required=True, help="Title of the exhibition/post")
    parser.add_argument("--slug", required=True, help="HTML filename inside exhibitions/ (e.g. new-exhibition.html)")
    parser.add_argument("--desc", required=True, help="Description or artist statement")
    parser.add_argument("--date", default=None, help="RFC 822 date string or omit for current time")
    args = parser.parse_args()

    feed_path = os.path.join(os.path.dirname(__file__), "..", "feed.xml")
    if not os.path.exists(feed_path):
        print(f"Error: {feed_path} not found.")
        sys.exit(1)

    with open(feed_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Determine date
    if args.date:
        pub_date = args.date
    else:
        # e.g. Mon, 07 Sep 2026 12:00:00 -0500
        now = datetime.now(timezone.utc).astimezone()
        pub_date = now.strftime("%a, %d %b %Y %H:%M:%S %z")

    url = f"https://vgallery.space/exhibitions/{args.slug.lstrip('/')}"
    safe_title = args.title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    new_item = f"""    <item>
      <title>{safe_title}</title>
      <link>{url}</link>
      <guid isPermaLink="true">{url}</guid>
      <pubDate>{pub_date}</pubDate>
      <dc:creator>FRAMOUS</dc:creator>
      <description><![CDATA[{args.desc.strip()}]]></description>
    </item>"""

    # Update lastBuildDate
    build_date = datetime.now(timezone.utc).astimezone().strftime("%a, %d %b %Y %H:%M:%S %z")
    content = re.sub(r"<lastBuildDate>.*?</lastBuildDate>", f"<lastBuildDate>{build_date}</lastBuildDate>", content)

    # Insert above first <item>
    first_item_pos = content.find("    <item>")
    if first_item_pos == -1:
        print("Error: Could not find existing <item> in feed.xml")
        sys.exit(1)

    updated_content = content[:first_item_pos] + new_item + "\n\n" + content[first_item_pos:]

    with open(feed_path, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"Successfully added '{args.title}' to {feed_path}!")

if __name__ == "__main__":
    main()
