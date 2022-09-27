# 1DIV - A Window Controls Overlay demo

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/1DIV/dist/)** ⬅️

**1DIV** is a demo web app where you can create CSS designs using just one HTML `div` element. Your designs are saved only locally in the browser's memory. You can create as many as you want. This demo app can be installed locally as a PWA.

## Requirements

The main goal of this demo is to showcase the [Window Controls Overlay PWA feature](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/window-controls-overlay), so to make the most use of it, you will need the following things:

* Use a 93+ Chromium-based browser.
* Enable the Window Controls Overlay feature in about:flags (`Desktop PWA Window Controls Overlay`).

The demo app also uses [constructable stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) which are only supported in Chromium-based browsers, and on Firefox if you enable the `layout.css.constructable-stylesheets.enabled` flag first.

## Building locally

The app is not build automatically in CI. If you make a change to a file in `src` or update a dependency, you will need to build locally and commit the generated files.

To build the app locally:

* `npm install`,
* and then `npm run build`.
