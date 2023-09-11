import { readManifestFromLocalStorage } from "./state.js";

const registerServiceWorker = async () => {
  try {
    await navigator.serviceWorker.register("sw.js");
    console.log('Service worker registered');
  } catch (e) {
    console.log(`Registration failed: ${e}`);
  }
}

if (navigator.serviceWorker) {
  registerServiceWorker();
}

// Grab previous state from Local Storage so that progress is not lost
// across sessions.
readManifestFromLocalStorage();
