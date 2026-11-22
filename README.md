# Warhorse Roofing

A static commercial roofing website for Warhorse Roofing in Fremont County, Wyoming. Edit the pages in `dist/`. GitHub Pages serves the same files from the root of `gh-pages` at [warhorse-roofing.com](https://warhorse-roofing.com/).

Run `python -m http.server 8000 --bind 127.0.0.1 --directory dist` from the repository root for a local preview.

## Pages

| Route | Content |
| --- | --- |
| `/` | Warhorse Roofing, restoration systems, and Riverton before-and-after photos |
| `/services/` | Roof systems, an interactive photo sequence, roof inspections, and warranty questions |
| `/projects/` | Full-size job photos and three anonymized project stories |
| `/service-area/` | Wyoming coverage and examples of work performed |
| `/about/` | Company history and crew photography |
| `/contact/` | Online quote request, email draft, and site visit preparation |

## Editing and contact

- Update the shared navigation and footer in every affected HTML page. Their links work without JavaScript. Keep all phone and email fallbacks in sync with `dist/site-config.js`.
- The primary quote link opens the existing Warhorse Roofing online form. Visitors can also call the company or open an addressed email draft with their project details. To enable in-page submission, set `assessmentEndpoint` in `dist/site-config.js` to a verified public Formspree endpoint for Warhorse Roofing. Confirm its recipient in the form owner’s account before enabling it.
- Identify projects by building type and location. Check photos for readable customer and supplier names. The Riverton photos are from May 2025. The school crew photos were taken in October 2026. The clinic illustration represents the layers in that job’s specification.
- Additional captioned project photos can be added to the homepage through `projects` in `dist/site-config.js`. Each entry has an image path, alt text, and optional caption.
