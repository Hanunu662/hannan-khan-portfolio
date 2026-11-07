# Hannan Khan, UX portfolio

Source for [hannankhan2025.com](https://hannankhan2025.com). Plain HTML, CSS and a small script, no build step.

## Structure

- `index.html`, `work.html`, `about.html`, `contact.html`: main pages
- `case-*.html`: nine case studies
- `styles.css`: one stylesheet for the whole site
- `site.js`: scroll reveals, hover slideshows, lightbox, magnetic buttons
- `assets/`: images (`frames/` holds the hover slideshow frames, `process/` the research galleries)
- `downloads/`: PDFs linked from case studies
- `netlify.toml`, `robots.txt`, `sitemap.xml`: hosting and SEO

## Editing

Edit the HTML directly and push. Netlify deploys the `main` branch automatically.

To add a project image: drop it in `assets/`, reference it from the page, and add it to the card's `data-frames` list on `index.html` and `work.html` if it should appear in the hover preview.
