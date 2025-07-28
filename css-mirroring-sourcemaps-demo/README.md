# Demo app to test sourcemap support of the VS Code Edge DevTools extension
<!--
tab-title: __
top-of-page title: __
-->

This is a basic app to test the sourcemap support for CSS mirroring in [the Edge DevTools extension for Visual studio code](https://aka.ms/devtools-for-code).

![screenshot of the app inside VS code](sourcemaps-demo.png)

To run the app and test the functionality follow these steps:

1. Make sure you have the Microsoft Edge DevTools for Visual Studio Code extension installed.
1. Clone this "MicrosoftEdge / Demos" repo.  Or, [download the zip](demo.zip) of this sourcemap demo app, and then unpack the `.zip` file.
1. Open the `/Demos/css-mirroring-sourcemaps-demo/` folder in Visual Studio Code.
1. Run `npm i` in the Terminal.
1. Run `npm start` in the Terminal.
1. Switch VS Code to "Run and Debug", and run "Launch Edge and Attach DevTools".  (The project is configured to use [Edge Canary](https://www.microsoftedgeinsider.com/download/canary), so make sure you have Edge Canary installed.)
1. Start editing Styles in DevTools and watch them sync!

We have an [issue open in the Extension repository](https://github.com/microsoft/vscode-edge-devtools/issues/965) and we'd love to get your feedback there!
