# EyeDropper API demos

These demos showcase the JavaScript [EyeDropper API](https://wicg.github.io/eyedropper-api/).  The EyeDropper API enables app authors to use a browser-supplied eyedropper in the construction of custom color pickers.

The EyeDropper API provides access to a browser-supplied eyedropper, to enable app developers to implement an eyedropper, a tool that allows users to select a color from the pixels on their screen, including the pixels rendered outside of the web page that's requesting the color data.

The EyeDropper API is implemented in Chromium browsers, such as Microsoft Edge 95 or later.


## Why this API?

Sampling colors from your screen is a useful feature in creative applications.  For example:
* In Microsoft PowerPoint, you can change the color of a shape by sampling from other shapes.
* In Microsoft DevTools, when editing color properties in the **Styles** tab of the **Elements** tool, you can sample the color of a page element in a rendered webpage.

Without the EyeDropper API, web applications can't do this. Some browsers do support it, if you use an `<input type=color>` element, but that means you have to use the input element for something that you might want to do in JavaScript only and customize to your needs.  The EyeDropper API fills that gap.


## The demos

* [Color game](https://MicrosoftEdge.github.io/Demos/eyedropper/color-game.html): Click **Play** and then find the matching color from the list at the bottom, before the time runs out.
* [Photo color swap](https://MicrosoftEdge.github.io/Demos/eyedropper/photo-color-swap.html): Load a picture, select a color from it, and then select a second color to replace it with.
* [Mondrian generator](https://MicrosoftEdge.github.io/Demos/eyedropper/mondrian.html): Generate random Mondrian-like color grids, and click any tile in the grid to swap its color.
