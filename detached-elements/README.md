# Investigating memory leaks from detached DOM elements

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/detached-elements/)** ⬅️

The Detached DOM Elements demo is a simple webpage that demonstrates the **Memory** tool's **Detached elements** profiling type.  The **Detached elements** profiling type in Microsoft Edge DevTools helps investigate common DOM memory leaks in long-running web applications.

The demo webpage shows a simulated chat application.  The app has three chat rooms that you can select among.  Within each chat room, you can simulate messages appearing one-by-one; as a slow continuous flow; or as a fast continuous flow.

For instructions, see:
* [Debug DOM memory leaks ("Detached elements" profiling type)](https://learn.microsoft.com/microsoft-edge/devtools/memory-problems/dom-leaks-memory-tool-detached-elements).
* [Debug memory leaks with the Microsoft Edge Detached Elements tool](https://blogs.windows.com/msedgedev/2021/12/09/debug-memory-leaks-detached-elements-tool-devtools/) - Announcement blog post.
* [Debug DOM node memory leaks with the new Detached Elements tool](https://learn.microsoft.com/microsoft-edge/devtools/whats-new/2021/07/devtools#debug-dom-node-memory-leaks-with-the-new-detached-elements-tool) in _What's New in DevTools (Microsoft Edge 93)_.

Regarding the last two articles, the **Detached Elements** tool has been removed.  To debug DOM memory leaks, use the **Detached elements** profiling type in the **Memory** tool.


<!-- ====================================================================== -->
## Potential leaks

The app has two potential leaks that the **Memory** tool's **Detached elements** profiling type can help detect:

* Each room manages a cache of message DOM nodes.

  To avoid having too many messages and slowing down the page and having a giant scrollbar, the room removes old messages from the DOM and puts them into a cache array so they can be reused as template DOM elements later when new messages need to be created.

  The problem is that message cleanup and creation aren't in sync, they are scheduled differently and there's a race between the 2. So it is easy to get in a situation where the cache contains far many more messages than need to be reused.

* When switching from a room to the next, the app unmounts the old room from the DOM but keeps all visible messages in an array so they can quickly be added again later.

  This is by design and not necessarily a problem, but if certain messages contain a lot of information, and if there are many rooms, and many messages, this could lead to high memory usage. So this is a balance between fast room switching and memory usage.

The above aren't necessarily problems. The author decided to keep a reference to these DOM nodes on purpose. It's also not likely to be a problem for short time frames. Furthermore, after you close the app, the browser will free the memory again.

However, if the app is used for days without ever being closed, these leaks can lead to higher amounts of RAM being used by the app, therefore slowing down the system.
