# CSS Custom Highlight highlightsFromPoint() API demo

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/custom-highlight-api/highlightsFromPoint)** ⬅️

The [Custom Highlight API](https://www.w3.org/TR/css-highlight-api-1/) provides a programmatic way of adding and removing highlights that do not affect the underlying DOM structure, but instead applies styles to text based on range objects, accessed via the `::highlight()` pseudo element.

The [`highlightsFromPoint(x, y, options)`](https://drafts.csswg.org/css-highlight-api-1/#dom-highlightregistry-highlightsfrompoint) method allows developers to build scenarios involving user interaction with custom highlights. It returns an array of objects representing the custom highlights applied at a specific point within the viewport.
