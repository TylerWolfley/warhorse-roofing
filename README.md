# Warhorse Roofing

A static commercial roofing website for Warhorse Roofing in Fremont County, Wyoming. Edit the pages in `dist/`. GitHub Pages serves the same files from the root of `gh-pages` at [warhorse-roofing.com](https://warhorse-roofing.com/).

Run `python -m http.server 8000 --bind 127.0.0.1 --directory dist` from the repository root for a local preview.

## Pages

| Route | Content |
| --- | --- |
| `/` | Warhorse Roofing, restoration systems, and Riverton before-and-after photos |
| `/services/` | Roof systems, an interactive photo sequence, roof inspections, and warranty questions |
| `/projects/` | Full-size job photos and four anonymized project stories |
| `/service-area/` | Statewide coverage, Wyoming roofing projects, and roof visits |
| `/about/` | Company history and crew photography |
| `/contact/` | On-domain quote details, email draft, and phone |

## Editing and contact

- Update the shared navigation and footer in every affected HTML page. Their links work without JavaScript. Keep all phone and email fallbacks in sync with `dist/site-config.js`.
- **Open item — direct quote delivery.** The form currently prepares an addressed email draft. Visitors can also copy the request or call. Direct submission is intentionally pending. Before enabling it, connect a company-owned endpoint, confirm the chosen recipient, and verify end-to-end receipt with Warhorse. The reserved setting is `assessmentEndpoint` in `dist/site-config.js`.
- Identify projects by building type and location. Check photos for readable customer and supplier names. The Jackson set shows the exposed deck on June 16, 2025 and finished roof on June 27. Riverton photos are from May 2025. The school crew photos were taken in October 2026. The clinic illustration represents the layers in that job’s specification.
- Additional captioned project photos can be added to the homepage through `projects` in `dist/site-config.js`. Each entry has an image path, alt text, and optional caption.
