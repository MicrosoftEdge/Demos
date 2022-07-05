# WEBAMP app demo

This is a web audio player demo application. It is meant to be a PWA that's great to use on a desktop/laptop computer.

## User guide

* Open the app: https://microsoftedge.github.io/Demos/webamp/
* Drag and drop audio files from your explorer onto the playlist area (or hit the `+` button).

## TODO

* Use input[type=file] instead of File System Access to make it work everywhere.
* Add the ability to drag/drop songs in the playlist to re-order them.
* Make use of PWA features to make it a great desktop experience:
  * Shortcuts (caveat: shortcuts launch a new instance, and can't autoplay music since this requires user interaction).
  * Sharing and share target.
  * File handler for audio songs and loading custom skins.
  * Protocol handler to add new songs via remote URLs.
* Submit to the store.
* Ability to export as another file format.
* Use viewport segments to display on dual screen devices.
* Add repeat and shuffle buttons.
* Add keyboard shortcuts to play/pause/prev/next/visualize/...
* Default skin needs to better handle very wide windows, make use of all the empty space.
