# WEBAMP app demo

This is a web audio player demo application. It is meant to be a PWA that's great to use on a desktop/laptop computer.

## User guide

* Open the app: https://microsoftedge.github.io/Demos/webamp/
* Drag and drop audio files from your explorer onto the playlist area (or hit the `+` button).

## Making a new skin

A skin is a CSS file that gets applied to the app, replacing the default CSS.

The best way to make a new skin is to open DevTools and look at the HTML structure of the page. Most elements should have handy classes and IDs that will make them easy to style.

Note:

* Each song in the playlist is a custom element `<playlist-song>` and you can style its various elements by using the [`::part()` pseudo-element](https://developer.mozilla.org/docs/Web/CSS/::part). For example: `playlist-song::part(title)` can be used to style the song title.
* Skins are expected to have a `:root {}` rule with at least one variable called `--back` set to the color of the background. This will be used at runtime, in JavaScript, by the app to apply the color to the visualizer and the title bar area.

## TODO

* Use input[type=file] instead of File System Access to make it work everywhere.
* Add the ability to drag/drop songs in the playlist to re-order them.
* Make use of PWA features to make it a great desktop experience:
  * Shortcuts (caveat: shortcuts launch a new instance, and can't autoplay music since this requires user interaction, so not sure what to use this for).
  * Sharing and share target.
  * Protocol handler to add new songs via remote URLs.
* Submit to the store.
* Ability to export as another file format.
* Use viewport segments to display on dual screen devices.
* Add repeat and shuffle buttons.
* Add keyboard shortcuts to play/pause/prev/next/visualize/...
* Default skin needs to better handle very wide windows, make use of all the empty space.
