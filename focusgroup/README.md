# Focusgroup demos

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/focusgroup/)** ⬅️

Interactive demos for the HTML `focusgroup` attribute, which lets you add arrow-key navigation to composite widgets (the roving tabindex pattern) without JavaScript.

## Demos

> **Note:** The `focusgroup` attribute only manages keyboard navigation. Explicit ARIA roles (`role="toolbar"`, `role="tablist"`, etc.) must be set separately.

- [Index](https://microsoftedge.github.io/Demos/focusgroup/index.html): Overview page with a quick-demo toolbar and navigation to all demos
- [Toolbar](https://microsoftedge.github.io/Demos/focusgroup/toolbar.html): Toolbar demos using inline and block navigation
- [Tablist](https://microsoftedge.github.io/Demos/focusgroup/tablist.html): Tab control using the `tablist` behavior token (which defaults to inline + wrap), with `nomemory` to reset focus position on re-entry
- [Menu & Menubar](https://microsoftedge.github.io/Demos/focusgroup/menu.html): Vertical menu and horizontal menubar with nested submenus
- [Radio Group](https://microsoftedge.github.io/Demos/focusgroup/radiogroup.html): Radio button group navigation
- [Listbox](https://microsoftedge.github.io/Demos/focusgroup/listbox.html): Selectable list navigation
- [Accordion](https://microsoftedge.github.io/Demos/focusgroup/accordion.html): Accordion with block-axis arrow key navigation using `focusgroup="toolbar block"` and `role="group"`
- [Additional Concepts](https://microsoftedge.github.io/Demos/focusgroup/additional-concepts.html): Nested focusgroups, opt-out, deep descendants, CSS `reading-flow` integration, feature detection

## Learn more

- [Focusgroup Explainer (Open UI)](https://open-ui.org/components/scoped-focusgroup.explainer/)
- [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)

## Requirements

These demos use the scoped-focusgroup variant of the spec and require enabling the **Experimental Web Platform features** flag at `about://flags` in Microsoft Edge or another Chromium-based browser. The feature is experimental and not yet enabled by default in stable builds. See the [Open UI explainer](https://open-ui.org/components/scoped-focusgroup.explainer/) for the spec status.
