# War Horse Roofing, LLC

A static commercial roofing site for Wade LeBeau’s Fremont County company. The editable pages are in `dist/`. GitHub Pages serves the same files from the root of `gh-pages` at [warhorse-roofing.com](https://warhorse-roofing.com/).

## Run locally

From the repository root run `python -m http.server 8000 --bind 127.0.0.1 --directory dist` and open [the local site](http://127.0.0.1:8000/).

## Pages

| URL | Purpose |
| --- | --- |
| `/` | Riverton before and after, other projects, and estimates |
| `/projects/` | Project index with individual pages for Riverton, the Sweetwater Walk-In Clinic, and Paul Mitchell The School |
| `/services/` | Metal restoration, fabric reinforcement, photo sequence, suitability, and warranty questions |
| `/about/` | Wade, the crew, and a project reference |
| `/contact/` | Direct phone and email, estimate email draft, and site-visit planning |

## Editing

- Update the shared navigation and footer in each affected HTML page. Pages, captions, project links, and direct contact details work without JavaScript.
- Keep Wade’s phone, email, and service area in `dist/site-config.js` and the corresponding HTML in sync. The estimate form prepares an addressed email in the visitor’s mail app. Photos can be attached there. The copy button also works when a default mail app is unavailable.
- For a new case study, add a page in `dist/projects/`, link it from the index, and match named clients to original project photos or job records before publishing. Optional standalone photos can still be added to the homepage through `projects` in `site-config.js`.
- The Riverton photos are from the May 2025 job. The two Rexburg originals were taken at the [Paul Mitchell school](https://paulmitchell.edu/rexburg) on October 15, 2026. The clinic assembly illustration depicts the specified layers. Sources are [War Horse’s proposal](https://res.cloudinary.com/dpmykpsih/image/upload/memorial-sweetwater-site-514/media/8e936db4415245d7a2970cccf8d3f424/10-01-25_mhsc-board-packet.pdf) and its [completion invoice](https://sweetwatercountywy.granicus.com/MetaViewer.php?clip_id=280&meta_id=52655&view_id=1).
- The company supplied its crew photos. Its previous site is the source of [the UAW Local 249 reference](https://www.warhorseroofingllc.com/services), logo, and Wade’s profile image. Conklin publishes the [PUMA XL warranty qualification](https://www.conklin.com/product-catalog/roofing-products/puma-xl-top-coat).
