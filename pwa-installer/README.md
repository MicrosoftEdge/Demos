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
| CSS Masonry | Instead of a strict grid that has gaps below shorter items, the items fill the columns in the layout to avoid gaps. | [Masonry layout](https://developer.mozilla.org/docs/Web/CSS/CSS_grid_layout/Masonry_layout) |


<!-- ====================================================================== -->
## Open the sample

To open and run the sample:

1. Go to the [PWA installer](https://microsoftedge.github.io/Demos/pwa-installer/) demo in a new window or tab.

1. Open a new tab, and then go to `edge://flags`.

1. In the **Search** box, enter **web-app-installation-api**.

   This flag is available in browsers based on Chromium, such as Microsoft Edge, starting with version 139.

1. Set the **Web App Installation API** flag to **Enabled**.

1. In the **Search** box, enter **css-masonry-layout**<!-- todo: no such flag.  "CSS Grid Lanes Layout" flag exists -->.

1. Set the **CSS Masonry Layout** flag to **Enabled**.

1. Click the **Restart** button in the lower right.

   The browser restarts.


<!-- ====================================================================== -->
## See also

* [Microsoft Edge: Web Install API Dev Trial Live](https://www.linkedin.com/feed/update/urn:li:activity:7348768177993998337/) - blog post.
* [Web Install API](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md) - explainer.
* [Web Install Sample](https://kbhlee2121.github.io/pwa/web-install/index.html) - requires the **web-app-installation-api** flag.
