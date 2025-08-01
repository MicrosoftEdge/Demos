# Protocol handling demo - Email client

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/email-client/)** ⬅️

This is an email client installable app (which doesn't actually send and receive emails) that demonstrates the PWA protocol handling feature.


<!-- ====================================================================== -->
## About the demo app

The demo app shows a list of received emails, and a compose button that displays a panel to compose a new email when clicked.

The app can be installed on the device, and upon installation will register a protocol handler for `mailto`.

When a `mailto` link is used, the operating system should propose the installed demo app as a choice to the user to handle that link.  If the user chooses this demo app, it will be launched, and the compose panel will appear, pre-filled with the email address.

The two interesting pieces of code here are:

* The `protocol_handlers` member in the [manifest](https://github.com/MicrosoftEdge/Demos/blob/main/email-client/manifest.json).

* The way protocol handling requests are detected and used in [script.js](https://github.com/MicrosoftEdge/Demos/blob/main/email-client/script.js).


<!-- ====================================================================== -->
## How to use the demo

1. [Open the app](https://microsoftedge.github.io/Demos/email-client/).

1. In the Address bar, click the **App available. Install Email inbox** (![App available icon](./img/app-available-icon.png)) button.

   The app is installed.

1. [Open the demo.html page](https://microsoftedge.github.io/Demos/email-client/demo.html).

1. Click the `mailto` link on that page.
