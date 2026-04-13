# OpaqueRange

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/opaque-range/)** ⬅️

`OpaqueRange` lets developers create live ranges over text inside `<input>` and `<textarea>` elements that automatically update as the user edits. These ranges support geometry methods like `getBoundingClientRect()` and the [CSS Custom Highlight API](https://developer.mozilla.org/docs/Web/API/CSS_Custom_Highlight_API), enabling use cases like caret-positioned popups and inline search highlighting directly on form controls, without cloning elements or exposing internal DOM structure.

## Demos

- Caret popup positioning: Type `:` to trigger an emoji picker positioned at the caret.
- Search highlighting: All occurrences of a search term are highlighted in real time using the CSS Custom Highlight API.
- Live range tracking: Highlight "hello", then type before it and watch the highlight follow.
- Disconnecting a range: Call `disconnect()` to detach a range and observe offsets reset to 0.

## Learn more

- [Give feedback on the feature](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/new?template=opaque-range.md)
- [OpaqueRange explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/OpaqueRange/explainer.md)
- [Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/1731071106770534401)

## Requirements

The feature is experimental and not yet enabled by default in stable builds. It is available in Microsoft Edge 148 and other Chromium-based browsers version 148 and later. Sign up for the [Origin Trial](https://developer.chrome.com/origintrials/#/register_trial/1731071106770534401) to enable the feature without a flag. Otherwise, enable the **Experimental Web Platform features** flag at `about://flags` in Microsoft Edge or another Chromium-based browser.