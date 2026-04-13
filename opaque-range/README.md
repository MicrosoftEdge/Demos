# OpaqueRange

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/opaque-range/)** ⬅️

`OpaqueRange` lets developers create live ranges over text inside `<input>` and `<textarea>` elements that automatically update as the user edits. These ranges support geometry methods like `getBoundingClientRect()` and the [CSS Custom Highlight API](https://developer.mozilla.org/docs/Web/API/CSS_Custom_Highlight_API), enabling use cases like caret-positioned popups and inline search highlighting directly on form controls, without cloning elements or exposing internal DOM structure.

## Demos

- Caret popup positioning: Type `:` to trigger an emoji picker positioned at the caret.
- Search highlighting: All occurrences of a search term are highlighted in real time using the CSS Custom Highlight API.
- Live range tracking: Highlight "hello", then type before it and watch the highlight follow.
- Disconnecting a range: Call `disconnect()` to detach a range and observe offsets reset to 0.

## Learn more

- To learn more, read the [OpaqueRange explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/OpaqueRange/explainer.md).
- To give feedback on the feature, [create a new issue](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/new?template=opaque-range.md).
- To test the feature on your production website, [register for the origin trial](https://developer.chrome.com/origintrials/#/register_trial/1731071106770534401). To learn more about origin trials, see [Test experimental APIs and features by using origin trials](https://learn.microsoft.com/microsoft-edge/origin-trials/).

## Requirements

The feature is experimental and not yet enabled by default in Microsoft Edge's stable version.

To test the feature:

* Use Microsoft Edge version 148, or another Chromium-based browser with a matching version, or later.
* For local testing:
  * Go to `about://flags`.
  * Enable the **Experimental Web Platform features** flag.
* For testing on your production site: register for the [origin trial](https://developer.chrome.com/origintrials/#/register_trial/1731071106770534401).