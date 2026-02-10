# Install Element - &lt;Install&gt;

This directory contains demos that showcase the use of the [install element](https://aka.ms/InstallElement), a new HTML element under development by the Microsoft Edge team to allow web contents to declaratively install other web apps. The element is currently supported on Windows, MacOS, Linux, and ChromeOS.

## Demos

➡️ **[Open the demo](https://kbhlee2121.github.io/pwa/web-install/only-elements.html)** ⬅️


## How to Use It

### Install the current loaded document

**&lt;install&gt;&lt;/install&gt; Requirements**: 
* The current document must link to a manifest file.
* The manifest file must have an `id` field defined.

```javascript
/* Current Document: no attributes required */
<install id="install-button"></install>

if ('HTMLInstallElement' in window) {
    let button = document.getElementById('install-button');

    // Same as kSuccess in navigator.install.
    button.addEventListener('promptaction', (event) => {
        console.log(`Install succeeded`);
    });

    // Same as kAbortError in navigator.install.
    button.addEventListener('promptdismiss', (event) => {
        console.log(`Install failed`);
    });

    // Same as kDataError in navigator.install.
    button.addEventListener('validationstatuschanged', (event) => {
        if (event.target.invalidReason ===
                'install_data_invalid') {
            console.log(event.target.invalidReason);
        }
    });
} else {
  console.warn('HTMLInstallElement not supported');
}
```
### Install a background document (any app that's not the current document)

**&lt;install installurl=https://foo.com&gt;&lt;/install&gt; Requirements:**
* The document at `installurl` must link to a manifest file.
* The manifest file must have an `id` field defined.

```javascript
/*Background Document: 1-attribute*/
<install installurl="https://foo.com" id="install-button"></install>

if ('HTMLInstallElement' in window) {
    let button = document.getElementById('install-button');

    // Same as kSuccess in navigator.install.
    button.addEventListener('promptaction', (event) => {
        console.log(`Install succeeded`);
    });

    // Same as kAbortError in navigator.install.
    button.addEventListener('promptdismiss', (event) => {
        console.log(`Install failed`);
    });

    // Same as kDataError in navigator.install.
    button.addEventListener('validationstatuschanged', (event) => {
        if (event.target.invalidReason ===
                'install_data_invalid') {
            console.log(event.target.invalidReason);
        }
    });
} else {
  console.warn('HTMLInstallElement not supported');
}
```
**&lt;install installurl=https://foo.com manifestid=https://foo.com/someid&gt;&lt;/install&gt; Requirements:**
* The document at  `installurl` must link to a manifest file.
* `manifestid` must match the computed id after parsing the manifest.

```javascript
/*Background Document: 2-attributes*/
<install installurl="https://foo.com"
         manifestid="https://foo.com/someid"
         id="install-button">
</install>

if ('HTMLInstallElement' in window) {
    let button = document.getElementById('install-button');

    // Same as kSuccess in navigator.install.
    button.addEventListener('promptaction', (event) => {
        console.log(`Install succeeded`);
    });

    // Same as kAbortError in navigator.install.
    button.addEventListener('promptdismiss', (event) => {
        console.log(`Install failed`);
    });

    // Same as kDataError in navigator.install.
    button.addEventListener('validationstatuschanged', (event) => {
        if (event.target.invalidReason ===
                'install_data_invalid') {
            console.log(event.target.invalidReason);
        }
    });
} else {
  console.warn('HTMLInstallElement not supported');
}
```

## Try it with Origin Trials!

The install element is currently available as an [Origin Trial](https://developer.chrome.com/docs/web-platform/origin-trials/) in Chrome and Microsoft Edge versions 14X-14X. This allows you to use the feature on your production site and provide valuable feedback to browser vendors before it's finalized.

To participate, you'll need to:
1. **Register for the Origin Trial:** [Install element registration page link](https://developer.chrome.com/origintrials/#/view_trial/XXXXXXXXXX)
2. **Add the Origin Trial Token:** Once you have your token, add it to your pages via a `<meta>` tag or an HTTP header.

```html
<!-- Example of adding the token via a meta tag -->
<meta http-equiv="origin-trial" content="YOUR_TOKEN_HERE">
```
See [Origin Trials Guide for Web Developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md) to learn more about Origin Trials.

## Provide Feedback

Your feedback is crucial to the development of this feature. If you encounter any issues, have suggestions, or want to share how you're using the Web Install API, please:

**Log an issue here:** [Install element Feedback Link](https://github.com/MicrosoftEdge/MSEdgeExplainers/issues/new?template=web-install-api.md)

We look forward to hearing from you!

## Further Reading and References
* [Explainer](https://aka.ms/InstallElement)
* [Chrome Platform Status Entry](https://chromestatus.com/feature/5152834368700416)
* [Origin Trials Guide for Web Developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)

