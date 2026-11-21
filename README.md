# War Horse Roofing, LLC

A four-page static website for Wade LeBeau’s commercial roof coating business in Fort Washakie, Wyoming. The editable and deployable files are in `dist/`. No build or package installation is required.

## Run locally

From the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open <http://127.0.0.1:8000>. For a file preview, open `dist/index.html` in a browser with JavaScript enabled.

## Pages

| URL | Source | Purpose |
| --- | --- | --- |
| `/` | `dist/index.html` | Commercial coatings in Wyoming and ways to reach Wade |
| `/services/` | `dist/services/index.html` | Spray application, roof suitability, and scheduling questions |
| `/about/` | `dist/about/index.html` | Wade’s background, Fort Washakie, and statewide coverage |
| `/contact/` | `dist/contact/index.html` | Free estimates by phone or email directly to Wade |

## Content and maintenance

- Wade is the owner and main contact. Joey Waller and his crew appear briefly as regional partners on About.
- The contact page contains working phone and email links in plain HTML. When those details change, update both `dist/contact/index.html` and `dist/site-config.js`. For changes to the service area, update the static page footers and the configuration. Each page contains the main navigation so visitors can use the site without JavaScript.
- Optional project gallery entries in `dist/site-config.js` take an `image` path relative to the homepage, descriptive `alt` text, and an optional `caption`. The gallery appears when at least one valid entry exists.
- The homepage uses the supplied branded-crew photo. The Services page keeps three photos of a single roof in one manual or play-on-demand sequence. All three are readable without JavaScript. About carries two separate crew photos, including a wide crop of the original that removes the photographer’s shadow. Additional batches can be added as their own jobs when their details are known.
- The official logo and Wade’s profile photo come from the company’s previous website. The company’s [home](https://www.warhorseroofingllc.com/), [services](https://www.warhorseroofingllc.com/services), and [about](https://www.warhorseroofingllc.com/about) pages are the source for its business details.
- The hosting project is recorded in `.openai/hosting.json` and serves `dist/`. Use the same source commit for GitHub and the hosted version when publishing.
