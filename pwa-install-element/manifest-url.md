# Install element demos - `<install>`

## Manifest-URL design

This directory contains demos that showcase the use of the [install element](https://github.com/WICG/install-element/blob/main/explainer-manifest-url.md), a new HTML element under development to allow web contents to declaratively install other web apps. The element is currently supported on Windows, macOS, Linux, and ChromeOS.

## Demos

* [The `<install>` Element Store](https://microsoftedge.github.io/Demos/pwa-install-element/)
* [Web Install Sample](https://kbhlee2121.github.io/pwa/web-install-manifest-url/only-elements.html)

## How to use the `<install>` element

### Detect support

```javascript
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

```html
<install id="install-button"></install>
```

### Install another document

To install a document that's not the current document, also known as a _background_ document, use either the `manifest` attribute, or both the `manifest` and `manifestId` attributes together:

To use the `manifest` attribute:

* The value of `manifest` must be the URL of the web app manifest to install.
* The manifest file must have an `id` field defined.

```html
<install manifest="https://foo.com/manifest.webmanifest" id="install-button"></install>
```

To use the `manifest` and `manifestId` attributes together:

* The value of `manifest` must be the URL of the web app manifest to install.
* The value of the `manifestId` attribute must match the computed ID after parsing the manifest.

You can find the computed ID by going to **Application** > **Manifest** > **Identity** > **Computed App ID** in DevTools.

```html
<install manifest="https://foo.com/manifest.webmanifest" manifestId="https://foo.com/someid" id="install-button"></install>
```

### Handle installation success and errors

To handle the result of the web app installation process, use the `installresult` event. The event's `result` is `success`, `aborted`, or `invalid_data`:

```javascript
if ('HTMLInstallElement' in window) {
  const button = document.getElementById('install-button');

  button.addEventListener('installresult', (event) => {
    switch (event.result) {
      case 'success':
        console.log('Install flow completed successfully');
        break;
      case 'aborted':
        console.log('Install was cancelled or could not be completed');
        break;
      case 'invalid_data':
        console.log('The manifest or manifestId is invalid');
        break;
    }
  });
} else {
  console.warn('HTMLInstallElement not supported');
}
```

### Use `oninstallresult`

You can also handle the installation result by using the `oninstallresult`
attribute:

```html
<install manifest="https://foo.com/manifest.webmanifest"
         oninstallresult="handleInstallResult(event)"></install>

<script>
  function handleInstallResult(event) {
    console.log(`Install result: ${event.result}`);
  }
</script>
```

Or set the corresponding JavaScript property:

```javascript
const button = document.getElementById('install-button');

button.oninstallresult = (event) => {
  console.log(`Install result: ${event.result}`);
};
```

## Test the feature locally

To test the manifest-URL design locally, in your browser only, use a Chromium-based browser version 153 or later and enable the **Web App Install Element** experiment:

1. In the browser, open a new tab and go to `about://flags/#web-app-install-element`.
2. Enable the **Web App Install Element** flag.
3. Click the **Restart** button in the bottom right. The browser restarts.

## Provide feedback

Your feedback is crucial to the development of this feature. Please share feedback to:

* Report any issue you encountered.
* Share improvement suggestions.
* Share how you're using the `<install>` element.

To share feedback, [open a new issue on the WICG/install-element repo](https://github.com/WICG/install-element/issues/new?template=install-element-ot-feedback.md)

We look forward to hearing from you!

## See also

* [Manifest-URL design explainer](https://github.com/WICG/install-element/blob/main/explainer-manifest-url.md)
* [Chrome Platform Status Entry](https://chromestatus.com/feature/5152834368700416)
