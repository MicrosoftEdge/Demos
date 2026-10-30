# Local-only URL schemes

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/local-plus-protocol/)** ⬅️

The `local+` prefix lets supporting browsers block websites from launching a desktop app's URL scheme while allowing native app-to-app calls through the OS. This demo compares an ordinary protocol link with a `local+` link. No app installation needed. See [Chris Guzak's initial explainer](https://github.com/ChrisGuzak/UriLaunchingSaftey).

Use Microsoft Edge Canary or Chrome Canary on Windows or macOS. The feature is disabled by default. Fully quit the browser, including background processes, then launch it with `--enable-features=LocalOnlyAppProtocolPrefix`. The [browser setup section](https://microsoftedge.github.io/Demos/local-plus-protocol/#browser-setup) has the full commands for each browser and platform.

To change the page, edit [index.html](index.html). No build step is required.
