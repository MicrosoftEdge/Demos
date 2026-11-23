// Install helpers: support detection, navigator.install() flow, self-install.

export const supportsInstallElement = () => 'HTMLInstallElement' in window;
export const supportsInstallApi = () => typeof navigator.install === 'function';

const ERROR_MESSAGES = {
  AbortError: ['Installation was cancelled or could not be completed.', 'info'],
  SecurityError: ['Installation is disabled by this page’s permissions policy.', 'warn'],
  DataError: ['The browser could not read this app’s manifest or ID. You can still visit the website.', 'warn'],
  NotAllowedError: ['Installation was blocked, either by browser policy or a declined permission.', 'warn'],
  InvalidStateError: ['Installation can’t start from this context.', 'warn'],
  NotFoundError: ['Installation can’t start because the page is no longer active.', 'warn'],
  TypeError: ['The install request was invalid.', 'warn'],
};

/**
 * Imperative install. Must be called directly from a click handler: navigator.install()
 * runs before any await so the transient user activation is preserved.
 * Resolves to { ok, message, kind } and never rejects.
 */
export async function installApp(app) {
  const options = { manifest: app.manifestUrl };
  if (app.manifestId) options.manifestId = app.manifestId;
  try {
    await navigator.install(options);
    return { ok: true, message: `The browser reports that ${app.name} was installed.`, kind: 'success' };
  } catch (err) {
    const [message, kind] = ERROR_MESSAGES[err?.name] ?? ['Installation failed unexpectedly.', 'warn'];
    return { ok: false, message, kind };
  }
}

/** Installs Contoso App itself: <install> when supported, else beforeinstallprompt. */
export function setupSelfInstall(container, statusEl) {
  const setStatus = (message) => {
    statusEl.textContent = message;
  };

  if (supportsInstallElement()) {
    const el = document.createElement('install');
    el.textContent = 'Install Contoso App';
    el.setAttribute('tabindex', '0');
    el.addEventListener('installresult', (event) => {
      if (event.result === 'success') setStatus('Contoso App was installed.');
      else if (event.result === 'aborted') setStatus('Installation was cancelled.');
      else setStatus('Contoso App could not be installed.');
    });
    container.append(el);
    return;
  }

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary';
    button.textContent = 'Install Contoso App';
    button.addEventListener('click', async () => {
      const prompt = deferredPrompt;
      deferredPrompt = null;
      button.remove();
      try {
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        setStatus(outcome === 'accepted' ? 'Contoso App was installed.' : 'Installation was cancelled.');
      } catch {
        setStatus('Contoso App could not be installed.');
      }
    });
    container.replaceChildren(button);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    container.replaceChildren();
    setStatus('Contoso App was installed.');
  });
}
