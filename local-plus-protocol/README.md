# Local-only URL schemes

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/local-plus-protocol/)** ⬅️

The `local+` prefix lets supporting browsers block websites from launching a desktop app's URL scheme while allowing native app-to-app calls through the OS. This demo compares an ordinary protocol link with a `local+` link and shows the difference in DevTools Console. You don't need to install or register a protocol handler.

## Requirements

Use a recent Microsoft Edge Canary or Chrome Canary on Windows or macOS. The feature is experimental and disabled by default.

Fully quit the browser, including background processes, then launch it with `--enable-features=LocalOnlyAppProtocolPrefix`. If the browser is already running, the command may open a window without enabling the feature.

For Microsoft Edge Canary on Windows, run this in PowerShell:

```powershell
& "$env:LOCALAPPDATA\Microsoft\Edge SxS\Application\msedge.exe" --enable-features=LocalOnlyAppProtocolPrefix
```

For Microsoft Edge Canary on macOS, run this in Terminal:

```sh
open -a "Microsoft Edge Canary" --args --enable-features=LocalOnlyAppProtocolPrefix
```

These commands assume the usual installation location and use your existing Canary profile. They don't install anything. The demo's [browser setup section](https://microsoftedge.github.io/Demos/local-plus-protocol/#browser-setup) also includes Chrome Canary commands.

## Use the demo

1. Open the [demo](https://microsoftedge.github.io/Demos/local-plus-protocol/) in the browser you launched with the flag.
2. Open DevTools Console with **Ctrl+Shift+J** on Windows or **Command+Option+J** on macOS. Show both Info and Error messages.
3. Click **Try ordinary protocol**. With no handler registered for `toydemo:`, the browser reports that the scheme has no registered handler.
4. Click **Try local-only protocol**. The browser blocks the link before looking for a handler and reports `Not allowed to launch 'local+toydemo:hello'.`

The page's "Searching for..." message only records the click. Read the browser's message below it for the result. The page includes an example screenshot.

If you already have a handler registered for a demo URL, the browser may prompt to open it. Cancel if you don't want to launch it. On managed devices, administrator policies may allow website launches even with the feature enabled.

To compare with the feature off, quit the browser and relaunch with `--disable-features=LocalOnlyAppProtocolPrefix` instead. Both links should then follow normal external-protocol handling, unless another browser rule or policy blocks them.

## Scope

This demo shows website launch blocking, not a successful app launch. Testing app-to-app calls requires registering a handler in a native app. The page has adoption steps and explains how browser-originated launches and administrator exceptions differ.

This is a browser restriction, not OS access control. Apps still need to validate incoming URLs.

The Windows registry approach is separate work for existing schemes that can't be renamed. It isn't demonstrated here.

## Working on the demo

To change the page, edit [index.html](index.html). No build step is required.

Keep [the console screenshot](assets/protocol-console-example.png) in the `assets` directory alongside the page. The HTML, CSS and JavaScript are self-contained; no packages or backend service are needed.

## Learn more and provide feedback

- [Initial explainer by Chris Guzak](https://github.com/ChrisGuzak/UriLaunchingSaftey)
- [Chromium issue: local+ prefix](https://issues.chromium.org/issues/539667062)
- [Chromium issue: Windows registry support](https://issues.chromium.org/issues/539654408)
