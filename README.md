# War Horse Roofing, LLC

A static commercial roofing site for Wade LeBeau’s Fremont County company. The editable pages are in `dist/`. GitHub Pages serves the same files from the root of `gh-pages` at [warhorse-roofing.com](https://warhorse-roofing.com/).

## Run locally

From the repository root run `python -m http.server 8000 --bind 127.0.0.1 --directory dist` and open [the local site](http://127.0.0.1:8000/).

## Pages

| URL | Purpose |
| --- | --- |
| `/` | Riverton before and after, other projects, and estimates |
| `/projects/` | Project index with a flat roof in Riverton, a clinic roof in Rock Springs, and a school roof in Rexburg |
| `/services/` | Metal restoration, fabric reinforcement, photo sequence, suitability, and warranty questions |
| `/about/` | Wade and the coating crew |
| `/contact/` | Direct phone and email, estimate email draft, and site-visit planning |

## Editing

- Update the shared navigation and footer in each affected HTML page. Pages, captions, project links, and direct contact details work without JavaScript.
- Keep Wade’s phone, email, and service area in `dist/site-config.js` and the corresponding HTML in sync. The estimate form prepares an addressed email in the visitor’s mail app. Photos can be attached there. The copy button also works when a default mail app is unavailable.
- For a new case study, add a page in `dist/projects/`, link it from the index, and identify projects by building type and location. Check images for visible customer, manufacturer, and neighboring business names before publishing. Optional standalone photos can still be added to the homepage through `projects` in `site-config.js`.
- The Riverton photos show the May 2025 job. The two Rexburg crew photos were taken on October 15, 2026. The clinic diagram shows the layers specified for that job.
