# Open UI's `<selectlist>` demos
<!-- partial dup of demo webpage content -->

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/selectlist/)** ⬅️

The purpose of [Open UI](https://open-ui.org/) is to provide the web platform with UI controls that can be styled and extended by web developers.

Open UI is working on [a specification of a new `<selectlist>` element](https://open-ui.org/components/selectlist) and it has been [prototyped in Chromium](https://chromestatus.com/feature/5737365999976448) by the Microsoft Edge team.

The sections of the demo webpage show how this prototype can currently be used to achieve what was once only possible with custom (and often inaccessible)<!-- todo: define/clarify "inaccessible" --> selects.

The **Open UI's `<selectlist>` demos** webpage has the following sections:

| Section | Description |
|---|---|
| **Rounded select** | Create a rounded listbox, with inline options that are constrained within the circle. |
| **Vertically aligned options** | Vertically align the popover so the selected option's vertical position matches that of the selected-value. |
| **Combobox** | Add a input field to the popover that can be used to filter the options. |
| **Multi-select** | Allow selecting multiple options from the list, displaying them in the button. |
| **Account switcher** | Display more text within options, use a custom toggle button, and display an icon next to some options. |
| **Scroll indicators** | Limit the max-height of the popover and provide scrolling. |
| **GitHub's issue filter** | Display icons for some options, support inline and list layouts within the same select, display groups of options. |
| **Dribbble's filter** | Custom toggle button with animation, icons for options. |
| **Word's color select** | Mix a grid of colors and a list of action items. Display a split button (click the A to set the color, click the arrow to open the dropdown list). |


<!-- ====================================================================== -->
## Providing feedback

The experimental `<selectlist>` control allows you to greatly extend the default control.  You can replace the entire shadow DOM of the control and introduce your own DOM elements tree, with extra elements inside and around the various button, listbox, and options parts.

The sections of the demo webpage use this technique to push the prototype to its limits, but as a result, sometimes produces poor accessibility.<!-- todo: orig: "some demos are inaccessible" -->  These demos provide a way to provoke discussions aimed at evolving the specification and implementation.  These implementations should not be taken as examples of what to do with the new `<selectlist>` element.
