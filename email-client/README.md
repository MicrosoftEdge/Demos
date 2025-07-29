# Protocol handling demo - Email client

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/email-client/)** ⬅️

This is an email client installable app (which doesn't actually send and receive emails) meant to demonstrate the PWA protocol handling feature.

## App

The demo shows a list of received emails, and a compose button that displays a panel to compose a new email when clicked.

The app can be installed on the device, and upon installation will register a protocol handler for `mailto`.

When a `mailto` link is used, the operating system should propose the installed demo app as a choice to the user to handle that link. If the user chooses this demo app, it will be launched, and the compose panel will appear, pre-filled with the email address.

The 2 interesting pieces of code here are:

* The `protocol_handlers` member in the [manifest](https://github.com/MicrosoftEdge/Demos/blob/main/email-client/manifest.json).
* The way protocol handling requests are detected and used in [script.js](https://github.com/MicrosoftEdge/Demos/blob/main/email-client/script.js).

## How to test

* [Open the app](https://microsoftedge.github.io/Demos/email-client/).
* Install the app using the **App available** button in the URL bar.
* [Open the demo page](https://microsoftedge.github.io/Demos/email-client/demo.html)
* Click the `mailto` link on that page.
