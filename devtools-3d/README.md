# DevTools 3D View tool demo

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/devtools-3d/)** ⬅️

This demo page is useful to show some of the most useful features of the 3D View tool in Microsoft Edge DevTools.

* Read the blog post about the tool here (link coming soon).
* Watch the video about the tool here (link coming soon).
* Read documentation about the tool [here](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/3d-view/).

## Deeply nested DOM

Deep DOM trees can be hard to work with and may even lead to performance problems. The DOM tab in the 3D View tool makes it very easy to visualize where the DOM reaches high depth.

The demo page has an intro paragraph that is unncessarily nested in a series of wrapper elements. This appears in the 3D View tool as a high tower of elements.

## Out-of-document elements

Sometimes it is necessary to hide elements outside of the visible boundaries of the web page. However finding these elements with DevTools can be hard.

The ability to zoom out and pan the 3D scene in the the 3D View tool makes it much easier and faster to find them and select them.

In the demo page, there is a "skip to content" link outside of the document, in the top left corner. This link is useful for users of screen readers to jump straight to the content, but it does not need to be rendered in the page, so is put off page.

## Unwanted scrollbars

Unwanted scrollbars often occur on the web when working on your layout with CSS. Sometimes content overflows in unexpected ways. Debugging these problems can be time consuming and it isn't always obvious where to start looking.

The 3D View tool makes it easier by visually indicating which elements is overflowing.

In the demo page, there is an element at the bottom with a list of links which appears wider than all the other elements above it. Because of the way its `width` and `padding` are defined and because it uses `box-sizing: content-box`, this element ends up being wider than the available room and forces a horizontal scrollbar on the main content.

Changing the `box-sizing` property to `border-box` fixes this issue.

## Composited layers

Browser engines sometimes optimize the way to paint the web page to the screen, by splitting it in multiple independent layers. This way, when things change on the page, the engine does not necessarily need to paint everything again.

As a web developer, you can force the browser to create layers using CSS (e.g. `transform:translateZ`, or `will-change`) to make sure the page refreshes quickly. Because creating too many layers can have a negative effect on performance, it's important to only create the ones you need.

The 3D View tool makes it easy to review the list of layers, whether you have the right ones, and how many times they have been painted.

The demo page has a list of images you can navigate through. The list is promoted to its own layer by using `transform: translateZ(0)`.
