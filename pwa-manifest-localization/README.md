# PWA manifest localization demo

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/pwa-manifest-localization/)** ⬅️

This demo showcases the use of `_localized` suffixed web app manifest members, which allow Progressive Web Apps (PWAs) to provide localized app metadata (such as name, description, and icons) for different languages directly in the manifest file.

The demo app is localized in English, German, Arabic, and French.

## How to use the demo app

1. In Microsoft Edge, open the [Manifest Localization Test App](https://microsoftedge.github.io/Demos/pwa-manifest-localization/) in a new window or tab.

2. In the address bar, click the **App available** button to install the PWA on your device.

   If your browser is set to English, German, Arabic, or French, the installed PWA displays the name, short name, icon, description, and shortcuts that are defined in the web app manifest file for that language. 

3. In Microsoft Edge, go to `edge://settings/languages`.

4. Under **Preferred languages**, click **...** next to English, German, Arabic, or French, choosing the one which your browser isn't already using.

5. Select **Display Microsoft Edge in this language**.

6. Restart the PWA.

   You are prompted to update the installed PWA to the new localized values.

## Links

- [Specification](https://www.w3.org/TR/appmanifest/#x_localized-members)
- [Chrome Platform Status entry](https://chromestatus.com/feature/5090807862394880?gate=4864426712891392)
