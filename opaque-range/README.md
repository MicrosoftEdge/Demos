# OpaqueRange

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/opaque-range/)** ⬅️

The `OpaqueRange` API is a new `AbstractRange` subclass that enables web developers to obtain ranges over the value of `<textarea>` and text based `<input>` (`text`, `search`, `tel`, `url`, or `password`) elements. This makes it possible use geometry methods, like `getBoundingClientRect()`, and use the [CSS Custom Highlight API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API) directly on text within form controls, without needing workarounds like cloning elements into `<div>` elements. OpaqueRange is live, as it automatically updates its offsets as text content changes. 

The demo includes five interactive use cases:

1. **Caret popup positioning**: Type `@` in the textarea or input field to see a mention popup appear at the exact caret position, powered by `OpaqueRange.getBoundingClientRect()`.

2. **Spell-check highlighting**: Misspelled words are highlighted in real time using the CSS Custom Highlight API with `OpaqueRange`, without any element cloning.

3. **Live range tracking**: Highlight the word "hello", then type before it — the highlight automatically follows because `OpaqueRange` updates its offsets in response to interactive edits.

4. **Disconnecting a range**: Create an `OpaqueRange` and then call `disconnect()` to detach it. Observe how offsets reset to 0 and the range stops receiving updates.

5. **Multi-line `getClientRects()`**: See individual per-line rectangles returned by `getClientRects()` for a multi-line selection inside a `<textarea>`.

## Try the feature

To try the feature, follow these steps:

1. Open a Chromium-based browser, such as Microsoft Edge or Chrome, and make sure the version is at least 147.

1. In the browser, open a new tab and go to `about:flags`.

   In Microsoft Edge, you end up at `edge://flags`.

1. In the **Search flags** box, enter **Experimental Web Platform features**.

1. Set the **Experimental Web Platform features** flag to **Enabled**.

1. Click the **Restart** button.

   The browser restarts, with the flag applied.


## Learn More

- [OpaqueRange explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/OpaqueRange/explainer.md)
- [WHATWG tracking issue](https://github.com/whatwg/html/issues/11478)
