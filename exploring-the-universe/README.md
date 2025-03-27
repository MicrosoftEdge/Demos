# Exploring the universe demo

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/exploring-the-universe/)** ⬅️

The webpage in this directory is a demo for the [Monitor Core Web Vitals metrics](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/performance/overview#monitor-core-web-vitals-metrics) section of the [Performance tool: Analyze your website's performance](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/performance/overview) article in the Microsoft Edge DevTools documentation.

That article is not live yet, but a draft is in [PR 3378](https://github.com/MicrosoftDocs/edge-developer/pull/3378); see GitHub preview of [Performance tool: Analyze your website's performance](https://github.com/MicrosoftDocs/edge-developer/blob/user/mikehoffms/perf-sync/microsoft-edge/devtools-guide-chromium/performance/overview.md#observe-core-web-vitals-live).

This webpage is designed to load and handle interactions slowly on purpose, in order to illustrate how the LCP, CLS, and INP metrics can be used in the Performance tool to identify and fix performance issues.


To produce **Needs improvement** or **Poor** metrics on the three metrics cards in the **Performance** tool:

1. Open the **Exploring the universe** demo page.

1. Right-click the demo page, and then select **Inspect**.

   DevTools opens.

1. In the **Activity Bar** at top, select the **Performance** tool.

1. Make the demo page pane wide, such as 60% of the width of the window.

   If the demo page pane is too narrow, some cards might continue showing **Good**, with a green metric number, which is not the intended result.

1. Optional, but recommended: Select **Next steps** pane > **Environment settings** card > **CPU throttling** dropdown > **4x slowdown - recommended**.

1. Optional, but recommended: Select **Next steps** pane > **Environment settings** card > **Network throttling** dropdown > **Slow 4G**.

1. Right-click (or long-click) the **Refresh** button to the left of the Address bar, and then select **Empty cache and hard refresh**.

   This ensures that the image is loaded again from the server, not from the local cache.

   The **LCP** card shows that the image took a long time to load.  The card shows an orange metric number and **Needs improvement**, or a red metric number and **Poor**, instead of a green metric number and **Good**.

   The engine identifies this image of stars as the largest item to be rendered.

1. If the cards remain green and say **Good**, make the demo page pane wider.

   The **CLS** card shows an orange metric number and **Needs improvement**, or a red metric number and **Poor**, instead of a green metric number and **Good**.  This illustrates that sudden, unexpected jumps in the layout can negatively impact users.  This is also due to the image taking some time to load.

   By design, the demo webpage neglects to specify a height for the image, and so the page initially loads without reserving much space for the image.  When the image starts appearing, the content below it suddenly jumps down.

1. In the rendered demo page, click an accordion item in the right column, such as **Heliocentric Theory (1543)**.

   The **CLS** card shows an orange metric number and **Needs improvement**, or a red metric number and **Poor**, instead of a green metric number and **Good**.  **INP** values are displayed.

1. Click the INP values.

   In the demo page, these values are designed to load slowly, so it takes a long time between clicking the value and rendering the corresponding content.  It's a random value between 100ms and 1000ms, leading to a high INP metric.
