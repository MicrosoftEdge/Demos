# Microsoft Edge Demos

This repository contains demo webpages, apps, and sample code to demonstrate various features of Microsoft Edge.  This Readme lists all top-level source code directories.  Below, demos are grouped by major technology area, and then sorted by directory name within each section's table.

Contents:
* [Microsoft Edge DevTools](#microsoft-edge-devtools)
* [Microsoft Edge extensions](#microsoft-edge-extensions)
* [Progressive Web Apps (PWAs)](#progressive-web-apps-pwas)
* [Cross-browser API samples](#cross-browser-api-samples)
* [Adding a new demo](#adding-a-new-demo)
* [Contributing](#contributing)
* [Trademarks](#trademarks)


<!-- ====================================================================== -->
## Microsoft Edge DevTools
<!-- 
sync:
https://github.com/MicrosoftEdge/Demos#readme
https://learn.microsoft.com/microsoft-edge/devtools/sample-code/sample-code#list-of-devtools-samples
last sync'd April 16, 2024
-->

<!-- table columns:
"Demo name": omit "demo"
"Description and docs": omit "PWA" unless ambig, omit "demo"
"Source code directory": sort on this col, to match dir order at https://github.com/MicrosoftEdge/Demos/
"Live demo page": adds "demo" if not present, for when headers are out of view
-->
| Demo name | Description and docs | Source code & Readme | Live demo page |
|---|---|---|---|
| CSS mirroring sourcemaps | Used for [Update .css files from within the Styles tab (CSS mirror editing)](https://learn.microsoft.com/microsoft-edge/visual-studio-code/microsoft-edge-devtools-extension/css-mirror-editing-styles-tab) for the DevTools extension for Visual Studio Code. | [/css-mirroring-sourcemaps-demo/](https://github.com/MicrosoftEdge/Demos/tree/main/css-mirroring-sourcemaps-demo) | n/a |
| To Do app | Simple To Do app with vanilla JavaScript.  Used for various articles in the [Microsoft Edge DevTools documentation](https://learn.microsoft.com/microsoft-edge/devtools/landing). | [/demo-to-do/](https://github.com/MicrosoftEdge/Demos/tree/main/demo-to-do) | [My tasks](https://microsoftedge.github.io/Demos/demo-to-do/) demo |
| Detached DOM elements | Chat-like demo.  Used for [Debug DOM memory leaks ("Detached elements" profiling type)](https://learn.microsoft.com/microsoft-edge/devtools/memory-problems/dom-leaks-memory-tool-detached-elements). | [/detached-elements/](https://github.com/MicrosoftEdge/Demos/tree/main/detached-elements) | [Detached DOM elements](https://microsoftedge.github.io/Demos/detached-elements/) demo |
| 3D View tool | Used for [Navigate webpage layers, z-index, and DOM using the 3D View tool](https://learn.microsoft.com/microsoft-edge/devtools/3d-view/). | [/devtools-3d/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-3d) | [3D View tool demo](https://microsoftedge.github.io/Demos/devtools-3d/) |
| Accessibility testing | Used for [Overview of accessibility testing using DevTools](https://learn.microsoft.com/microsoft-edge/devtools/accessibility/accessibility-testing-in-devtools). | [/devtools-a11y-testing/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-a11y-testing) | [Animal Shelter](https://microsoftedge.github.io/Demos/devtools-a11y-testing/) demo |
| Warning when animating a CSS property that requires layout | Illustrates the **Issues** and **Elements** tools warning when CSS properties that require layout are animated. | [/devtools-animated-property-issue/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-animated-property-issue) | [Animated CSS property demo](https://microsoftedge.github.io/Demos/devtools-animated-property-issue/) |
| Console panel demo pages | Used for [Console overview](https://learn.microsoft.com/microsoft-edge/devtools/console/), [Log messages in the Console tool](https://learn.microsoft.com/microsoft-edge/devtools/console/console-log), and [Fix JavaScript errors that are reported in the Console](https://learn.microsoft.com/microsoft-edge/devtools/console/console-debug-javascript). | [/devtools-console/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-console) | [DevTools Console panel demo pages](https://microsoftedge.github.io/Demos/devtools-console/) |
| Interact with the DOM using the Console | Used for [Interact with the DOM using the Console](https://learn.microsoft.com/microsoft-edge/devtools/console/console-dom-interaction). | [/devtools-console-dom-interactions/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-console-dom-interactions) | [Interact with the DOM using the Console](https://microsoftedge.github.io/Demos/devtools-console-dom-interactions/) demo |
| Contrast bug fix | Used for [Improving contrast in Microsoft Edge DevTools: A bugfix case study](https://blogs.windows.com/msedgedev/2021/06/15/improving-contrast-in-microsoft-edge-devtools-a-bugfix-case-study/). | [/devtools-contrast-bugfix/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-contrast-bugfix) | [Testing all badges in DevTools for contrast issues](https://microsoftedge.github.io/Demos/devtools-contrast-bugfix/) demo |
| Crash Analyzer tool demo | Used for [Enter a stack trace in the Crash analyzer tool](https://learn.microsoft.com/microsoft-edge/devtools/crash-analyzer/) in _Crash analyzer tool_. | [/devtools-crash-analyzer/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-crash-analyzer) | [DevTools Crash Analyzer](https://microsoftedge.github.io/Demos/devtools-crash-analyzer/) (Readme) |
| CSS Examples | Used for [Get started viewing and changing CSS](https://learn.microsoft.com/microsoft-edge/devtools/css/). | [/devtools-css-get-started/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-css-get-started) | [CSS Examples](https://microsoftedge.github.io/Demos/devtools-css-get-started/) demo |
| DOM Examples | Used for [Get started viewing and changing the DOM](https://learn.microsoft.com/microsoft-edge/devtools/dom/). | [/devtools-dom-get-started/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-dom-get-started) | [DOM Examples](https://microsoftedge.github.io/Demos/devtools-dom-get-started/) demo |
| Explain Console errors and warnings in Copilot in Edge | Generates errors in the Console that can then be explained by using Copilot in Edge. | [/devtools-explain-error/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-explain-error) | [Explain Console errors and warnings in Copilot in Edge](https://microsoftedge.github.io/Demos/devtools-explain-error/) demo |
| Inspect tool | Used for [Analyze pages using the Inspect tool](https://learn.microsoft.com/microsoft-edge/devtools/css/inspect). | [/devtools-inspect/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-inspect) | [Inspect tool demo](https://microsoftedge.github.io/Demos/devtools-inspect/) |
| Inspect CSS Grid | Used for [Inspect CSS Grid](https://learn.microsoft.com/microsoft-edge/devtools/css/grid). | [/devtools-grid/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-grid) | [Inspect CSS Grid](https://microsoftedge.github.io/Demos/devtools-grid/) demo |
| Debugging JavaScript that adds two numbers | Used for [Get started debugging JavaScript](https://learn.microsoft.com/microsoft-edge/devtools/javascript/). | [/devtools-js-get-started/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-js-get-started) | [Demo: Debugging JavaScript with Microsoft Edge DevTools](https://microsoftedge.github.io/Demos/devtools-js-get-started/) demo |
| Memory heap snapshot | Used for [Record heap snapshots using the Memory tool ("Heap snapshot" profiling type)](https://learn.microsoft.com/microsoft-edge/devtools/memory-problems/heap-snapshots). | [/devtools-memory-heap-snapshot/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-memory-heap-snapshot) | n/a |
| **Performance** tool Activity Tabs | Used for [View activities in a table](https://learn.microsoft.com/microsoft-edge/devtools/performance/reference#view-activities-in-a-table), about the **Performance** tool's **Bottom-Up**, **Call Tree**, and **Event Log** tabs. | [/devtools-performance-activitytabs/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-performance-activitytabs) | [Activity Tabs demo](https://microsoftedge.github.io/Demos/devtools-performance-activitytabs/) |
| Sluggish Animation | Used for [Introduction to the Performance tool](https://learn.microsoft.com/microsoft-edge/devtools/performance/). | [/devtools-performance-get-started/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-performance-get-started) | [Sluggish Animation](https://microsoftedge.github.io/Demos/devtools-performance-get-started/) demo |
| postMessage Trace Events | Tests `postMessage` trace events in the **Performance** tool.  Used for [View messages between windows, iframes, and dedicated workers](https://learn.microsoft.com/microsoft-edge/devtools/performance/reference#view-messages-between-windows-iframes-and-dedicated-workers) in _Performance features reference_. | [/devtools-postmessage-perf-timeline/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-postmessage-perf-timeline) | [postMessage Trace Events demo](https://microsoftedge.github.io/Demos/devtools-postmessage-perf-timeline/) |
| CSS :target pseudo-class | Used for [Support forcing the :target CSS state](https://learn.microsoft.com/microsoft-edge/devtools/whats-new/2021/01/devtools#support-forcing-the-target-css-state). | [/devtools-target-pseudo/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-target-pseudo) | [CSS :target pseudo-class demo](https://microsoftedge.github.io/Demos/devtools-target-pseudo/) |
| Exploring the universe | Webpage used to demo the [Monitor Core Web Vitals metrics](https://learn.microsoft.com/microsoft-edge/devtools/performance/overview#monitor-core-web-vitals-metrics) section in the _Performance tool: Analyze your website's performance_ article. | [/exploring-the-universe/](https://github.com/MicrosoftEdge/Demos/tree/main/exploring-the-universe) | [Exploring the universe](https://microsoftedge.github.io/Demos/exploring-the-universe/) demo |
| Heap Snapshot Visualizer | Source code for the [Heap Snapshot Visualizer](https://microsoftedge.microsoft.com/addons/detail/heap-snapshot-visualizer/fceldlhognbemkgfacnffkdanocidgce) extension for DevTools. | [/heap-snapshot-visualizer/](https://github.com/MicrosoftEdge/Demos/tree/main/heap-snapshot-visualizer) | n/a |
| JSON dummy data | Simple JSON files.  Used for [View a JSON file or server response with formatting](https://learn.microsoft.com/microsoft-edge/web-platform/json-viewer). | [/json-dummy-data/](https://github.com/MicrosoftEdge/Demos/tree/main/json-dummy-data) | [JSON dummy data](https://microsoftedge.github.io/Demos/json-dummy-data/) (Readme) |
| Inspect Network Activity | Used for [Inspect network activity](https://learn.microsoft.com/microsoft-edge/devtools/network/). | [/network-tutorial/](https://github.com/MicrosoftEdge/Demos/tree/main/network-tutorial) | [Inspect Network Activity demo](https://microsoftedge.github.io/Demos/network-tutorial/) |
| Network tool reference | Used for [Network features reference](https://learn.microsoft.com/microsoft-edge/devtools/network/reference). | [/devtools-network-reference/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-network-reference) | [Network tool reference demo](https://microsoftedge.github.io/Demos/devtools-network-reference/) |
| Photo gallery | Used for [The truth about CSS selector performance](https://blogs.windows.com/msedgedev/2023/01/17/the-truth-about-css-selector-performance/). | [/photo-gallery/](https://github.com/MicrosoftEdge/Demos/tree/main/photo-gallery) | [Photo Gallery](https://microsoftedge.github.io/Demos/photo-gallery/) demo |
| Slow Calendar | Simple calendar demo app to test DevTools features such as the **Performance** tool and source map support. | [/slow-calendar/](https://github.com/MicrosoftEdge/Demos/tree/main/slow-calendar) | [Slow Calendar](https://microsoftedge.github.io/Demos/slow-calendar/public/) demo |
| Margie's Travel | Demonstrates how to optimize a webpage's resources to make it load, appear, and be interactive faster.  See [Optimize website speed using Lighthouse](https://learn.microsoft.com/microsoft-edge/devtools/speed/get-started). | [/travel-site/](https://github.com/MicrosoftEdge/Demos/tree/main/travel-site) | [Margie's Travel](https://microsoftedge.github.io/Demos/travel-site/) demo |
| Workspaces | Used for [Edit files with Workspaces (Filesystem tab)](https://learn.microsoft.com/microsoft-edge/devtools/workspaces), in the **Sources** tool. | [/workspaces/](https://github.com/MicrosoftEdge/Demos/tree/main/workspaces) | [DevTools Workspaces demo](https://microsoftedge.github.io/Demos/workspaces/) |
| Idle detection | Used for [Emulate idle detector state](https://learn.microsoft.com/microsoft-edge/devtools/sensors/#emulate-idle-detector-state), in the **Sensors** tool. | [/idle-detection/](https://github.com/MicrosoftEdge/Demos/tree/main/idle-detection) | [Idle detection demo](https://microsoftedge.github.io/Demos/idle-detection/) |


<!-- ====================================================================== -->
## Microsoft Edge extensions
<!-- sync:
https://learn.microsoft.com/microsoft-edge/extensions/samples#list-of-samples
https://github.com/microsoft/MicrosoftEdge-Extensions/blob/main/README.md#code
https://github.com/MicrosoftEdge/Demos/blob/main/README.md#microsoft-edge-extensions
-->

| Demo name | Description and docs | Source code & Readme | Live demo page |
|---|---|---|---|
| DevTools extension | Used for [Create an extension that customizes the DevTools UI](https://learn.microsoft.com/microsoft-edge/extensions/developer-guide/devtools-extension). | [/devtools-extension/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension) | n/a |
| Basic | A basic DevTools extension. | [/devtools-extension/sample 1/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension/sample%201) | n/a |
| Panel | A basic DevTools extension with a panel. | [/devtools-extension/sample 2/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension/sample%202) | n/a |
| CDP | A basic DevTools extension invoking Chrome Developer Protocol (CDP) APIs. | [/devtools-extension/sample 3/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension/sample%203) | n/a |
| Inspect | A basic DevTools extension that interacts with the Inspected page. | [/devtools-extension/sample 4/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension/sample%204) | n/a |

See also:
* [List of samples](https://learn.microsoft.com/microsoft-edge/extensions/samples#list-of-samples) in _Samples for Microsoft Edge extensions_.  Includes samples that are in the **microsoft / MicrosoftEdge-Extensions** repo.


<!-- ====================================================================== -->
## Progressive Web Apps (PWAs)
<!-- sync:
https://learn.microsoft.com/microsoft-edge/progressive-web-apps/demo-pwas
https://github.com/MicrosoftEdge/Demos/blob/main/README.md#progressive-web-apps-pwas
last sync'd July 18, 2025
-->

| Demo name | Description and docs | Source code & Readme | Live demo page |
|---|---|---|---|
| 1DIV | A CSS sandbox app that demonstrates the Window Controls Overlay feature. | [/1DIV/](https://github.com/MicrosoftEdge/Demos/tree/main/1DIV) | [1DIV](https://microsoftedge.github.io/Demos/1DIV/dist/) demo |
| Email client | A simulated email client PWA that demonstrates how to use PWA protocol handlers. | [/email-client/](https://github.com/MicrosoftEdge/Demos/tree/main/email-client) | [Email inbox](https://microsoftedge.github.io/Demos/email-client/) demo |
| Application Title Meta Tag | Showcases the `application-title` meta tag. | [/pwa-application-title/](https://github.com/MicrosoftEdge/Demos/tree/main/pwa-application-title) | [application-title](https://microsoftedge.github.io/Demos/pwa-application-title/) demo |
| Temperature converter | Converts temperatures.  Used for [Get started with PWAs](https://learn.microsoft.com/microsoft-edge/progressive-web-apps/how-to/). | [/pwa-getting-started/](https://github.com/MicrosoftEdge/Demos/tree/main/pwa-getting-started) | [Temperature converter](https://microsoftedge.github.io/Demos/pwa-getting-started/) demo |
| PWA installer | A PWA that uses the Web Install API to install other PWAs.  Also uses CSS Masonry. | [/pwa-installer/](https://github.com/MicrosoftEdge/Demos/tree/main/pwa-installer) | [pwa-installer](https://microsoftedge.github.io/Demos/pwa-installer/) demo |
| Timer PWA | Has a **Set timer** button, and you can set the duration of the timer. | [/pwa-timer/](https://github.com/MicrosoftEdge/Demos/tree/main/pwa-timer) | [Timer PWA demo](https://microsoftedge.github.io/Demos/pwa-timer/) |
| PWA To Do | Create lists of tasks locally in your browser, or by installing the app.  Click **About** link in rendered demo. | [/pwa-to-do/](https://github.com/MicrosoftEdge/Demos/tree/main/pwa-to-do) | [PWA To Do](https://microsoftedge.github.io/Demos/pwa-to-do/) demo |
| `navigator.install` demos | A Readme for demos that use `navigator.install`, to allow web content to declaratively install other web apps. | [/pwa-web-install-api/](https://github.com/MicrosoftEdge/Demos/tree/main/pwa-web-install-api) | [PWA web install API demos](https://microsoftedge.github.io/Demos/pwa-web-install-api/) (Readme) |
| PWAmp | A music player that plays local audio files. | [/pwamp/](https://github.com/MicrosoftEdge/Demos/tree/main/pwamp) | [pwamp](https://microsoftedge.github.io/Demos/pwamp/) demo |
| wami | An image manipulation app to crop, resize, or add effects to images. | [/wami/](https://github.com/MicrosoftEdge/Demos/tree/main/wami) | [wami](https://microsoftedge.github.io/Demos/wami/) demo |

<!-- todo: change from [Get started with PWAs] to [Temperature convertor sample] after merge https://github.com/MicrosoftDocs/edge-developer/pull/3476 -->

See also:
* [Progressive Web App demos](https://learn.microsoft.com/microsoft-edge/progressive-web-apps/demo-pwas)
<!-- adds:
BPM Techno
Webboard
-->


<!-- ====================================================================== -->
## Cross-browser API samples

| Demo name | Description and docs | Source code & Readme | Live demo page |
|---|---|---|---|
| Built-in AI playgrounds | Demo pages showing how to use the built-in Prompt and Writing Assistance AI APIs in Microsoft Edge. | [/built-in-ai/](https://github.com/MicrosoftEdge/Demos/tree/main/built-in-ai) | [Built-in AI playgrounds](https://microsoftedge.github.io/Demos/built-in-ai/) demo |
| CSS Gap Decorations demos | Draws line decorations within gaps in CSS Grid, Flexbox, and Multi-column layouts. | [/css-gap-decorations/](https://github.com/MicrosoftEdge/Demos/tree/main/css-gap-decorations) | [CSS Gap Decorations demos](https://microsoftedge.github.io/Demos/css-gap-decorations/) (Readme) |
| CSS Masonry demos | Showcase the implementation of CSS Masonry layout. | [/css-masonry/](https://github.com/MicrosoftEdge/Demos/tree/main/css-masonry) | [CSS Masonry demos](https://microsoftedge.github.io/Demos/css-masonry/) demos (Readme) |
| CSS Custom Highlight API | How to programmatically create and remove custom highlights on a web page. | [/custom-highlight-api/](https://github.com/MicrosoftEdge/Demos/tree/main/custom-highlight-api) | [Custom Highlight API](https://microsoftedge.github.io/Demos/custom-highlight-api/) demo |
| EditContext API demo | Demo page showing how the EditContext API can be used to build an advanced text editor. | [/edit-context/](https://github.com/MicrosoftEdge/Demos/tree/main/edit-context) | [HTML editor demo](https://microsoftedge.github.io/Demos/edit-context/) |
| EyeDropper API | How to use the EyeDropper API to create a color sampling tool from JavaScript. | [/eyedropper/](https://github.com/MicrosoftEdge/Demos/tree/main/eyedropper) | [EyeDropper API demos](https://microsoftedge.github.io/Demos/eyedropper/) |
| IndexedDB: `getAllRecords()` | Shows the benefits of the newly proposed `getAllRecords()` IndexedDB method to more conveniently and quickly read IDB records. | [/idb-getallrecords/](https://github.com/MicrosoftEdge/Demos/tree/main/idb-getallrecords) | [IndexedDB: getAllRecords()](https://microsoftedge.github.io/Demos/idb-getallrecords/) demo |
| Notifications demo | Using incoming call notifications. | [/incoming-call-notifications/](https://github.com/MicrosoftEdge/Demos/tree/main/incoming-call-notifications) | [Notifications demo](https://microsoftedge.github.io/Demos/incoming-call-notifications/) demo |
| Page Colors Custom Scrollbars demo | Shows a custom, green scrollbar in a page that has custom colors. | [/page-colors-custom-scrollbars/](https://github.com/MicrosoftEdge/Demos/tree/main/page-colors-custom-scrollbars) | [Page Colors Custom Scrollbars demo](https://microsoftedge.github.io/Demos/page-colors-custom-scrollbars/) demo |
| Reader app | An article reader app used to demonstrate how to use various web APIs such as CSS Custom Highlight, `<selectlist>`, EyeDropper, CSS and JSON modules, Scroll animation timeline, and Async Clipboard. | [/reader/](https://github.com/MicrosoftEdge/Demos/tree/main/reader) | [Reader](https://microsoftedge.github.io/Demos/reader/) demo |
| Open UI's `<selectlist>` demos | Demo webpage showing how the Open UI's `<selectlist>` element can be used. | [/selectlist/](https://github.com/MicrosoftEdge/Demos/tree/main/selectlist) | [Open UI's \<selectlist\> demos](https://microsoftedge.github.io/Demos/selectlist/) |
| `<selectmenu>` demos | OpenUI's `<selectmenu>` component was renamed to `<selectlist>`. | [/selectmenu/](https://github.com/MicrosoftEdge/Demos/tree/main/selectmenu) | [<selectmenu> demos](https://microsoftedge.github.io/Demos/selectmenu/), redirects to `/selectlist/` demos |
| SVG support in the Async Clipboard API | Demo page showing how the Async Clipboard API supports SVG format. | [/svg-clipboard/](https://github.com/MicrosoftEdge/Demos/tree/main/svg-clipboard) | [SVG clipbard support demo](https://microsoftedge.github.io/Demos/svg-clipboard/) |
| WebNN API | Uses the WebNN API to build a machine learning graph and run it on the device's hardware. | [/webnn/](https://github.com/MicrosoftEdge/Demos/tree/main/webnn) | [WebNN API demo](https://microsoftedge.github.io/Demos/webnn/) |


<!-- ====================================================================== -->
## Adding a new demo

To add a new demo:

1. Make a copy of the `/template/` directory at the root of this repository and give it a name, such as `/my-demo/`.

1. Edit the `README.md` file in the new directory to clearly explain what your new demo is about.

1. In the README file, include a GitHub.io link that points to the live demo.

   This repository is set up to be deployed live using GitHub Pages (GitHub.io), so a rendered `index.html` file in the `/my-demo/` directory (for example) will end up being accessible on the web at `https://microsoftedge.github.io/demos/my-demo/`.

1. Edit the code (such as `index.html` or `style.css`) in the new directory. Add any files you need.

1. Add a link to your demo in this `README.md` file, in a new row in one of the tables.

| Demo name | Description and docs | Source code & Readme | Live demo page |
|---|---|---|---|
| Template: My new demo | Template directory to copy/paste to add a new demo. | [/template/](https://github.com/MicrosoftEdge/Demos/tree/main/template) | [Template](https://microsoftedge.github.io/Demos/template/) for demos |


<!-- ====================================================================== -->
## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


<!-- ====================================================================== -->
## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
