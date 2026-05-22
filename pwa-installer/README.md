# PWA installer


<!-- ====================================================================== -->
## About the sample

This demo app showcases the Web Install API.  This demo app also demonstrates CSS Masonry layout.

**PWA installer** is a demo app for a landing page (titled **Edge demos** ) that lets you install PWAs from a collection of applications.

This PWA uses the Web Install API to install other PWAs.  Also uses CSS Masonry, as a progressive enhancement.

PWA installer uses the following features:

| Feature | Description | Documentation |
|---|---|---|
| Web Install API | PWA installer uses the `navigator.install()` API to install other PWAs on the device. | [Web Install API](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md) |
| CSS Masonry | Instead of a strict grid that has gaps below shorter items, the items in the following row are raised up to fill the gaps. | [Masonry layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Masonry_layout) |


<!-- ====================================================================== -->
## Open the sample

To open and run the sample:

1. Go to [Open the demo](https://microsoftedge.github.io/Demos/pwa-installer/).

   **Enable the Web Install API:**

1. Open a new tab, and then go to `about:flags`.

   You end up at `edge://flags`.

1. In the **Search** box, enter **web-app-installation-api**.

   This flag is available in browsers based on Chromium, such as Microsoft Edge, starting with version 139.

1. Set the **Web App Installation API** flag to **Enabled**.

1. Click the **Restart** button in the lower right.

   The browser restarts.

   **Enable CSS Masonry layout** (optional; a progressive enhancement):

1. In the browser, open a new tab and go to `about:flags`.

   You end up at `edge://flags`.

1. In the **Search** box, enter **css-masonry-layout**.

1. Set the **CSS Masonry Layout** flag to **Enabled**.

1. Click the **Restart** button in the lower right.

   The browser restarts.


<!-- ====================================================================== -->
## See also

* [Microsoft Edge: Web Install API Dev Trial Live](https://www.linkedin.com/feed/update/urn:li:activity:7348768177993998337/) - blog post.
* [Web Install API](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md) - explainer.
* [Web Install Sample](https://kbhlee2121.github.io/pwa/web-install/index.html) - requires the **web-app-installation-api** flag.
