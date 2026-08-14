# Web Install API - `navigator.install()`

## Manifest-URL design

This directory contains demos that showcase the use of [navigator.install](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md), an API under development to allow web contents to install other web apps.

## Demos

* [PWA Installer](https://microsoftedge.github.io/Demos/pwa-pwastore)
* [Web Install Sample](https://kbhlee2121.github.io/pwa/web-install-manifest-url/index.html)

## How to use it

### Detect support

```javascript
if ('install' in navigator) {
  // navigator.install is supported.
} else {
  // navigator.install is not supported.
}
```

### Install the currently loaded document

**`install()` requirements:**

* The current document must link to a manifest file.
* The manifest file must have an `id` field defined.

```javascript
const installApp = async () => {
  if (!navigator.install) return; // API not supported.

  try {
    await navigator.install();
    console.log('Install flow completed successfully');
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Install was cancelled or could not be completed');
    }
  }
};
```

### Install a background document

To install a document that's not the current document, use an options object with either `manifest`, or both `manifest` and `manifestId`.

**`install({ manifest })` requirements:**

* `manifest` must be the URL of the web app manifest to install.
* The manifest file must have an `id` field defined.

```javascript
const installApp = async (manifest) => {
  if (!navigator.install) return; // API not supported.

  try {
    await navigator.install({ manifest });
    console.log('Install flow completed successfully');
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Install was cancelled or could not be completed');
    } else if (err.name === 'DataError') {
      console.log('The manifest or manifestId is invalid');
    }
  }
};
```

**`install({ manifest, manifestId })` requirements:**

* `manifest` must be the URL of the web app manifest to install.
* `manifestId` must match the computed ID after parsing the manifest.

You can find the computed ID by going to **Application** > **Manifest** > **Identity** > **Computed App ID** in DevTools.

```javascript
const installApp = async (manifest, manifestId) => {
  if (!navigator.install) return; // API not supported.

  try {
    await navigator.install({ manifest, manifestId });
    console.log('Install flow completed successfully');
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Install was cancelled or could not be completed');
    } else if (err.name === 'DataError') {
      console.log('The manifest or manifestId is invalid');
    }
  }
};
```

### Handle installation errors

The promise returned by `navigator.install()` resolves when the install flow completes successfully. It rejects with a `DOMException` when the flow doesn't complete:

* `AbortError`: The user exited the installation flow.
* `DataError`: The manifest couldn't be fetched or parsed, or its ID is missing or doesn't match `manifestId`.
* `InvalidStateError`: The call was made from a sandboxed frame or cross-origin subframe.
* `NotAllowedError`: The call lacked transient user activation or was disallowed by browser policy.
* `TypeError`: An argument has an invalid type or URL.

```javascript
const button = document.querySelector('#install');

button.addEventListener('click', async () => {
  try {
    await navigator.install({
      manifest: 'https://foo.com/manifest.json',
      manifestId: 'https://foo.com/home',
    });
    console.log('Install flow completed successfully');
  } catch (err) {
    switch (err.name) {
      case 'AbortError':
        console.log('Install was cancelled or could not be completed');
        break;
      case 'DataError':
        console.log('The manifest or manifestId is invalid');
        break;
      case 'InvalidStateError':
      case 'NotAllowedError':
      case 'TypeError':
        console.error(`Install flow failed: ${err.name}`);
        break;
      default:
        console.error('Install flow failed unexpectedly', err);
    }
  }
});
```

## Test the feature locally

To test the manifest-URL design locally, in your browser only, use a Chromium-based browser version 153 or later and enable the **Web App Installation API** experiment:

1. In the browser, open a new tab and go to `about://flags/#web-app-installation-api`.
2. Enable the **Web App Installation API** flag.
3. Click the **Restart** button in the bottom right. The browser restarts.

## Provide feedback

Your feedback is crucial to the development of this feature. Please share feedback to:

* Report any issue you encountered.
* Share improvement suggestions.
* Share how you're using the Web Install API.

To share feedback, [open a new issue on the MSEdgeExplainers repo](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/new?template=web-install-api.md).

We look forward to hearing from you!

## See also

* [Manifest-URL design explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md)
* [Chrome Platform Status Entry](https://chromestatus.com/feature/5183481574850560)
