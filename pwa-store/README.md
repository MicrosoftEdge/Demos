# Contoso App: a web app catalog with Web Install

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/pwa-store/)** ⬅️

Contoso App is a small, curated catalog of web apps. It demonstrates both ways a site can offer to install another site's web app:

* The [`<install>` element](https://github.com/WICG/install-element/blob/main/explainer-manifest-url.md): a browser-rendered button, used in the header to install Contoso App itself.
* The [`navigator.install()` API](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md): custom buttons that install the catalog apps, on each card and detail page.

Contoso App itself is installable too (`<install>` with a `beforeinstallprompt` fallback). The "Contoso App" name and tagline are placeholders. This is a demo, not an official store, and listed apps aren't endorsed or vetted by Microsoft.

## Run locally

There's no build step. Serve this directory over HTTP:

```
npx http-server -p 8080
```

Then open `http://localhost:8080/`.

To test installation, use Microsoft Edge 153 or later with the **Web App Install Element** (`about://flags/#web-app-install-element`) and **Web App Installation API** (`about://flags/#web-app-installation-api`) flags enabled.

## How it works

| File | Role |
| --- | --- |
| `index.html`, `styles.css` | Static shell, layout, styles |
| `apps.js` | Catalog data, with explicit `legalStatus` and `installStatus` per app |
| `install.js` | Support detection, `navigator.install()` flow, self-install |
| `app.js` | Hash routing (`#/`, `#/app/<id>`, `#/how-it-works`, `#/about`), search, categories. Builds DOM with `createElement` and `textContent` only. |
| `manifest.webmanifest`, `assets/` | Manifest and original generated icons for Contoso App itself |

Current API shapes (manifest-first; the deprecated `installurl` and `navigator.install(url)` forms are not used):

```html
<!-- Contoso App installing itself (header) -->
<install></install>
```

```js
// Installing a catalog app (cards and detail pages), from a click handler
await navigator.install({ manifest, manifestId });
```

`<install>` is used only for the header button that installs Contoso App itself, with a `beforeinstallprompt` fallback when it's unsupported. Every catalog app installs through `navigator.install()`, from a button on its card or detail page.

`navigator.install()` errors handled: `AbortError`, `DataError`, `InvalidStateError`, `NotAllowedError`, `NotFoundError`, `SecurityError`, `TypeError`. Cross-origin calls trigger a `web-app-installation` permission prompt before the install confirmation. Target manifests must be served over HTTPS without redirects, with a JSON `Content-Type`, and with a `start_url` on the manifest's origin (CORS headers aren't required).

Fallbacks: without `navigator.install()`, cards and detail pages have no Install button, and detail pages offer **Visit website**. Apps without a usable computed ID show only **Visit website**.

## Catalog verification status

Checked 2026-11-16 by fetching each manifest (not by installing in a browser).

| App | Install status | Notes |
| --- | --- | --- |
| PWAmp, Timer, 1DIV, Temperature Converter | `verified` | Microsoft-owned; same targets and IDs as the existing install demos |
| The PWinter | `verified` | Same target as the existing install demos |
| Excalidraw | `manifest-checked` | Manifest defines `id`, is served as `application/manifest+json`; not yet tested in an Edge install |
| Mastodon | `manifest-checked` | Manifest defines `id` (`/home`); not yet tested in an Edge install |
| Telegram Web | `blocked-mime-type` | Manifest defines `id` (`/a/`) but is served as `application/octet-stream`, so install is expected to fail; visit-only |
| Photopea, Squoosh, tldraw, JS Paint, Element | `manifest-checked` | No `id` in the manifest, so `manifestId` is the computed ID (the resolved `start_url`); confirm in DevTools and in an Edge install |
| Desmos | `no-manifest-id` | Manifest has neither `id` nor `start_url`, so the computed ID depends on the linking page; visit-only until read from DevTools |

Computed IDs must come from DevTools (**Application** > **Manifest** > **Identity**), never guessed.

## Content provenance and open items

* Third-party names and links are shown on the assumption CELA approves; `legalStatus` is `pending` for every third-party entry and nothing ships as approved until guidance is documented.
* App icons are loaded from each app's own origin, using the icon URLs in its manifest (see `ICONS` in `apps.js`). Nothing is copied into this repo. The plan's gate asks for locally stored, cleared assets, so revisit this once CELA responds. If an icon fails to load, generated artwork is shown instead; the Contoso App icons were generated for this demo.
* No third-party screenshots are used.
* Not yet done: end-to-end install tests in a target Edge build, GitHub Pages subpath check, screenshots, and legal/product review of copy.
