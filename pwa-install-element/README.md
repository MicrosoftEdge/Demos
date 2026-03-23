# Install element demos - `<install>`

This directory contains demos that showcase the use of the [install element](https://aka.ms/InstallElement), a new HTML element under development by the Microsoft Edge team to allow web contents to declaratively install other web apps. The element is currently supported on Windows, MacOS, Linux, and ChromeOS.

## Demos

* ➡️ **[The `<install>` Element Store](https://liahiscock.github.io/PWA/WebInstall/element-store.html)** ⬅️

## How to use the `<install>` element

### Detect support

```javascrit
if ('HTMLInstallElement' in window) {
  // The <install> element is supported.
} else {
  // The <install> element is not supported.
}
```

### Install the current document

To install the currently loaded document:

* The document must link to a manifest file.
* The manifest file must have an `id` field defined.

```javascript
<install id="install-button"></install>
```
### Install another document

To install a document that's not the current document, also known as a _background_ document, use either the `installurl` attribute, or both the `installurl` and `manifestid` attributes together:

To use the `installurl` attribute:

* The document at `installurl` must link to a manifest file.
* The manifest file must have an `id` field defined.

```javascript
<install installurl="https://foo.com" id="install-button"></install>
```

To use the `installurl` and `manifestid` attributes together:

* The document at  `installurl` must link to a manifest file.
* The value of the `manifestid` attribute must match the computed id after parsing the manifest.

You can find the computed ID by going to **Application** > **Manifest** > **Identity** > **Computed App ID** in Microsoft Edge DevTools.

```javascript
<install installurl="https://foo.com" manifestid="https://foo.com/someid" id="install-button"></install>
```

### Handle installation success and errors

To handle the result of the web app installation process, use the `promptaction`, `promptdismiss`, and `validationstatuschanged` events:

```javascript
if ('HTMLInstallElement' in window) {
  const button = document.getElementById('install-button');

  // Listen to the promptaction event to know if the installation succeeded.
  button.addEventListener('promptaction', (event) => {
    console.log(`Install succeeded`);
  });

  // Listen to the promptdismiss event to know if the installation failed.
  button.addEventListener('promptdismiss', (event) => {
    console.log(`Install failed`);
  });

  // Listen to the validationstatuschanged event to detect invalid installation data.
  button.addEventListener('validationstatuschanged', (event) => {
    if (event.target.invalidReason === 'install_data_invalid') {
      console.log(event.target.invalidReason);
    }
  });
} else {
  console.warn('HTMLInstallElement not supported');
}
```

## Test the feature locally

The install element can be tested via a command line flag, which is available in Chromium-based browsers (such as Microsoft Edge) starting with **version 148**.

1. In the browser, open a new tab and go to `about://flags/#web-app-install-element`.
2. Set the Web App Install Element flag to **Enabled**.
3. Click the **Restart** button in the bottom right. The browser restarts.

<!--
## Test the feature in production with origin trials

The install element is currently available as an [Origin Trial](https://learn.microsoft.com/microsoft-edge/origin-trials/) in Microsoft Edge and Chrome versions 148 to 153. This allows you to use the feature on your production site and provide valuable feedback to browser vendors before it's finalized.

To use the install element on your production site, participate in the origin trial:

1. **Register for the origin trial:** [Install element registration page link](https://developer.chrome.com/origintrials/#/view_trial/XXXXXXXXXX)
2. **Add the origin trial token:** Once you have the origin trial registration token, add the token to your pages by using a `<meta>` tag or an HTTP header. To learn more, see [Using the origin trial token at your website](https://learn.microsoft.com/microsoft-edge/origin-trials/#using-the-origin-trial-token-at-your-website).

```html
<meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE">
```
-->

## Provide feedback

Your feedback is crucial to the development of this feature. Please share feedback to:

* Report any issue you encountered.
* Share improvement suggestions.
* Share how you're using the `<install>` element.

To share feedback, [open a new issue on the WICG/install-element repo](https://github.com/WICG/install-element/issues/new?template=install-element-ot-feedback.md)

We look forward to hearing from you!

## See also

* [Explainer](https://aka.ms/InstallElement)
* [Chrome Platform Status Entry](https://chromestatus.com/feature/5152834368700416)
* [Test experimental APIs and features by using origin trials](https://learn.microsoft.com/microsoft-edge/origin-trials/#using-the-origin-trial-token-at-your-website)

