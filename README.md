# Warhorse Roofing

A responsive, static starter for a service business that applies white roofing material with spray equipment. HTML, CSS, and plain JavaScript live in `dist/`. The files in that folder are the editable source and the deployable site.

## Run locally

Open `dist/index.html` directly, or use Python 3 from the repository root for an HTTP preview.

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Visit <http://127.0.0.1:8000>.

## Add the client's details

- Edit `dist/site-config.js` for the business phone, estimate email, service area, and project gallery. Phone and email enable the corresponding call and email buttons. Email opens the visitor’s mail app.
- Copy approved client photos into `dist/assets/` and add the file paths, descriptions, and optional captions to `projects`. The gallery and its navigation link appear with the first valid entry.
- Edit `dist/index.html` for the service description and estimate guide. Confirm the product, compatible roof surfaces, and any performance or warranty language with the client before adding those details.
- Edit `dist/styles.css` for colors, spacing, typography, and responsive layouts. The W mark and generated spray illustration are starter artwork. Replace them with approved branding and job photography when available.
