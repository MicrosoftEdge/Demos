# DevTools issue: animating a CSS property that requires layout

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/devtools-animated-property-issue/)** ⬅️

DevTools now detects and warns about CSS properties that can cause layout-based performance issues when using CSS animations in a webpage.

This demo webpage shows two animations. The first one animates the `width` and `height` CSS properties, and the second one animates the `transform` property. While the result is the same, the first one forces the browser rendering engine to re-create the layout of the page at each frame of the animation, which could lead to performance issues while using the page. The second one runs on the compositor thread and doesn't impact the page's main thread.

The **Issues** and **Elements** tools now show a warning when an animation that uses a CSS property that requires layout is running on the page.

To learn more, see [The Issues tool and Styles pane warn about CSS properties that trigger Layout](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/whats-new/2023/06/devtools-114#the-issues-tool-and-styles-pane-warn-about-css-properties-that-trigger-layout) in _What's New in DevTools (Microsoft Edge 114)_.