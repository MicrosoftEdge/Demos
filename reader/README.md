# Reader demo: 2022 upcoming web platform APIs

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/reader/)** ⬅️

<!-- todo: relate this demo to selectlist demo -->

🌟 _This Reader demo app was made in 2022, and was meant to showcase some of the APIs coming to the web platform at this time. If you are using this demo app at a later time, better APIs might exist, and more browsers might be supported._ 🌟

The Reader demo app uses the following web APIs:
* [CSS Custom Highlight API](#css-custom-highlight-api)
* [<selectmenu> element](#selectmenu-element)<!-- todo: selectmenu renamed to selectlist? -->
* [EyeDropper API](#eyedropper-api)
* [CSS modules](#css-modules)
* [JSON modules](#json-modules)
* [Scroll animation timeline](#scroll-animation-timeline)
* [Async Clipboard API](#async-clipboard-api)
* [Navigation API](#navigation-api)

Details are below.

These APIs are new and not widely supported. Some even require a flag to be switched on before being usable. To use the demo app, use a Canary version of Microsoft Edge (or another Chromium-based browser) and enable the following flag in `about:flags`: **Experimental Web Platform features**.

Basic support is provided in other browsers, where not all features will work.


<!-- ====================================================================== -->
## About the Reader demo app

The Reader demo app is a reader mode for articles published on the web.

To use the Reader demo app:

1. In a new window or tab, go to an article on another website, such as the blog post [Looking back at Microsoft Edge for developers in 2021](https://blogs.windows.com/msedgedev/2022/01/19/looking-back-at-microsoft-edge-for-developers-in-2021/).

   The Reader doesn't work with content from all websites, but blogs tend to work well.

1. Copy the entire text from the web page.

1. Open the [Reader demo app](https://microsoftedge.github.io/Demos/reader/).

1. Paste the text.

   The reader detects the main content and display it in a layout that makes reading more comfortable.

1. The following features can then be used (depending on browser support):

    * As you scroll down the article, a reading indicator appears at the top of the page.<!-- todo: not displayed -->

    * A theme switcher drop-down is displayed in the top-right corner. Use it to switch to a different theme, or click the star icon to build your own theme using an eye dropper tool.<!-- todo: no star icon, there's an empty menuitem -->

    * Select text in the article and click **Highlight** to create highlighted snippets of text. Clicking on an existing snippet, listed on the left, scrolls to the snippet within the article. You can also delete snippets.

    * You can also reload the reader later, to restore the latest article and highlights.

You can paste multiple articles and they will all be stored locally.  When accessing the Reader demo app, all articles are listed, and you can go back and forth between them by using the browser navigation buttons.


<!-- ====================================================================== -->
## CSS Custom Highlight API

The CSS Custom Highlight API makes it possible to highlight ranges of text on a web page, without having to insert custom markup within the page, which can quickly become hard to manage.

The API makes use of Range objects in JavaScript, and the `::highlight()` CSS selector to highlight text.

1. First, create a new `Highlight` object: `const customHighlightInstance = new Highlight();`. Note that you can create as many as you want.

1. Then register this new highlight in the highlights registry: `CSS.highlights.set('custom-highlight', customHighlightInstance);`. Note that `custom-highlight` is a name you choose and will then reference from CSS.

1. Then add ranges to the highlight object: `customHighlightInstance.add(currentRange);`. Note that you can add as many as you want.

1. Finally, style the highlight, using the custom name passed when registering it: `::highlight(custom-highlight) { background-color: #f06; }`.

See how the CSS Custom Highlight API is used in the Reader app in [highlighter.js](./highlighter.js).


<!-- ------------------------------ -->
### Resources

* [CSS Custom Highlight API: The Future of Highlighting Text Ranges on the Web](https://css-tricks.com/css-custom-highlight-api-early-loo/)
* [CSS Custom Highlight API Module Level 1](https://www.w3.org/TR/css-highlight-api-1/)
* [Custom Highlight API on chromestatus.com](https://chromestatus.com/feature/5436441440026624)


<!-- ------------------------------ -->
### Browser support

The API is implemented in Chromium, behind the `Experimental Web Platform features` flag, and in Safari behind the `Highlight API` flag.


<!-- ====================================================================== -->
## `<selectmenu>` element<!-- todo: renamed to selectlist? -->

Traditional `<select>` elements are impossible to fully style. The button part of a select can be styled, but the drop-down and options are limited.

`<selectmenu>` is an experimental element currently being implemented in Chromium, based on the work done by the OpenUI group, and meant at overcoming these limitations.

The element can fully be styled using:

* The `::part()` CSS selector (e.g. `selectmenu::part(button)` to style the button part or `selectmenu::part(listbox)` to style the popup),
* Or by replacing the default markup with your own `<selectmenu><button slot="button" behavior="button">...</selectmenu>`.

You can go very far in how much you customize the selectmenu component with only CSS.

See `<selectmenu>` element in action in the app's code:

* The `<selectmenu>` is created in the `ThemeSelector` constructor in [theme-selector.js](./theme-selector/theme-selector.js).
* Its various parts are then styled in [theme-selector.css](./theme-selector/theme-selector.css).


<!-- ------------------------------ -->
### Resources

* [Say Hello to selectmenu, a Fully Style-able select Element](https://css-tricks.com/the-selectmenu-element/)
* [Select (Editor's Draft)](https://open-ui.org/components/select)
* [How to use the `<selectmenu>` component](https://open-ui.org/prototypes/selectmenu)
* [Customizable `<select>` Element on chromestatus.com](https://chromestatus.com/feature/5737365999976448)
* [Open UI's `<selectmenu>` demos](https://microsoftedge.github.io/Demos/selectmenu/)


<!-- ------------------------------ -->
### Browser support

The `<selectmenu>` element is implemented in Chromium, behind the `Experimental Web Platform features` flag. Expect changes! On other browsers, the demo app uses a traditional `<select>` element.


<!-- ====================================================================== -->
## EyeDropper API

The EyeDropper API provides a mechanism for creating an eyedropper tool from JavaScript. Using this tool, users can sample colors from their screens, including outside of the browser window.

1. Create a new EyeDropper object: `const eyeDropper = new EyeDropper();`
1. Call the `open` async method: `const result = await eyeDropper.open();`
1. Once the user has selected a pixel, get the hex color: `const color = result.sRGBHex;`

See how the EyeDropper API is used in [theme-selector.js](./theme-selector/theme-selector.js).


<!-- ------------------------------ -->
### Resources

* [Picking colors of any pixel on the screen with the EyeDropper API](https://web.dev/eyedropper/)
* [EyeDropper API on MDN](https://developer.mozilla.org/docs/Web/API/EyeDropper_API)
* [EyeDropper API WICG spec](https://wicg.github.io/eyedropper-api/)


<!-- ------------------------------ -->
### Browser support

The EyeDropper API is supported in Chromium browsers.


<!-- ====================================================================== -->
## CSS modules

CSS modules make it possible to use the existing module loading/dependency system from the browser to seamlessly load CSS styles in components.

1. Import styles: `import styles from "./style.css" assert { type: "css" };`

1. Use the styles in a web component's shadow root: `this.shadowRoot.adoptedStyleSheets = [styles];`

See how CSS modules are used in [text-snippet.js](./text-snippet/text-snippet.js).


<!-- ------------------------------ -->
### Resources

* [CSS module scripts on chromestatus.com](https://chromestatus.com/feature/5948572598009856)
* [Explainer](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/css-modules-v1-explainer.md)


<!-- ------------------------------ -->
### Browser support

CSS modules are supported in Chromium browsers, but a [polyfill](https://github.com/guybedford/es-module-shims/) is used to make them work in other browsers too.


<!-- ====================================================================== -->
## JSON modules

JSON modules make it possible to use the existing module loading/dependency system from the browser to seamlessly load JSON data from JavaScript.

1. Import JSON: `import DATA from "./data.json" assert { type: "json" };`

1. Use the JSON data as normal.

See how JSON modules are used in [theme-selector.js](./theme-selector/theme-selector.js).


<!-- ------------------------------ -->
### Resources

* [JSON modules on chromestatus.com](https://chromestatus.com/feature/5749863620804608)
* [JSON modules TC39 proposal](https://github.com/tc39/proposal-json-modules)


<!-- ------------------------------ -->
### Browser support

JSON modules are supported in Chromium browsers, but a [polyfill](https://github.com/guybedford/es-module-shims/) is used to make them work in other browsers too.


<!-- ====================================================================== -->
## Scroll animation timeline

Web animations are usually tied to time. As time passes, the animation progresses, and sometimes eventually ends. It is sometimes desirable to tie an animation's progress to the user's progress through the web page instead. As the user scrolls further and further through a container, the animation progresses, and eventually ends with the user reaching the end of the container.

The scroll timeline makes this possible.

1. Define an element to be animated and set a CSS animation as normal: `.foo { animation: 1s linear forwards animation-name; } @keyframes animation-name { from {width: 0} to {width: 100%} }`

1. Define an animation timeline: `@scroll-timeline scrollTimeline { source: auto; orientation: vertical; scroll-offsets: 0%, 100%; }`

1. Set the animation timeline on the element: `.foo { animation-timeline: scrollTimeline; }`

See how the scroll animation timeline is used in [`reader.css`](./reader.css).


<!-- ------------------------------ -->
### Resources

* [@scroll-timeline on MDN](https://developer.mozilla.org/docs/Web/CSS/@scroll-timeline)
* [Scroll-linked animations spec](https://drafts.csswg.org/scroll-animations-1/)


<!-- ------------------------------ -->
### Browser support

The scroll timeline is implemented in Chromium, behind the `Experimental Web Platform features` flag.


<!-- ====================================================================== -->
## Async Clipboard API

Browsers inconsistently support clipboard access. The Async Clipboard API is a new way to access the clipboard, securely and asynchronously, with a simpler and more future-proof API.

See how the Async Clipboard API is used in [`on-paste-html.js`](./on-paste-html.js).


<!-- ------------------------------ -->
### Resources

* [Unblocking clipboard access](https://web.dev/async-clipboard/)
* [Asynchronous Clipboard API spec](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api)
* [Async Clipboard API explainer](https://github.com/w3c/clipboard-apis/blob/main/explainer.adoc)


<!-- ------------------------------ -->
### Browser support

The Async Clipboard API is supported in Chromium-browsers, Safari, and experimentally supported in Firefox behind the `dom.events.asyncClipboard` flags.


<!-- ====================================================================== -->
## Navigation API

The Navigation API is a new way to intercept browser navigation events, and is meant to replace the limited History API.

See how the Navigation API is used in [`reader.js`](./reader.js).


<!-- ------------------------------ -->
### Resources

* [Navigation](https://developer.mozilla.org/docs/Web/API/Navigation) at MDN.
* [Modern client-side routing: the Navigation API](https://developer.chrome.com/docs/web-platform/navigation-api/)
* [Navigation API WICG spec](https://wicg.github.io/navigation-api/)


<!-- ------------------------------ -->
### Browser support

The Navigation API is supported in Chromium-browsers.


<!-- ====================================================================== -->
## See also

* [Fully style the drop-down part of a HTML `<select>` with the new `<selectmenu>` element](https://learn.microsoft.com/microsoft-edge/dev-videos/#fully-style-the-drop-down-part-of-a-html-select-with-the-selectmenu-element) in _Videos about web development with Microsoft Edge_.
* [Create a scroll-linked animation without JavaScript](https://learn.microsoft.com/microsoft-edge/dev-videos/#create-a-scroll-linked-animation-without-javascript) in _Videos about web development with Microsoft Edge_.
