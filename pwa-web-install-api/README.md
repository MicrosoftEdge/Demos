# Web Install API - `navigator.install()`

> [!IMPORTANT]
> Starting in version 153, the manifest-URL design is available. See the [manifest-URL instructions](./manifest-url.md) to learn how to use it. The `install_url` design is expected to be deprecated starting in version 154.

This directory contains demos that showcase the use of [navigator.install](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md), an API under development to allow web contents to install other web apps.

## Demos

* [Web Install Sample](https://kbhlee2121.github.io/pwa/web-install/index.html)

## How to use it

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

## Try it with origin trials

The Web Install API is currently available as an [Origin Trial](https://developer.chrome.com/docs/web-platform/origin-trials/) in Chrome and Microsoft Edge versions 143-148. This allows you to use the feature on your production site and provide valuable feedback to browser vendors before it's finalized.

To participate, you'll need to:

1. **Register for the Origin Trial:** [Web Install registration page link](https://developer.chrome.com/origintrials/#/view_trial/2367204554136616961)
2. **Add the Origin Trial Token:** Once you have your token, add it to your pages via a `<meta>` tag or an HTTP header.

```html
<!-- Example of adding the token via a meta tag -->
<meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE">
```

**The token obtained in step 1 will enable the trial for both Chrome and Edge.** See [Origin Trials Guide for Web Developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md) to learn more about Origin Trials.

## Provide feedback

Your feedback is crucial to the development of this feature. If you encounter any issues, have suggestions, or want to share how you're using the Web Install API, please:

**Log an issue here:** [Web Install Feedback Link](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/new?template=web-install-api.md)

We look forward to hearing from you!

## Further reading and references

* [Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md)
* [Chrome Platform Status Entry](https://chromestatus.com/feature/5183481574850560)
* [Origin Trials Guide for Web Developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)
