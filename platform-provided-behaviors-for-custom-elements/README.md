# Platform-provided behaviors for custom elements

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/platform-provided-behaviors-for-custom-elements/)** ⬅️

🔗 **Links:**
* Explainer: [Platform-provided behaviors for custom elements explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/PlatformProvidedBehaviors/explainer.md)
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

To learn more, read our [platform-provided behaviors for custom elements explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/PlatformProvidedBehaviors/explainer.md).

## Test the feature

The feature is not enabled by default yet. To test the feature:

1. Use Microsoft Edge 149 or later, or another Chromium-based browser with a matching version.
1. In a new tab, go to the `about://flags` page.
1. Search for the flag named **Experimental Web Platform features**.
1. Enable the **Experimental Web Platform features** flag.
1. Restart the browser.

## Provide feedback

Comment on the [WHATWG issue](https://github.com/whatwg/html/issues/12150).
