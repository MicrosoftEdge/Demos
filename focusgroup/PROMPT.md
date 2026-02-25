# Prompt: Create Focusgroup Demos for MicrosoftEdge/Demos

## Objective

Create a new demo directory `/focusgroup/` in the MicrosoftEdge/Demos repository that showcases the HTML `focusgroup` attribute — a declarative way to enable arrow-key keyboard navigation (roving tabindex) for composite widgets without JavaScript.

The demo should serve as both an interactive learning tool and a reference for web developers adopting the `focusgroup` attribute in their own projects.

---

## Context & References

### What is `focusgroup`?

The `focusgroup` HTML attribute enables authors to declaratively add arrow-key navigation among focusable elements within a container. It replaces the manual "roving tabindex" pattern (which requires significant JavaScript boilerplate) with a simple HTML attribute.

Key capabilities:
- **Arrow-key navigation** — moves focus forward/backward among focusable descendants
- **Guaranteed tab stop** — ensures at least one element in the group participates in tab order, even when all children use `tabindex="-1"`
- **Last-focused memory** — remembers and restores focus to the previously focused element when re-entering the group
- **Wrapping** — optional wrap-around at group boundaries (`wrap` token)
- **Axis locking** — restrict arrow navigation to horizontal (`inline`) or vertical (`block`) axis only
- **Opt-out** — exclude elements/subtrees from focusgroup participation (`focusgroup="none"`)
- **Grid navigation** — 2D arrow-key navigation for table-structured data (`focusgroup="grid"`)

### Specifications & Resources

- **Focusgroup Explainer (Open UI):** https://open-ui.org/components/scoped-focusgroup.explainer/
- **MicrosoftEdge/Demos repository:** https://github.com/MicrosoftEdge/Demos

### Browser Support Note

The `focusgroup` attribute is an experimental feature. At the time of writing, it may require enabling experimental browser flags in Microsoft Edge or other Chromium-based browsers. The demo pages should include a clear notice about this.

---

## Repository Conventions to Follow

### Directory & File Structure

Copy from the `/template/` directory and adapt:

```
focusgroup/
├── README.md
├── index.html          # Main landing/overview page with links to individual demos
├── style.css           # Shared stylesheet
├── script.js           # Shared JS (feature detection, interactive demo helpers)
├── toolbar.html        # Toolbar pattern demo
├── tablist.html        # Tablist/tabs pattern demo
├── menu.html           # Menu & menubar pattern demo
├── radiogroup.html     # Radio group pattern demo
├── listbox.html        # Listbox pattern demo
├── accordion.html      # Accordion pattern demo
├── grid.html           # Grid/table navigation demo
└── advanced.html       # Advanced patterns (nesting, opt-out, shadow DOM, reading-flow)
```

### HTML Boilerplate

Every HTML file should use:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Focusgroup: [Page Title]</title>
    <link rel="icon" type="image/png" href="https://edgestatic.azureedge.net/welcome/static/favicon.png">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- content -->
    <script src="script.js"></script>
</body>
</html>
```

### CSS Conventions

- Use the Segoe UI font stack: `Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif`
- Include `box-sizing: border-box` reset
- Support both light and dark themes using `prefers-color-scheme` media query
- Use CSS custom properties for theming
- Make demos responsive (mobile-friendly)
- Use a visible, high-contrast focus ring (e.g., `outline: 2px solid #f59e0b; outline-offset: 2px;`) so focus movement is clearly visible to users

### README.md Format

```markdown
# Focusgroup demos

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/focusgroup/)** ⬅️

Interactive demos for the HTML `focusgroup` attribute, which provides declarative
arrow-key keyboard navigation for composite widgets — implementing the "roving tabindex"
pattern natively without JavaScript.

## Demos

- [Toolbar](https://microsoftedge.github.io/Demos/focusgroup/toolbar.html) — Horizontal/vertical toolbar with arrow-key navigation
- [Tablist](https://microsoftedge.github.io/Demos/focusgroup/tablist.html) — Tab control with inline wrapping and no-memory
- [Menu](https://microsoftedge.github.io/Demos/focusgroup/menu.html) — Vertical menu and menubar with nested submenus
- [Radio Group](https://microsoftedge.github.io/Demos/focusgroup/radiogroup.html) — Radio button group navigation
- [Listbox](https://microsoftedge.github.io/Demos/focusgroup/listbox.html) — Selectable list navigation
- [Accordion](https://microsoftedge.github.io/Demos/focusgroup/accordion.html) — Accordion with block-axis navigation and opt-out panels
- [Grid](https://microsoftedge.github.io/Demos/focusgroup/grid.html) — 2D grid/table navigation
- [Advanced](https://microsoftedge.github.io/Demos/focusgroup/advanced.html) — Nested focusgroups, opt-out, shadow DOM, reading-flow

## Learn more

- [Focusgroup Explainer (Open UI)](https://open-ui.org/components/scoped-focusgroup.explainer/)
- [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)

## Requirements

May require enabling experimental browser flags in Microsoft Edge or Chromium-based browsers.
```

### Top-Level README Update

Add a row to the **Cross-browser API samples** table in `/README.md`:

```markdown
| Focusgroup demos | Interactive demos for the HTML `focusgroup` attribute for declarative arrow-key keyboard navigation in composite widgets. | [/focusgroup/](https://github.com/MicrosoftEdge/Demos/tree/main/focusgroup) | [Focusgroup demos](https://microsoftedge.github.io/Demos/focusgroup/) |
```

---

## Demo Pages: Detailed Specifications

### 1. `index.html` — Landing Page

**Purpose:** Overview of focusgroup with links to all individual demo pages.

**Content:**
- H1 title: "Focusgroup: Interactive Demos"
- Brief explanation of what `focusgroup` is and why it matters (replaces roving tabindex boilerplate)
- Browser compatibility notice (experimental flags may be needed)
- Feature detection script that shows a warning banner if `focusgroup` is not supported:
  ```js
  if (!('focusgroup' in HTMLElement.prototype)) {
    // Show warning banner
  }
  ```
- Card grid linking to each demo page, with a one-line description of each pattern
- Quick inline demo: a simple toolbar with `focusgroup` to give visitors an immediate interactive taste
- Link to the Open UI explainer and ARIA APG

**Design:**
- Clean card layout for the demo links
- Each card should show the pattern name, a short description, and the `focusgroup` attribute value used
- Use the page itself as a subtle focusgroup demo (e.g., the nav/toc sidebar could use `focusgroup="menu block"` for keyboard navigation between demo links)

---

### 2. `toolbar.html` — Toolbar Pattern

**Purpose:** Demonstrate the most common `focusgroup` use case — a toolbar with arrow-key navigation.

**Demos to include:**

#### 2a. Basic Toolbar
```html
<div role="toolbar" focusgroup="toolbar inline" aria-label="Text formatting">
    <button type="button">Bold</button>
    <button type="button">Italic</button>
    <button type="button">Underline</button>
    <button type="button">Strikethrough</button>
</div>
```
- All children use default focusability (buttons are natively focusable)
- Left/Right arrows navigate between buttons
- Explain: the toolbar is **one tab stop** — Tab enters, arrows navigate within, Tab exits

#### 2b. Toolbar with `tabindex="-1"` (Roving Tabindex Replacement)
```html
<div role="toolbar" focusgroup="toolbar inline" aria-label="Document actions">
    <button type="button" tabindex="-1">New</button>
    <button type="button" tabindex="-1">Open</button>
    <button type="button" tabindex="-1">Save</button>
    <button type="button" tabindex="-1">Print</button>
</div>
```
- Show that even with all `tabindex="-1"`, `focusgroup` guarantees a tab stop
- No JavaScript needed to manage `tabindex` values

#### 2c. Toolbar with `focusgroupstart` Entry Point
```html
<div role="toolbar" focusgroup="toolbar inline no-memory" aria-label="Entry point demo">
    <button type="button">First</button>
    <button type="button" focusgroupstart>Middle (Entry)</button>
    <button type="button">Last</button>
</div>
```
- Show that `focusgroupstart` controls which element receives focus on entry
- Both Tab and Shift+Tab land on the `focusgroupstart` element

#### 2d. Vertical Toolbar
```html
<div role="toolbar" focusgroup="toolbar block" aria-label="Vertical toolbar">
    <button type="button">Cut</button>
    <button type="button">Copy</button>
    <button type="button">Paste</button>
</div>
```
- Demonstrate `block` axis locking — only Up/Down arrows work

**Each demo should include:**
- A heading and brief description
- A "Try it" instruction with specific keys to press
- The live interactive widget
- The HTML source code in a `<pre><code>` block
- A "What to notice" bullet list explaining the behavior

---

### 3. `tablist.html` — Tab Control Pattern

**Purpose:** Show how `focusgroup` supports the tabs/tablist pattern.

**Demos to include:**

#### 3a. Basic Tablist with Wrapping
```html
<div role="tablist" focusgroup="tablist inline wrap no-memory" aria-label="Sections">
    <button role="tab" type="button" aria-selected="true" focusgroupstart>Overview</button>
    <button role="tab" type="button" aria-selected="false">Features</button>
    <button role="tab" type="button" aria-selected="false">Pricing</button>
    <button role="tab" type="button" aria-selected="false">FAQ</button>
</div>
<div role="tabpanel">...</div>
```
- Demonstrate `inline wrap no-memory`
- `no-memory` ensures focus returns to the *selected* tab (via `focusgroupstart` or `tabindex="0"`), not the last-focused tab
- Wrapping: Right arrow from last tab goes back to first
- Include working tab panel switching (minimal JS for showing/hiding panels)

#### 3b. Vertical Tablist
```html
<div role="tablist" focusgroup="tablist block wrap no-memory" aria-orientation="vertical" aria-label="Settings">
    <button role="tab" type="button" aria-selected="true">General</button>
    <button role="tab" type="button" aria-selected="false">Privacy</button>
    <button role="tab" type="button" aria-selected="false">Advanced</button>
</div>
```
- Same concept but with `block` axis

**Important note:** Include JS for tab panel switching and `aria-selected` management since `focusgroup` handles navigation only, not selection state.

---

### 4. `menu.html` — Menu & Menubar Pattern

**Purpose:** Demonstrate menus, menubars, and nested submenus.

**Demos to include:**

#### 4a. Simple Vertical Menu
```html
<div focusgroup="menu block" aria-label="File actions">
    <div role="menuitem" tabindex="0">New</div>
    <div role="menuitem" tabindex="0">Open…</div>
    <div role="menuitem" tabindex="0">Save</div>
    <div role="menuitem" tabindex="0">Exit</div>
</div>
```

#### 4b. Menubar with Popover Submenus
Based on the Open UI explainer's menubar example:
```html
<ul role="menubar" focusgroup="menubar inline wrap" aria-label="Application Menu">
    <li role="none">
        <button role="menuitem" popovertarget="filemenu" tabindex="-1">File</button>
        <ul role="menu" focusgroup="menu block wrap" id="filemenu" popover autofocus>
            <li role="none"><a role="menuitem" href="#" tabindex="-1">New</a></li>
            <li role="none"><a role="menuitem" href="#" tabindex="-1">Open</a></li>
            <li role="none"><a role="menuitem" href="#" tabindex="-1">Save</a></li>
        </ul>
    </li>
    <li role="none">
        <button role="menuitem" popovertarget="editmenu" tabindex="-1">Edit</button>
        <ul role="menu" focusgroup="menu block wrap" id="editmenu" popover autofocus>
            <li role="none"><a role="menuitem" href="#" tabindex="-1">Cut</a></li>
            <li role="none"><a role="menuitem" href="#" tabindex="-1">Copy</a></li>
            <li role="none"><a role="menuitem" href="#" tabindex="-1">Paste</a></li>
        </ul>
    </li>
</ul>
```
- Show `inline` on menubar (Left/Right) and `block` on menus (Up/Down)
- Use `popover` + `autofocus` for submenu display
- Explain how nested focusgroups are independent scopes

**Key teaching point:** The orthogonal axis (Up/Down on menubar) is free for authors to use for opening/closing menus via JS.

---

### 5. `radiogroup.html` — Radio Group Pattern

**Purpose:** Show focusgroup as a replacement for native radio button group arrow-key behavior.

**Demos to include:**

#### 5a. Custom Radio Group
```html
<div role="radiogroup" focusgroup="radiogroup inline" aria-label="Text alignment">
    <span role="radio" aria-checked="true" tabindex="-1" class="radio-option">Left</span>
    <span role="radio" aria-checked="false" tabindex="-1" class="radio-option">Center</span>
    <span role="radio" aria-checked="false" tabindex="-1" class="radio-option">Right</span>
    <span role="radio" aria-checked="false" tabindex="-1" class="radio-option">Justify</span>
</div>
```
- Include JS to manage `aria-checked` state on focus change or click
- Explain that `focusgroup` handles navigation only — selection must be managed by author code
- Compare with native `<input type="radio">` behavior

#### 5b. Visual Comparison: Native vs. Focusgroup
Show a side-by-side of native `<input type="radio">` and the custom `focusgroup` version, demonstrating identical arrow-key behavior.

---

### 6. `listbox.html` — Listbox Pattern

**Purpose:** Demonstrate selectable list navigation.

```html
<div role="listbox" focusgroup="listbox block" aria-label="Favorite fruit">
    <div role="option" tabindex="0" aria-selected="true">Apple</div>
    <div role="option" tabindex="0" aria-selected="false">Banana</div>
    <div role="option" tabindex="0" aria-selected="false">Cherry</div>
    <div role="option" tabindex="0" aria-selected="false">Date</div>
    <div role="option" tabindex="0" aria-selected="false">Elderberry</div>
</div>
```
- Up/Down arrow navigation
- Include JS for selection state management
- Home/End key support (built into focusgroup)

---

### 7. `accordion.html` — Accordion Pattern

**Purpose:** Demonstrate `block` axis navigation with `focusgroup="none"` opt-out for panel content.

```html
<div focusgroup="block">
    <h3><button type="button" aria-expanded="true" aria-controls="panel1">Section 1</button></h3>
    <div focusgroup="none" role="region" id="panel1">
        <p>Panel content with <a href="#">links</a> and <input type="text" placeholder="inputs">
        that remain tabbable but are skipped by arrow keys.</p>
    </div>
    <h3><button type="button" aria-expanded="false" aria-controls="panel2">Section 2</button></h3>
    <div focusgroup="none" role="region" id="panel2" hidden>
        <p>More panel content...</p>
    </div>
    <h3><button type="button" aria-expanded="false" aria-controls="panel3">Section 3</button></h3>
    <div focusgroup="none" role="region" id="panel3" hidden>
        <p>Even more content...</p>
    </div>
</div>
```

**Key teaching points:**
- `focusgroup="none"` opts out content from arrow navigation while keeping it in tab order
- Up/Down arrows move only between accordion headers
- Tab still reaches focusable content within expanded panels
- Include JS for toggling `aria-expanded` and `hidden` attributes

---

### 8. `grid.html` — Grid Navigation

**Purpose:** Demonstrate 2D grid navigation with `focusgroup="grid"`.

**Demos to include:**

#### 8a. Simple Grid (Tic-Tac-Toe)
```html
<table role="grid" focusgroup="grid" aria-label="Tic Tac Toe">
    <tr>
        <td tabindex="-1"></td>
        <td tabindex="-1"></td>
        <td tabindex="-1"></td>
    </tr>
    <tr>
        <td tabindex="-1"></td>
        <td tabindex="-1"></td>
        <td tabindex="-1"></td>
    </tr>
    <tr>
        <td tabindex="-1"></td>
        <td tabindex="-1"></td>
        <td tabindex="-1"></td>
    </tr>
</table>
```
- Arrow keys navigate between cells in 2D
- Home/End for row start/end

#### 8b. Data Grid
Based on the explainer's data grid example:
```html
<table role="grid" focusgroup="grid" aria-label="Transactions">
    <thead>
        <tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th>Balance</th></tr>
    </thead>
    <tbody>
        <tr>
            <td tabindex="-1">01-Jan-24</td>
            <td tabindex="-1">Deposit</td>
            <td><a tabindex="-1" href="#">Cash Deposit</a></td>
            <td tabindex="-1">$1,000.00</td>
            <td tabindex="-1">$1,000.00</td>
        </tr>
        <!-- more rows -->
    </tbody>
</table>
```
- Show that `<th>` without `tabindex` are not navigable
- Demonstrate grid wrapping options: `focusgroup="grid wrap"`, `focusgroup="grid flow"`, `focusgroup="grid row-wrap"`, etc.

#### 8c. Grid Wrapping Modes Comparison
Show a small grid with toggleable wrapping modes so users can experience the differences between `wrap`, `flow`, `row-wrap`, `col-wrap`, `row-flow`, `col-flow`.

---

### 9. `advanced.html` — Advanced Patterns

**Purpose:** Cover edge cases and advanced usage.

**Demos to include:**

#### 9a. Nested Focusgroups
```html
<div focusgroup="toolbar inline" aria-label="Main toolbar">
    <button type="button">Save</button>
    <button type="button" focusgroupstart>Print</button>
    <div focusgroup="toolbar inline wrap" aria-label="Text formatting" class="nested-toolbar">
        <button type="button">Bold</button>
        <button type="button">Italic</button>
        <button type="button">Underline</button>
    </div>
    <button type="button">Close</button>
    <button type="button">Exit</button>
</div>
```
- Nested focusgroup is an independent scope
- Tab moves between focusgroups; arrows navigate within
- Each group has its own memory and entry point

#### 9b. Opt-out Segments with `focusgroup="none"`
```html
<div focusgroup="toolbar inline" aria-label="Segmented toolbar">
    <button type="button">New</button>
    <button type="button">Open</button>
    <button type="button">Save</button>
    <span focusgroup="none">
        <button type="button">Help</button>
        <button type="button">Shortcuts</button>
    </span>
    <button type="button">Close</button>
    <button type="button">Exit</button>
</div>
```
- Arrow keys skip the opted-out "Help" and "Shortcuts" buttons
- Tab still stops at those buttons

#### 9c. Deep Descendant Discovery
```html
<div focusgroup="toolbar inline" aria-label="Nested wrappers">
    <div>
        <span><button type="button">Alpha</button></span>
        <span><button type="button">Beta</button></span>
        <span><button type="button">Gamma</button></span>
    </div>
</div>
```
- Show that focusgroup items don't need to be direct children

#### 9d. CSS `reading-flow` Integration
```html
<div focusgroup="toolbar" aria-label="Visual order" style="display: flex; flex-direction: row-reverse; reading-flow: flex-visual;">
    <button type="button">A</button>
    <button type="button">B</button>
    <button type="button">C</button>
</div>
```
- Arrow navigation follows visual order (C → B → A from left to right) rather than DOM order
- Explain `reading-flow: flex-visual`

#### 9e. Feature Detection
```html
<script>
if ('focusgroup' in HTMLElement.prototype) {
    // focusgroup is supported
} else {
    // Show polyfill notice or fallback
}
</script>
```

---

## Shared `script.js` — Implementation Notes

The shared script should provide:

1. **Feature detection** — Check for `focusgroup` support and show a warning banner if unsupported
2. **Tab panel switching** — For tablist demos, handle `aria-selected`, `hidden` states, and panel visibility. Remember: `focusgroup` handles navigation only, not selection
3. **Radio group selection** — For radiogroup demos, toggle `aria-checked` on click/Enter/Space
4. **Accordion toggling** — For accordion demos, toggle `aria-expanded` and `hidden`
5. **Source code display** — Optionally, each demo could have a "View Source" toggle showing the relevant HTML

Keep JavaScript minimal. The whole point of `focusgroup` is that it *replaces* JavaScript-heavy focus management. JS should only be used for state management (selection, expansion) that `focusgroup` intentionally does not handle.

---

## Shared `style.css` — Design Guidelines

### Base Styles
- Start from `/template/style.css` (box-sizing, font smoothing, Segoe UI font stack)
- Add CSS custom properties for theming (support light/dark modes)

### Focus Ring
- Use a highly visible focus indicator so users can clearly see focus movement:
  ```css
  :focus {
      outline: 2px solid var(--focus-color, #f59e0b);
      outline-offset: 2px;
  }
  ```

### Demo Container
- Each demo example should be visually contained in a card/panel
- Show the `focusgroup` attribute value used in a code label above or beside each demo
- Keep adequate spacing between demos

### Interactive Elements
- Style buttons, radio options, list items, and menu items to look like realistic UI controls
- Hover, focus, and active states should all be visible
- Selected/checked states should be visually distinct

### Responsive
- Use flexbox for layouts
- Stack sidebar/nav vertically on small screens
- Ensure demo widgets remain usable on mobile (though `focusgroup` is keyboard-centric)

---

## Testing Checklist

After creating the demos, verify:

- [ ] Every demo page loads without errors
- [ ] Feature detection banner appears when `focusgroup` is unsupported
- [ ] All `focusgroup` attribute values are set correctly
- [ ] Arrow-key navigation works as described in each demo
- [ ] Tab enters and exits focusgroups correctly (single tab stop behavior)
- [ ] `focusgroupstart` controls the entry point correctly
- [ ] Focus memory works (navigate to a non-default item, Tab away, Tab back)
- [ ] `no-memory` works (always returns to entry point)
- [ ] Wrapping works at boundaries
- [ ] Axis locking works (inline ignores Up/Down, block ignores Left/Right)
- [ ] `focusgroup="none"` correctly opts out elements from arrow navigation while keeping them tabbable
- [ ] Nested focusgroups are independent
- [ ] Grid navigation works in 2D
- [ ] All ARIA attributes are correct (`role`, `aria-label`, `aria-selected`, `aria-checked`, `aria-expanded`, `aria-controls`)
- [ ] The focus ring is clearly visible in both light and dark modes
- [ ] Pages are responsive and look good on mobile
- [ ] Source code snippets in `<pre><code>` blocks match the actual demo markup
- [ ] README links all resolve correctly
- [ ] Top-level README row is added

---

## Attribute Value Reference

Quick reference for `focusgroup` HTML attribute tokens:

| Token | Description |
|---|---|
| *(empty/default)* | Linear focusgroup, all arrow keys, no wrap, with memory |
| `toolbar` | Toolbar behavior pattern |
| `tablist` | Tablist behavior pattern (children may infer `role="tab"`) |
| `menu` | Menu behavior pattern (children may infer `role="menuitem"`) |
| `menubar` | Menubar behavior pattern |
| `radiogroup` | Radio group behavior pattern (children may infer `role="radio"`) |
| `listbox` | Listbox behavior pattern (children may infer `role="option"`) |
| `inline` | Restrict to inline-axis arrows only (Left/Right in horizontal writing modes) |
| `block` | Restrict to block-axis arrows only (Up/Down in horizontal writing modes) |
| `wrap` | Enable wrap-around at boundaries |
| `no-memory` | Don't remember last-focused element on re-entry |
| `none` | Opt out of ancestor focusgroup participation |
| `grid` | Automatic grid focusgroup (for `<table>` structures) |
| `manual-grid` | Manual grid focusgroup |
| `grid-row` | Mark element as grid row (for manual grids) |
| `grid-cell` | Mark element as grid cell (for manual grids) |
| `flow` | Grid: movement past row/column end flows to next row/column |
| `row-wrap` / `col-wrap` | Grid: wrap within rows/columns individually |
| `row-flow` / `col-flow` | Grid: flow within rows/columns individually |

Related HTML attribute: `focusgroupstart` — placed on a child element to mark it as the entry point.

---

## Notes for Implementer

1. **The focusgroup explainer** (https://open-ui.org/components/scoped-focusgroup.explainer/) is the authoritative reference. It defines behavior tokens like `toolbar`, `tablist`, `menu`, `menubar`, `radiogroup`, `listbox`. **Use this syntax** in all demos.

2. **Test in Edge Canary/Dev** with the appropriate experimental flag enabled. The flag name may vary — check `edge://flags` for "focusgroup" or "experimental web platform features".

3. **Keep demos self-contained** — each HTML file should work independently when opened directly in a browser (no build step required). The repo uses GitHub Pages for deployment.

4. **Emphasize the "no JavaScript needed" story** — the primary value proposition of `focusgroup` is eliminating focus management JS. JavaScript in demos should only handle state changes (selection, expansion) that `focusgroup` explicitly does not manage.

5. **Accessibility first** — all demos should use correct ARIA roles, labels, and states. These are demos of an accessibility feature and should themselves be fully accessible.

---

## Learnings & Corrections from Implementation

The following corrections and refinements were discovered during implementation and review. Future prompt iterations should incorporate these directly.

### Focusgroup Syntax

1. **Behavior token must come first.** The syntax is `focusgroup="<behavior> [modifiers]"`. For example, `focusgroup="toolbar block"` is valid; `focusgroup="block"` alone is **not valid** — a behavior token (`toolbar`, `tablist`, `menu`, `menubar`, `radiogroup`, `listbox`) must precede any axis/wrap/memory modifiers.

2. **Link to the focusgroup explainer** at `https://open-ui.org/components/scoped-focusgroup.explainer/` whenever referencing the specification.

3. **Grid is not yet implemented.** The `grid` behavior token is specified but not implemented in any browser. Do not create a `grid.html` demo page.

### ARIA Role Inference

4. **Focusgroups infer ARIA roles on generic elements.** When a behavior token like `toolbar` is used on a generic element (`<div>` or `<span>`) without an explicit `role`, the UA infers the role from the behavior token. For example, `<div focusgroup="toolbar">` has an inferred `role="toolbar"`. Similarly, child elements may have roles inferred (e.g., children of a `radiogroup` infer `role="radio"`).

5. **Do not add redundant `role` attributes on generic elements.** If the element is generic (`<div>`, `<span>`) and has a `focusgroup` behavior token, omit the `role` — the UA will infer it. Only add explicit `role` when:
   - The element is non-generic (e.g., `<ul>`, `<button>`) and the behavior mapping is skipped
   - You need to **override** the inferred role (e.g., `role="group"` on an accordion to prevent it from being announced as a toolbar)

6. **Override inferred roles when they cause confusion.** An accordion using `focusgroup="toolbar block"` would have an inferred `role="toolbar"`, which confuses screen readers. Add `role="group"` and `aria-label` to override.

### Focusgroup Navigation vs. Application Logic

7. **`focusgroup` does not manage `tabindex`.** The original prompt's examples used `tabindex="-1"` on items with the expectation that focusgroup would handle roving tabindex. In fact, focusgroup collapses all `tabindex="0"` items into a single tab stop natively — no `tabindex` manipulation is needed in JavaScript.

8. **Use `focusgroupstart` instead of managing `tabindex`.** To control which element receives focus on re-entry, set the `focusgroupstart` attribute on the desired entry point element. Move this attribute in JavaScript when the active item changes (e.g., the selected tab).

9. **Selection follows focus is opt-in, not default.** Unlike native `<input type="radio">` where arrow keys both move focus and select, focusgroup decouples navigation from selection. Authors must explicitly add a `focus` event listener to implement selection-follows-focus behavior. This is a feature, not a bug — it gives authors more flexibility.

### Long Content Problem

10. **Focusgroup arrow keys can skip long content.** When focusgroup is used on containers with long content between navigation items (e.g., accordion panels, tab panels), arrow keys jump directly between items, completely skipping the content in between. This is a known consideration in the spec.

11. **Mitigation is context-dependent.** There is no single "correct" mitigation. Options include:
    - Moving focus into the panel on expand (accordion focus-into-panel pattern)
    - Making panels focusable scrollable regions (`tabindex="0"` + `max-height` + `overflow: auto`)
    - Requiring an activation step before navigating away
    - Adding a "skip to next section" link inside panels
    - Not using focusgroup for content-heavy containers
    - Present any mitigation as "a possible approach," not "the solution"

### File Organization

12. **Split JavaScript per page.** Each demo page should have its own JS file (e.g., `accordion.js`, `tablist.js`) so readers can see exactly what JavaScript is needed for each pattern. Common utilities (feature detection, `initSingleSelect` helper) belong in a shared `shared.js` that is loaded by all pages.

13. **Pages with no application logic need only the shared script.** Toolbar, menu, and additional-concepts pages have no interactive state to manage — focusgroup handles everything. These pages only need `shared.js` for the feature detection banner.

### Naming & Structure

14. **Rename "Advanced Patterns" to "Additional Concepts"** and the file from `advanced.html` to `additional-concepts.html`. "Advanced" implies difficulty; these are supplementary concepts (nesting, opt-out, deep descendants, reading-flow, feature detection).

15. **Use `about://flags` instead of `edge://flags`.** The `about://flags` URL works in all Chromium-based browsers, not just Edge. Pair with the instruction "use Microsoft Edge or another Chromium-based browser."

### CSS & Visual Design

16. **Differentiate focus rings inside vs. outside focusgroups.** Use CSS attribute selectors to show a distinct focus ring color for elements managed by a focusgroup vs. those outside (or in opted-out subtrees):
    ```css
    /* Default: unmanaged */
    :focus { outline-color: var(--focus-color-unmanaged); }

    /* Inside an active focusgroup */
    [focusgroup]:not([focusgroup="none"]) :focus {
        outline-color: var(--focus-color-managed);
    }
    ```
    This visually communicates which elements are part of a focusgroup.

17. **Explore-the-demos card grid must be single column.** Focusgroup does not yet support 2D navigation (grid is unimplemented), so placing cards in multiple columns creates confusing arrow-key behavior. Use `grid-template-columns: 1fr` and `focusgroup="toolbar"` (no `wrap`).

18. **Show focus rings on click for demo pages.** Normally, `:focus:not(:focus-visible)` hides focus rings on mouse click. For these demos, always show focus rings since the pages are specifically about keyboard focus behavior. Either remove the `:focus:not(:focus-visible) { outline: none }` rule or add component-specific `:focus` overrides.

19. **Accordion focus outline clipping.** If the accordion container uses `overflow: hidden`, focus outlines on first/last items get clipped. Remove `overflow: hidden` and use explicit `border-radius` on the first/last buttons instead.

### Radio Group Demo

20. **Single comparison view.** Rather than separate "custom radio group" and "comparison" demos, combine into a single side-by-side comparison (native vs. focusgroup) so readers immediately see the equivalence.

21. **Selection-follows-focus toggle.** Add a checkbox toggle next to the focusgroup radio group (not above both groups) that enables selection-follows-focus mode. Place it clearly within the focusgroup column so readers understand it only affects the focusgroup version. Native radios always have selection-follows-focus.

22. **Use vertical layout for radio comparison.** Display the focusgroup radio group in a column layout to match native radio buttons' vertical appearance, and use `focusgroup="radiogroup"` (no `inline`) so arrow navigation is ↑/↓.

### Updated File Structure

```
focusgroup/
├── README.md
├── index.html                  # Landing page
├── style.css                   # Shared stylesheet
├── shared.js                   # Feature detection + initSingleSelect helper
├── toolbar.html                # Toolbar pattern (no per-page JS needed)
├── tablist.html → tablist.js   # Tablist pattern
├── menu.html                   # Menu & menubar (no per-page JS needed)
├── radiogroup.html → radiogroup.js  # Radio group pattern
├── listbox.html → listbox.js   # Listbox pattern
├── accordion.html → accordion.js   # Accordion pattern
└── additional-concepts.html    # Nesting, opt-out, deep descendants, reading-flow, feature detection (no per-page JS needed)
```
