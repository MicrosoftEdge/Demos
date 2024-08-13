# Microsoft Edge Demos

This repository contains demo webpages, apps, and sample code to demonstrate various features of Microsoft Edge.  The demo directories are grouped into the following sections below:
* [Microsoft Edge DevTools](#microsoft-edge-devtools)
* [Microsoft Edge extensions](#microsoft-edge-extensions)
* [Progressive Web Apps (PWAs)](#progressive-web-apps-pwas)
* [Cross-browser API samples](#cross-browser-api-samples)

This page also covers:
* [Adding a new demo](#adding-a-new-demo)
* [Contributing](#contributing)
* [Trademarks](#trademarks)


## Demos

Click a folder from the list above to find out more about a particular demo, or use the tables below.


#### Microsoft Edge DevTools

<!-- 
keep DevTools table sync'd:
https://github.com/MicrosoftEdge/Demos#readme
https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/sample-code/sample-code#list-of-devtools-samples
last sync'd April 16, 2024
-->

| Demo name | Description | Repo directory | Live demo page |
|:---|:---|:---|:---|
| CSS mirroring sourcemaps | Used for [Update .css files from within the Styles tab (CSS mirror editing)](https://learn.microsoft.com/microsoft-edge/visual-studio-code/microsoft-edge-devtools-extension/css-mirror-editing-styles-tab) for the DevTools extension for Visual Studio Code. | [/css-mirroring-sourcemaps-demo/](https://github.com/MicrosoftEdge/Demos/tree/main/css-mirroring-sourcemaps-demo) | n/a |
| TODO app | Simple To Do app with vanilla JavaScript.  Used for screenshots in the [Microsoft Edge DevTools documentation](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/), and for [Opening DevTools and the DevTools browser](https://learn.microsoft.com/microsoft-edge/visual-studio-code/microsoft-edge-devtools-extension/open-devtools-and-embedded-browser) for the DevTools extension for Visual Studio Code. | [/demo-to-do/](https://github.com/MicrosoftEdge/Demos/tree/main/demo-to-do) | [My tasks](https://microsoftedge.github.io/Demos/demo-to-do/) |
| Detached elements | Chat-like demo.  Used for [Debug DOM memory leaks with the Detached Elements tool](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/memory-problems/dom-leaks). | [/detached-elements/](https://github.com/MicrosoftEdge/Demos/tree/main/detached-elements) | [Simulate traffic](https://microsoftedge.github.io/Demos/detached-elements/) |
| 3D View | Used for [Navigate webpage layers, z-index, and DOM using the 3D View tool](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/3d-view/). | [/devtools-3d/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-3d) | [Microsoft Edge DevTools 3D View tool demo](https://microsoftedge.github.io/Demos/devtools-3d/) |
| Accessibility testing | Used for [Overview of accessibility testing using DevTools](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/accessibility/accessibility-testing-in-devtools). | [/devtools-a11y-testing/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-a11y-testing) | [Animal shelter](https://microsoftedge.github.io/Demos/devtools-a11y-testing/) |
| DevTools issue: animating a CSS property that requires layout | Illustrates the **Issues** and **Elements** tools warning when CSS properties that require layout are animated. | [/devtools-animated-property-issue/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-animated-property-issue) | [Animated CSS property demo](https://microsoftedge.github.io/Demos/devtools-animated-property-issue/) |
| Console panel demo pages | Used for [Console overview](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/console/), [Log messages in the Console tool](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/console/console-log), and [Fix JavaScript errors that are reported in the Console](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/console/console-debug-javascript). | [/devtools-console/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-console) | [DevTools Console panel demo pages](https://microsoftedge.github.io/Demos/devtools-console/) |
| DOM interaction from the Console demo page | Used for [Interact with the DOM using the Console](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/console/console-dom-interaction). | [/devtools-console-dom-interactions/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-console-dom-interactions) | [DevTools Console tool DOM interactions demo](https://microsoftedge.github.io/Demos/devtools-console-dom-interactions/) |
| Contrast bug fix | Used for [Improving contrast in Microsoft Edge DevTools: A bugfix case study](https://blogs.windows.com/msedgedev/2021/06/15/improving-contrast-in-microsoft-edge-devtools-a-bugfix-case-study/). | [/devtools-contrast-bugfix/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-contrast-bugfix) | [Testing all badges in DevTools for contrast issues](https://microsoftedge.github.io/Demos/devtools-contrast-bugfix/) |
| CSS Examples | Used for [Get started viewing and changing CSS](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/css/). | [/devtools-css-get-started/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-css-get-started) | [CSS Examples](https://microsoftedge.github.io/Demos/devtools-css-get-started/) |
| DOM Examples | Used for [Get started viewing and changing the DOM](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/dom/). | [/devtools-dom-get-started/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-dom-get-started) | [DOM Examples](https://microsoftedge.github.io/Demos/devtools-dom-get-started/) |
| Explain Console errors and warnings in Copilot in Edge | Generates errors in the Console that can then be explained by using Copilot in Edge. | [/devtools-explain-error/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-explain-error) | [Explaining console errors demo](https://microsoftedge.github.io/Demos/devtools-explain-error/) |
| Inspect tool | Used for [Analyze pages using the Inspect tool](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/css/inspect). | [/devtools-inspect/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-inspect) | [Inspect Demo](https://microsoftedge.github.io/Demos/devtools-inspect/) |
| Inspect CSS Grid | Used for [Inspect CSS Grid](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/css/grid). | [/devtools-grid/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-grid) | [Inspect CSS Grid](https://microsoftedge.github.io/Demos/devtools-grid/) |
| Debugging JavaScript that adds two numbers | Used for [Get started debugging JavaScript](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/javascript/). | [/devtools-js-get-started/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-js-get-started) | [Demo: Debugging JavaScript with Microsoft Edge DevTools](https://microsoftedge.github.io/Demos/devtools-js-get-started/) |
| Memory heap snapshot | Used for [Record heap snapshots using the Memory tool](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/memory-problems/heap-snapshots). | [/devtools-memory-heap-snapshot/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-memory-heap-snapshot) | n/a |
| Performance Activity Tabs | Used for [View activities in a table](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/evaluate-performance/reference#view-activities-in-a-table), about the **Performance** tool's **Bottom-Up**, **Call Tree**, and **Event Log** tabs. | [/devtools-performance-activitytabs/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-performance-activitytabs) | [Activity Tabs Demo](https://microsoftedge.github.io/Demos/devtools-performance-activitytabs/) |
| Sluggish Animation | Used for [Introduction to the Performance tool](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/evaluate-performance/). | [/devtools-performance-get-started/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-performance-get-started) | [Sluggish Animation](https://microsoftedge.github.io/Demos/devtools-performance-get-started/) |
| postMessage Trace Events | Tests `postMessage` trace events in the **Performance** tool.  Used for [View messages between windows, iframes, and dedicated workers](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/evaluate-performance/reference#view-messages-between-windows-iframes-and-dedicated-workers) in _Performance features reference_. | [/devtools-postmessage-perf-timeline/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-postmessage-perf-timeline) | [postMessage Trace Events demo](https://microsoftedge.github.io/Demos/devtools-postmessage-perf-timeline/) |
| CSS :target pseudo-class | Used for [Support forcing the :target CSS state](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/whats-new/2021/01/devtools#support-forcing-the-target-css-state). | [/devtools-target-pseudo/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-target-pseudo) | [CSS :target pseudo-class demo](https://microsoftedge.github.io/Demos/devtools-target-pseudo/) |
| Heap Snapshot Visualizer | Source code for the [Heap Snapshot Visualizer](https://microsoftedge.microsoft.com/addons/detail/heap-snapshot-visualizer/fceldlhognbemkgfacnffkdanocidgce) extension for DevTools. | [/heap-snapshot-visualizer/](https://github.com/MicrosoftEdge/Demos/tree/main/heap-snapshot-visualizer) | n/a |
| JSON dummy data | Simple JSON files.  Used for [View formatted JSON](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/json-viewer/json-viewer). | [/json-dummy-data/](https://github.com/MicrosoftEdge/Demos/tree/main/json-dummy-data) | [JSON dummy data](https://microsoftedge.github.io/Demos/json-dummy-data/) |
| Inspect Network Activity | Used for [Inspect network activity](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/network/). | [/network-tutorial/](https://github.com/MicrosoftEdge/Demos/tree/main/network-tutorial) | [Inspect Network Activity Demo](https://microsoftedge.github.io/Demos/network-tutorial/) |
| Photo gallery | Used for [The truth about CSS selector performance](https://blogs.windows.com/msedgedev/2023/01/17/the-truth-about-css-selector-performance/). | [/photo-gallery/](https://github.com/MicrosoftEdge/Demos/tree/main/photo-gallery) | [Photo Gallery](https://microsoftedge.github.io/Demos/photo-gallery/) |
| Slow Calendar | Simple calendar demo app to test DevTools features such as the **Performance** tool and source map support. | [/slow-calendar/](https://github.com/MicrosoftEdge/Demos/tree/main/slow-calendar) | [Slow Calendar](https://microsoftedge.github.io/Demos/slow-calendar/public/) |
| Workspaces | Used for [Edit files with Workspaces (Filesystem tab)](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/workspaces), in the **Sources** tool. | [/workspaces/](https://github.com/MicrosoftEdge/Demos/tree/main/workspaces) | [DevTools Workspaces Demo](https://microsoftedge.github.io/Demos/workspaces/) |


#### Microsoft Edge extensions

| Demo name | Description | Repo directory | Live demo page |
|:---|:---|:---|:---|
| DevTools extension | Used for [Create an extension that customizes the DevTools UI](https://learn.microsoft.com/microsoft-edge/extensions-chromium/developer-guide/devtools-extension). | [/devtools-extension/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension) | n/a |
| Basic | A basic DevTools extension. | [/devtools-extension/sample 1/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension/sample%201) | n/a |
| Panel | A basic DevTools extension with a panel. | [/devtools-extension/sample 2/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension/sample%202) | n/a |
| CDP | A basic DevTools extension invoking Chrome Developer Protocol (CDP) APIs. | [/devtools-extension/sample 3/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension/sample%203) | n/a |
| Inspect | A basic DevTools extension that interacts with the Inspected page. | [/devtools-extension/sample 4/](https://github.com/MicrosoftEdge/Demos/tree/main/devtools-extension/sample%204) | n/a |


#### Progressive Web Apps (PWAs)

| Demo name | Description | Repo directory | Live demo page |
|:---|:---|:---|:---|
| 1DIV | A CSS sandbox PWA that demonstrates the Window Controls Overlay feature. | [/1DIV/](https://github.com/MicrosoftEdge/Demos/tree/main/1DIV) | [1DIV](https://microsoftedge.github.io/Demos/1DIV/dist/) |
| Email client | A simulated email client PWA that demonstrates how to use PWA protocol handlers. | [/email-client/](https://github.com/MicrosoftEdge/Demos/tree/main/email-client) | [Email inbox](https://microsoftedge.github.io/Demos/email-client/) |
| PWAmp | A music player PWA demo to play local audio files. | [/pwamp/](https://github.com/MicrosoftEdge/Demos/tree/main/pwamp) | [pwamp](https://microsoftedge.github.io/Demos/pwamp/) |
| wami | An image manipulation demo app to crop, resize, or add effects to images. | [/wami/](https://github.com/MicrosoftEdge/Demos/tree/main/wami) | [wami](https://microsoftedge.github.io/Demos/wami/) |
| Temperature converter | A simple PWA demo app that converts temperatures. Used for [Get started with Progressive Web Apps](https://learn.microsoft.com/microsoft-edge/progressive-web-apps-chromium/how-to/). | [/pwa-getting-started/](https://github.com/MicrosoftEdge/Demos/tree/main/pwa-getting-started) | [Temperature converter](https://microsoftedge.github.io/Demos/pwa-getting-started/) |


#### Cross-browser API samples

| Demo name | Description | Repo directory | Live demo page |
|:---|:---|:---|:---|
| CSS Custom Highlight API | How to programmatically create and remove custom highlights on a web page. | [/custom-highlight-api/](https://github.com/MicrosoftEdge/Demos/tree/main/custom-highlight-api) | [Custom Highlight API](https://microsoftedge.github.io/Demos/custom-highlight-api/) |
| EyeDropper API | How to use the EyeDropper API to create a color sampling tool from JavaScript. | [/eyedropper/](https://github.com/MicrosoftEdge/Demos/tree/main/eyedropper) | [EyeDropper API demos](https://microsoftedge.github.io/Demos/eyedropper/) |
| Reader app | An article reader app used to demonstrate how to use various web APIs such as CSS Custom Highlight, `<selectlist>`, EyeDropper, CSS and JSON modules, Scroll animation timeline, and Async Clipboard. | [/reader/](https://github.com/MicrosoftEdge/Demos/tree/main/reader) | [Reader](https://microsoftedge.github.io/Demos/reader/) |
| Selectlist demos | Demo page showing how the Open UI's `<selectlist>` element can be used. | [/selectlist/](https://github.com/MicrosoftEdge/Demos/tree/main/selectlist) | [Open UI's \<selectlist\> demos](https://microsoftedge.github.io/Demos/selectlist/) |
| EditContext API demo | Demo page showing how the EditContext API can be used to build an advanced text editor. | [/edit-context/](https://github.com/MicrosoftEdge/Demos/tree/main/edit-context) | [HTML editor demo](https://microsoftedge.github.io/Demos/edit-context/) |
| SVG support in the Async Clipboard API | Demo page showing how the Async Clipboard API supports SVG format. | [/svg-clipboard/](https://github.com/MicrosoftEdge/Demos/tree/main/svg-clipboard) | [SVG clipbard support demo](https://microsoftedge.github.io/Demos/svg-clipboard/) |


## Adding a new demo

To add a new demo:

1. Make a copy of the `template` directory at the root of this repository and give it a name, such as `my-demo`.

1. Edit the `README.md` file in the new directory to clearly explain what your new demo is about.

1. In the README file, include a GitHub.io link that points to the live demo.

   This repository is set up to be deployed live using GitHub Pages (GitHub.io), so a rendered `index.html` file in the `my-demo` directory (for example) will end up being accessible on the web at `https://microsoftedge.github.io/demos/my-demo/`.

1. Edit the code (such as `index.html` or `style.css`) in the new directory. Add any files you need.

1. Add a link to your demo in this `README.md` file, in a new row in one of the tables.


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


## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
