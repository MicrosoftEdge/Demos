# Copilot Coding Agent Instructions

## Repository Overview

**MicrosoftEdge/Demos** is a collection of standalone web demo applications and sample code used to demonstrate Microsoft Edge browser features (DevTools, PWAs, cross-browser APIs, extensions). Each demo lives in its own top-level directory and is independently deployable.

Demos are hosted as GitHub Pages at `https://microsoftedge.github.io/Demos/<demo-name>/`.

## Repository Structure

```
/                         <- repo root
├── .github/              <- GitHub config (this file lives here)
├── .gitignore
├── README.md             <- index of all demos, grouped by category
├── <demo-name>/          <- each demo is self-contained in its own directory
│   ├── index.html
│   ├── README.md         <- required; includes live demo link
│   └── ...
└── ...
```

### Demos with a build step

Most demos are pure HTML/CSS/JS with no build step. A few have a `package.json` and use tools like webpack or TypeScript:

| Directory | Build tool | Build command |
|---|---|---|
| `/1DIV/` | webpack | `npm install && npx webpack` |
| `/slow-calendar/` | webpack + TypeScript | `npm install && npm run build` |
| `/devtools-crash-analyzer/` | webpack + TypeScript | `npm install && npm run build-prod` |
| `/built-in-ai/` | Eleventy (SSG) | `npm install && npm run build` |
| `/devtools-websocket-demo/` | Node.js server | `npm install && npm run server` |
| `/heap-snapshot-visualizer/` | webpack | `npm install && npm run build` (check local `package.json`) |
| `/css-mirroring-sourcemaps-demo/` | (check local `package.json`) | `npm install && npm run build` |

Always check the directory's own `package.json` for available scripts before building.

## Adding a New Demo

1. Create a new top-level directory (e.g., `/my-demo/`).
2. Create `README.md` in the new directory:
   - Add a self-explanatory title as a h1 header.
   - Immediately below the title, add a link to the live demo: `➡️ **[Open the demo](https://microsoftedge.github.io/Demos/my-demo/)** ⬅️`
   - Add a paragraph that describes what the demonstrated feature is about, and what the demo does. Provide any links to specs or docs about the demonstrated feature.
   - Include instructions to enable the feature in Edge if needed.
3. Create an `index.html` file for the demo. Prefer embedding all necessary CSS and JS code inside the file directly, but extract to `style.css` and `script.js` files as needed.
4. Add a row to the appropriate table in the root `README.md`.

## Coding Conventions

- **No global build system.** There is no root-level `package.json`, `Makefile`, or test runner. Each demo is independent.
- **No test infrastructure.** There are no automated tests anywhere in the repo. Do not add or run tests.
- **Minimal dependencies.** Demos are plain HTML/CSS/JS whenever possible. Only add npm packages if the demo genuinely needs them.
- **Self-contained directories.** Each demo directory contains everything it needs. Do not create shared utility packages across demos.
- **Node modules excluded from git.** The `.gitignore` excludes `node_modules/` globally. Never commit `node_modules/`.

## Common Errors and Workarounds

- **`node_modules` not found:** Run `npm install` inside the specific demo directory before building. There is no root-level install.
- **Port conflicts for websocket demo:** `/devtools-websocket-demo/` starts a Node.js server (`npm run server`). Make sure the port it uses is free before running.
- **Built output not in git:** Some demos (e.g., `/1DIV/dist/`, `/slow-calendar/public/`) serve built output that is committed to git. After running a build, check `git status` and commit any generated files that should be tracked (e.g., `dist/`, `public/`).

## Key Links

- Live demos index: `https://microsoftedge.github.io/Demos/`
- Microsoft Edge DevTools docs: `https://learn.microsoft.com/microsoft-edge/devtools/`
- PWA docs: `https://learn.microsoft.com/microsoft-edge/progressive-web-apps/`
- Contributing guide: see `README.md` → Contributing section
