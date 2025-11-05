# PWA installer

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/pwa-installer/)** ⬅️

**PWA installer** is a demo app for a landing page (titled **Edge demos** ) that lets you install PWAs from a collection of applications.

This demo app showcases the Web Install API.  This demo app also demonstrates CSS Masonry layout.


<!-- ====================================================================== -->
## Requirements

* For the demo to work correctly, you must enable a flag for the Web Install API.  That flag is available in browsers based on Chromium, such as Microsoft Edge, starting with version 139.

* As a progressive enhancement, you can also enable the CSS Masonry flag.


<!-- ------------------------------ -->
### Enable the Web Install API

To enable the Web Install API (required):

1. In the browser, open a new tab and go to `about:flags`.

   In Microsoft Edge, you end up at `edge://flags`.

1. In the **Search** box, enter **web-app-installation-api**.

1. Set the **Web App Installation API** flag to **Enabled**.

1. Click the **Restart** button in the lower right.  The browser restarts.


<!-- ------------------------------ -->
### Enable CSS Masonry layout

To enable the CSS Masonry layout flag (a progressive enhancement):

1. In the browser, open a new tab and go to `about:flags`.

   In Microsoft Edge, you end up at `edge://flags`.

1. In the **Search** box, enter **css-masonry-layout**.

1. Set the **CSS Masonry Layout** flag to **Enabled**.

1. Click the **Restart** button in the lower right.  The browser restarts.


<!-- ====================================================================== -->
## See also

Sample description:
* [PWA installer](https://learn.microsoft.com/microsoft-edge/progressive-web-apps/samples/index#pwa-installer) in _Progressive Web App samples_.

Blog post:
* [Microsoft Edge: Web Install API Dev Trial Live](https://www.linkedin.com/feed/update/urn:li:activity:7348768177993998337/)

Explainer:
* [Web Install API](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md)

Other live samples:
* [Web Install Sample](https://kbhlee2121.github.io/pwa/web-install/index.html) - requires the **web-app-installation-api** flag.
