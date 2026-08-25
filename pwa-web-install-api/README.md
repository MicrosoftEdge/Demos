# Web Install API - `navigator.install()`

This directory contains demos that showcase the use of [navigator.install](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md), an API under development to allow web contents to install other web apps.

## Demos

* [PWA Store](https://microsoftedge.github.io/Demos/pwa-pwastore)

## About the deprecated `navigator.install(url)` method

Starting with Microsoft Edge 153, installing PWAs by using `navigator.install(url)`, where `url` points to the web app is deprecated and replaced by `navigator.install({ manifest })`, where `manifest` points to the web app manifest instead. In Edge 153, both methods still work. Starting with Edge 154, installing by using `navigator.install(url)` will stop working.

This document describes using the `manifest` option. For instructions on the deprecated `url` option, see [Deprecated - How to use `navigator.install(url)`](#deprecated---how-to-use-navigatorinstallurl), at the end of this document.

## How to use `navigator.install()`

### Detect support

```javascript
if ('install' in navigator) {
  // navigator.install is supported.
} else {
  // navigator.install is not supported.
}
```

### Install the currently loaded document

To install the currently loaded document:

* The current document must link to a web app manifest file, for example by using `<link rel="manifest" href="manifest.json">`.
* The web app manifest file must define an `id` member.

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

### Install another document

To install a document that's not the currently loaded document, use an options object with either `manifest`, or both `manifest` and `manifestId`.

To install a PWA by using its web app manifest URL:

* Use `navigator.install({ manifest: manifest_url })` where `manifest_url` is a string corresponding to the URL of the manifest file for the web app to install.
* The web app manifest file must define an `id` member.

```javascript
const installApp = async (manifest_url) => {
  if (!navigator.install) return; // API not supported.

  try {
    await navigator.install({ manifest: manifest_url });
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

To install a PWA by using both its web app manifest URL and manifest ID:

* Use `navigator.install({ manifest: manifest_url, manifestId: manifest_id })` where:
  * `manifest_url` is a string that corresponds to the URL of the manifest file for the web app to install.
  * `manifest_id` is a string that matches the computed ID of the web app to install, after parsing its manifest.

```javascript
const installApp = async (manifest_url, manifest_id) => {
  if (!navigator.install) return; // API not supported.

  try {
    await navigator.install({ manifest: manifest_url, manifestId: manifest_id });
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

You can find the computed ID of an app as follows:
* Open the app in Microsoft Edge.
* Open DevTools.
* Open the **Application** tool.
* Go to **Manifest** > **Identity** > **Computed App ID**.

### Handle installation errors

The promise returned by `navigator.install()` resolves when the install flow completes successfully. It rejects with a `DOMException` when the flow doesn't complete:

* `AbortError`: The user exited the installation flow.
* `DataError`: The manifest couldn't be fetched or parsed, or its ID is missing or doesn't match `manifestId`.
* `InvalidStateError`: The call was made from a sandboxed frame or cross-origin subframe.
* `NotAllowedError`: The call lacked transient user activation or was disallowed by browser policy.
* `NotFoundError`: The `Navigator` is no longer attached to a document.
* `TypeError`: An argument has an invalid type or URL.

```javascript
const button = document.querySelector('#install');

button.addEventListener('click', async () => {
  try {
    await navigator.install({
      manifest: 'https://example.com/manifest.json',
      manifestId: 'https://example.com/home',
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
      case 'NotFoundError':
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

To test `navigator.install()` locally, use Microsoft Edge 153 or later, or a matching version of another Chromium-based browser, and enable the **Web App Installation API** experiment:

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

* [Web Install API explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md)
* [Feature tracking at Chrome Platform Status](https://chromestatus.com/feature/5183481574850560)

## Deprecated - How to use `navigator.install(url)`

> [!IMPORTANT]
> Starting in version 153, installing by using `navigator.install(url)` is deprecated and planned to be removed with Edge 154.

### Install the currently loaded document

**`install()` requirements:**

* The current document must link to a manifest file.
* The manifest file must have an `id` field defined.

```javascript
/* Current document: no-argument signature. */
const installApp = async () => {
  if (!navigator.install) return; // API not supported.

  try {
    await navigator.install();
  } catch (err) {
    switch (err.name) {
      case 'AbortError':
        /* Operation was aborted. */
        break;
    }
  }
};
```

### Install a background document (any app that's not the current document)

**`install(<install_url>)` requirements:**

* The document at `install_url` must link to a manifest file.
* The manifest file must have an `id` field defined.

```javascript
/* Background document: one-argument signature. */
const installApp = async (install_url) => {
  if (!navigator.install) return; // API not supported.

  try {
    await navigator.install(install_url);
  } catch (err) {
    switch (err.name) {
      case 'AbortError':
        /* Operation was aborted. */
        break;
      case 'DataError':
        /* There is an issue with the manifest file or ID. */
        break;
    }
  }
};
```

**`install(<install_url>, <manifest_id>)` requirements:**

* The document at `install_url` must link to a manifest file.
* `manifest_id` must match the computed ID after parsing the manifest.

```javascript
/* Background document: two-argument signature. */
const installApp = async (install_url, manifest_id) => {
  if (!navigator.install) return; // API not supported.

  try {
    await navigator.install(install_url, manifest_id);
  } catch (err) {
    switch (err.name) {
      case 'AbortError':
        /* Operation was aborted. */
        break;
      case 'DataError':
        /* There is an issue with the manifest file or ID. */
        break;
    }
  }
};
```
