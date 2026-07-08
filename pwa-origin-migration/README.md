# PWA Origin Migration

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/pwa-origin-migration/)** ⬅️

A Progressive Web App (PWA) demo of **PWA origin migration**: moving an installed
app to a new manifest `id` (a new path or a new same-site origin) without making
users uninstall and reinstall. The browser offers the move like a normal
[app update](https://developer.chrome.com/blog/improvements-to-web-app-updates).

This demo migrates between two paths on the **same origin**
(`.../pwa-origin-migration/old/` → `.../pwa-origin-migration/new/`), which is all
a single GitHub Pages origin can host. The same handshake also powers a same-site
**subdomain** move such as `example.com/app` → `app.example.com` — see
[Moving to a new subdomain](#moving-to-a-new-subdomain) below.

The feature is enabled by default; you can confirm it at
`edge://flags/#web-app-migration-api` (or `chrome://flags/#web-app-migration-api`).

<!-- ====================================================================== -->
## Run the demo

1. Open the [old app](https://microsoftedge.github.io/Demos/pwa-origin-migration/old/) and **install** it (address-bar install icon, or the in-page button).
2. Open the [new app](https://microsoftedge.github.io/Demos/pwa-origin-migration/new/) and **install** it too.
3. Launch the **old** app from your OS. Because its manifest declares `migrate_to`
   and the new app declares `migrate_from`, the app window shows a **“Review app
   update”** prompt offering to move to the new app. Accept it — the old app is
   replaced by the new one, keeping the installation.
4. Inspect the migration state at `edge://web-app-internals` (look for
   `pending_migration_info`) and `edge://apps`.

<!-- ====================================================================== -->
## The two-way handshake

**Old app** — `old/manifest.json` points at the new app:

```json
{
  "id": "/Demos/pwa-origin-migration/old/",
  "migrate_to": {
    "id": "/Demos/pwa-origin-migration/new/",
    "install_url": "../new/"
  }
}
```

**New app** — `new/manifest.json` accepts migrations from the old app:

```json
{
  "id": "/Demos/pwa-origin-migration/new/",
  "migrate_from": [
    { "id": "/Demos/pwa-origin-migration/old/", "behavior": "suggest" }
  ]
}
```

Notes:

- The destination (new) manifest **must** set an explicit `id`, otherwise
  `migrate_from` is ignored.
- Old and new IDs must be **same-site** (same registrable domain / eTLD+1).
- `migrate_to` is optional but lets the old app proactively trigger the move; the
  required half of the handshake is `migrate_from` on the new app (plus the
  `.well-known` file for cross-origin moves, below).

<!-- ====================================================================== -->
## suggest vs force

Set `behavior` in the new app's `migrate_from` entry:

- **`suggest`** (default) — a passive “Review app update” prompt in the app menu.
- **`force`** — a blocking dialog on the next launch of the old app: the user must
  update or uninstall.

```json
"migrate_from": [{ "id": "https://example.com/social/", "behavior": "force" }]
```

<!-- ====================================================================== -->
## Moving to a new subdomain

Migrating to a different **same-site origin** (for example
`example.com/app` → `app.example.com`) uses the same manifest fields, plus the old
origin must **authorize** the move with a `/.well-known/web-app-origin-association`
file. This can't be shown on a single GitHub Pages origin, but the files look like
this:

New app manifest at `https://app.example.com/`:

```json
{
  "id": "/",
  "migrate_from": [{ "id": "https://example.com/app/", "behavior": "suggest" }]
}
```

Association file at `https://example.com/.well-known/web-app-origin-association`:

```json
{
  "https://app.example.com/": { "allow_migration": true }
}
```

> `*.github.io` and `*.pages.dev` subdomains are **separate sites** (both are on
> the Public Suffix List), so cross-origin migration between them is blocked. Use
> two subdomains of a domain you control.

<!-- ====================================================================== -->
## See also

* [Migrate your PWA to a new origin](https://blogs.windows.com/msedgedev/2026/07/07/new-in-edge-for-developers-style-layout-gaps-improve-keyboard-accessibility-and-migrate-your-pwa-to-a-new-origin/) - Microsoft Edge blog
* [Seamless PWA origin migration](https://developer.chrome.com/blog/seamless-pwa-origin-migration) - Chrome for Developers blog
* [Progressive Web Apps (PWAs) documentation](https://learn.microsoft.com/microsoft-edge/progressive-web-apps/landing/)
