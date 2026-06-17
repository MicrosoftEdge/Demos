# ARIA actions demo

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/aria-actions/)** ⬅️

Interactive demo of [`aria-actions`](https://pr-preview.s3.amazonaws.com/w3c/aria/pull/1805.html), a new ARIA attribute that exposes secondary actions on an element to assistive technology. The value is an IDREFS list; each referenced element becomes an action that screen-reader users can invoke directly from the focused item.

The demo covers three composite-widget patterns: tabs, a listbox, and a data grid. Naming and structure follow [ARIA PR 1805](https://github.com/w3c/aria/pull/1805) and the [APG Tabs with Action Buttons example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-actions/).

## Learn more

- [ARIA spec PR 1805 — rendered preview](https://pr-preview.s3.amazonaws.com/w3c/aria/pull/1805.html) (current normative text)
- [Umbrella discussion: "Secondary actions on items in composite widget roles"](https://github.com/w3c/aria/issues/1440)
- [APG: Tabs with Action Buttons example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-actions/)
- [Proposal explainer (Sarah Higley)](https://gist.github.com/smhigley/8dbe67f834cc472e3a14bf6b289e6f0c)

## Requirements

The demo exercises Blink's **AriaActions** runtime feature, which is experimental and off by default in every channel. To turn it on:

| Method | Instructions |
|--------|--------------|
| `chrome://flags` | Open `chrome://flags/#enable-experimental-web-platform-features`, set it to **Enabled**, then relaunch. |
| Command line | Launch with `--enable-blink-features=AriaActions`. |

Microsoft Edge or any Chromium-based browser will work. Firefox and Safari have not shipped support.
