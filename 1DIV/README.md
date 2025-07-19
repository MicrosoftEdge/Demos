# 1DIV - Window Controls Overlay demo

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/1DIV/dist/)** ⬅️

**1DIV** is a demo web app that enables you to create multiple CSS designs by using a single HTML `div` element. Your CSS designs are only saved locally, in the browser's memory. This demo app can be installed locally as a Progressive Web App (PWA).


<!-- ====================================================================== -->
## Requirements

This demo showcases the Window Controls Overlay (WCO) PWA feature.  For instructions, see [Demo app](https://learn.microsoft.com/microsoft-edge/progressive-web-apps/how-to/window-controls-overlay#demo-app) in _Display content in the title bar area using Window Controls Overlay_.  To make the most of this demo, view it in a browser that's based on the Chromium engine, such as Microsoft Edge.

The demo app also demonstrates using [constructable stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets).  Constructable stylesheets are supported in the following web browsers:
* Browsers that are based on the Chromium engine, such as Microsoft Edge.
* Firefox, by enabling the `layout.css.constructable-stylesheets.enabled` flag.


<!-- ====================================================================== -->
## Building locally

To run this demo app as-is, you don't need to build it.

If you make a change to a file in the `src` directory of this demo app, or update a dependency, you must build the app locally, and then commit the generated files.  This demo app is not built automatically using Continuous Integration (CI).

To build this demo app locally, at a command prompt such as Windows Terminal, run the following commands in the present directory:

```shell
npm install
npm run build
```
