# Investigating detached DOM elements memory leaks

* [Live demo](https://microsoftedge.github.io/Demos/detached-elements/)
* [DevTools What's New](https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/whats-new/2021/07/devtools#debug-dom-node-memory-leaks-with-the-new-detached-elements-tool) announcement.
* Article - To be added.

Microsoft Edge DevTools added a new panel called __Detached Elements__. This panel helps investigate common DOM memory leaks in long running web applications.

This repo contains a simple web page aimed at demonstrating the Detached Elements panel.

The page shows a fake chat application. The app has 3 rooms which you can select. Within each room you can simulate messages by either sending just one, or using slow or fast message modes.

The app has two potential leaks that the Detached Elements panel can help detect:

* Each room manages a cache of message DOM nodes.

  To avoid having too many messages and slowing down the page and having a giant scrollbar, the room removes old messages from the DOM and puts them into a cache array so they can be reused as template DOM elements later when new messages need to be created.

  The problem is that message cleanup and creation aren't in sync, they are scheduled differently and there's a race between the 2. So it is easy to get in a situation where the cache contains far many more messages than need to be reused.

* When switching from a room to the next, the app unmounts the old room from the DOM but keeps all visible messages in an array so they can quickly be added again later.

  This is by design and not necessarily a problem, but if certain messages contain a lot of information, and if there are many rooms, and many messages, this could lead to high memory usage. So this is a balance between fast room switching and memory usage.

The above aren't necessarily problems. The author decided to keep a reference to these DOM nodes on purpose. It's also not likely to be a problem for short time frames. Furthermore, after you close the app, the browser will free the memory again.

However, if the app is used for days without ever being closed, these leaks can lead to higher amounts of RAM being used by the app, therefore slowing down the system.
