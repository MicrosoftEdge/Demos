# `<install>` element demo

This directory contains a demo that showcases the use of the [&lt;install&gt; element](https://github.com/WICG/install-element/blob/main/explainer-manifest-url.md), a new HTML element under development to allow web contents to declaratively install other web apps.

➡️ **[Open the demo](https://microsoftedge.github.io/Demos/pwa-install-element/)** ⬅️

## About the deprecated `installurl` attribute

Starting with Microsoft Edge 153, installing PWAs by using `<install installurl="...">` is deprecated and replaced by `<install manifest="...">`. In Edge 153, both methods still work. Starting with Edge 154, installing by using `installurl` will stop working.

This document describes using the `manifest` attribute. For instructions on the deprecated `installurl` attribute, see [Deprecated - How to use `<install installurl>`](#deprecated---how-to-use-install-installurl), at the end of this document.

## How to use the `<install>` element

### Detect support

The `<install>` element is currently available in Chromium-based browsers on Windows, macOS, Linux, and ChromeOS, as an experimental feature.

To detect support:

```javascript
if ('HTMLInstallElement' in window) {
  // The <install> element is supported.
} else {
  // The <install> element is not supported.
}
```

### Install the current document

To install the currently loaded document:

* The current document must link to a web app manifest file, for example by using `<link rel="manifest" href="manifest.json">`.
* The web app manifest file must define an `id` member.

```html
<install></install>
```

### Install another document

To install a document that's not the current document, use either the `manifest` attribute, or both the `manifest` and `manifestId` attributes together:

To install another document by using the `manifest` attribute alone:

* The value of the `manifest` attribute must be the URL of the web app manifest to install.
* The web app manifest file must define an `id` member.

```html
<install manifest="https://foo.com/manifest.webmanifest"></install>
```

To install another document by using the `manifest` and `manifestId` attributes together:

* The value of the `manifest` attribute must be the URL of the web app manifest to install.
* The value of the `manifestId` attribute must match the computed ID of the web app to install, after parsing its manifest.

```html
<install manifest="https://foo.com/manifest.webmanifest" manifestId="https://foo.com/someid"></install>
```

You can find the computed ID of an app as follows:
* Open the app in Microsoft Edge.
* Open DevTools.
* Open the **Application** tool.
* Go to **Manifest** > **Identity** > **Computed App ID**.

### Diagnose a blocked `<install>` button

The browser can temporarily or permanently prevent an `<install>` element from
being activated if it doesn't meet presentation and anti-abuse requirements,
such as being visible, unobscured, and not recently moved. Use the `isValid` and
`invalidReason` properties to determine whether the element can currently be
activated and why it is blocked; learn more about using these inherited
properties and events in the [Permission Element
API](https://wicg.github.io/PEPC/permission-elements.html) documentation. Listen
for the `validationstatuschange` event to react when its validity changes:

```javascript
const installButton = document.getElementById('install-button');

function reportValidity() {
  if (installButton.isValid) {
    console.log('The install element can be activated');
  } else {
    console.warn(`The install element is blocked: ${installButton.invalidReason}`);
  }
}

installButton.addEventListener('validationstatuschange', reportValidity);
reportValidity();
```

The DevTools **Issues** tab may also report activation problems.

> [!NOTE]
> `<install>` also inherits `initialPermissionStatus`, `permissionStatus`,
> `onpromptaction`, and `onpromptdismiss`, but these properties and events do
> not determine whether installation can proceed or report its outcome. Use the
> validation properties and event described above before the user invokes
> `<install>`, and `installresult` afterward.

### Handle installation success and errors

To handle the result of the web app installation process, use the `installresult` event. The event's `result` is `success`, `aborted`, or `invalid_data`:

```javascript
const installButton = document.getElementById('install-button');

installButton.addEventListener('installresult', (event) => {
  switch (event.result) {
    case 'success':
      console.log('Install flow completed successfully');
      break;
    case 'aborted':
      console.log('Install was cancelled or could not be completed');
      break;
    case 'invalid_data':
      console.error('The installation data is invalid');
      break;
  }
});
```

You can also use the corresponding `oninstallresult` HTML attribute:

```html
<install manifest="https://foo.com/manifest.webmanifest"
         oninstallresult="handleInstallResult(event)"></install>

<script>
  function handleInstallResult(event) {
    console.log(`Install result: ${event.result}`);
  }
</script>
```

Or use the corresponding `oninstallresult` JavaScript property:

```javascript
const button = document.getElementById('install-button');

button.oninstallresult = (event) => {
  console.log(`Install result: ${event.result}`);
};
```

Installation data includes the `manifest` URL, the optional `manifestId`, and
the fetched web app manifest. Problems such as an invalid URL, a manifest that
can't be fetched or parsed, or a mismatched app ID are reported after the user
invokes the element through the `installresult` event with a result of
`invalid_data`:

```javascript
installButton.addEventListener('installresult', (event) => {
  if (event.result === 'invalid_data') {
    console.error('Check the manifest URL, manifestId, and web app manifest');
  }
});
```

For same-origin installations, the DevTools **Issues** tab may provide more
detailed diagnostics for `invalid_data`. It does not expose details about
cross-origin installation failures.

For more information, see [Results, errors, and debuggability](https://github.com/WICG/install-element/blob/main/explainer-manifest-url.md#results-errors-and-debuggability)
in the `<install>` element explainer.

## Test the feature locally

To test the `<install>` element locally, use Microsoft Edge 153 or later, or a matching version of another Chromium-based browser, and enable the **Web App Install Element** experiment:

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

* [User-Initiated Installation of a Web Application explainer](https://github.com/WICG/install-element/blob/main/explainer-manifest-url.md)
* [Feature tracking at Chrome Platform Status](https://chromestatus.com/feature/5152834368700416)

## Deprecated - How to use `<install installurl>`

> [!IMPORTANT]
> Starting in version 153, installing by using `<install installurl="...">` is deprecated and planned to be removed with Edge 154.

### Install the current document

To install the currently loaded document:

* The document must link to a manifest file.
* The manifest file must have an `id` field defined.

```html
<install></install>
```

### Install another document

To install a document that's not the current document, also known as a _background_ document, use either the `installurl` attribute, or both the `installurl` and `manifestid` attributes together:

To use the `installurl` attribute:

* The document at `installurl` must link to a manifest file.
* The manifest file must have an `id` field defined.

```html
<install installurl="https://foo.com"></install>
```

To use the `installurl` and `manifestid` attributes together:

* The document at `installurl` must link to a manifest file.
* The value of the `manifestid` attribute must match the computed ID after parsing the manifest.

You can find the computed ID by going to **Application** > **Manifest** > **Identity** > **Computed App ID** in DevTools.

```html
<install installurl="https://foo.com" manifestid="https://foo.com/someid"></install>
```

### Handle installation success and errors

The result of the installation is reported through the `installresult` event.
See [Handle installation success and errors](#handle-installation-success-and-errors), above.
