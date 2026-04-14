# OpaqueRange

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/opaque-range/)** ⬅️

🔗 **Links:**
* Explainer: [aka.ms/opaque-range-explainer](https://aka.ms/opaque-range-explainer)
* Demo: [aka.ms/opaque-range-demo](https://aka.ms/opaque-range-demo)
* Feedback: [aka.ms/opaque-range-feedback](https://aka.ms/opaque-range-feedback)

## Overview

`OpaqueRange` lets developers create live ranges over text inside `<input>` and `<textarea>` elements that automatically update as the user edits. These ranges support geometry methods like `getBoundingClientRect()` and the [CSS Custom Highlight API](https://developer.mozilla.org/docs/Web/API/CSS_Custom_Highlight_API), enabling use cases like caret-positioned popups and inline search highlighting directly on form controls, without cloning elements or exposing internal DOM structure.

## Demos

- Caret popup positioning: Type `:` to trigger an emoji picker positioned at the caret.
- Search highlighting: All occurrences of a search term are highlighted in real time using the CSS Custom Highlight API.
- Live range tracking: Highlight "hello", then type before it and watch the highlight follow.
- Disconnecting a range: Call `disconnect()` to detach a range and observe offsets reset to 0.

## Learn more

To learn more, read the [OpaqueRange explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/OpaqueRange/explainer.md).

## Test the feature

The feature is experimental and not yet enabled by default in Microsoft Edge's stable version.

To test the feature:

* Use Microsoft Edge version 148 or later, or another Chromium-based browser that matches this version.

* To test on your development machine:

  * Go to the `about://flags` page.
  * Enable the **Experimental Web Platform features** flag.
  * Restart the browser.

* To test in production, with your real users site, register for the origin trial:

  * [Edge origin trial](https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials/5f4620e8-2969-4579-a5c6-304b8fae7200).
  * [Chrome origin trial](https://developer.chrome.com/origintrials/#/register_trial/1731071106770534401).

## Provide feedback

To give feedback on the feature, [create a new issue](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/new?template=opaque-range.md).

