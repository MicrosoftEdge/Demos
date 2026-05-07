# Web component platform behaviors

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/web-component-platform-behaviors/)** ⬅️

🔗 **Links:**
* Explainer: [Platform-provided behaviors explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/PlatformProvidedBehaviors/explainer.md)
* WHATWG issue: [#12150](https://github.com/whatwg/html/issues/12150)
* Spec PR: [whatwg/html#12409](https://github.com/whatwg/html/pull/12409)
* Chromium bug: [crbug.com/486928684](https://crbug.com/486928684)

## Overview

Platform-provided behaviors allow custom elements to adopt native HTML behaviors through `attachInternals({ behaviors: [...] })`. The first behavior, `HTMLSubmitButtonBehavior`, turns a custom element into a submit button that participates in form submission, contributes name/value pairs, supports form override attributes, triggers implicit submission, exposes the correct accessibility semantics, and responds to keyboard activation.

## Demos

- **Basic form submission**: A `<my-submit-button>` custom element with `HTMLSubmitButtonBehavior` submits a form the same way a native `<button type="submit">` does.
- **Form override properties**: Shows how `name`, `value`, `formAction`, `formMethod`, and `formEnctype` on the behavior instance let an `<override-submit-button>` custom element override the form's defaults.
- **Implicit submission**: Pressing Enter in a text field triggers implicit submission through an `<implicit-submit-button>` custom element.
- **Accessibility and keyboard activation**: An `<a11y-submit-button>` custom element gets `role="button"`, focusability, and Enter/Space activation with no extra code.

## Learn more

Read our [platform-provided behaviors explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/PlatformProvidedBehaviors/explainer.md).

## Test the feature

The feature is behind a flag and not yet enabled by default. To test it locally:

1. Use Microsoft Edge or another Chromium-based browser, version 149 or later.
2. Navigate to `about://flags`.
3. Search for **Experimental Web Platform features** and enable it.
4. Restart the browser.
5. Open this demo. If the feature is active, you will not see any warning banner at the top.

## Provide feedback

Comment on the [WHATWG issue](https://github.com/whatwg/html/issues/12150).
