# Heap snapshot visualizer
<!--
tab-title: __
top-of-page title: __
-->

This demo is a DevTools extension to show a visualization of the contents of a `*.heapsnapshot` file.

_* This extension is under development_


<!-- ====================================================================== -->
## What is a heap snapshot file?

The DevTools **Memory** tool produces a `*.heapsnapshot` file.  For information about the schema of the file, see [The heap snapshot file format](https://learn.microsoft.com/microsoft-edge/devtools/memory-problems/heap-snapshot-schema).


<!-- ====================================================================== -->
## What kind of visualization?

* A force directed graph.
* A tree.


<!-- ====================================================================== -->
## What can I do with it?

* Filter nodes.
* Explore the memory structure starting from GC retainers.
* Isolate the retainer chain for a single node using its object ID.


<!-- ====================================================================== -->
## Dependencies

This extension uses React and D3.


<!-- ====================================================================== -->
## How to Install and Build

This is a project that uses Typescript and React.  To get the outputs that are needed for the extension, build the demo as follows:

`npm install`

`npm run build`


<!-- ====================================================================== -->
## Load

1. Open Microsoft Edge.
1. Go to `edge://extensions`.
1. Enable Developer Mode.
1. Click "Load unpacked" and select the `build` folder.
1. Go to a webpage, and then open DevTools.
1. Find the **Heap Snapshot Visualizer** tab.


<!-- ====================================================================== -->
<!-- ## This is how it looks -->

<!-- ![](./extension.png) todo -->
