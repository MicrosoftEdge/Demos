import { setCustomSkin, getCustomSkin } from "./store.js";

const defaultStyleSheet = document.getElementById('default-stylesheet');
let customStyleSheet = null;

export function hasCustomSkinApplied() {
  return !!(customStyleSheet && customStyleSheet.parentNode);
}

export async function reloadStoredCustomSkin() {
  const previousSkin = await getCustomSkin();
  if (previousSkin) {
    await applyCustomSkin(previousSkin);
  }
}

export async function loadCustomOrResetSkin() {
  // If a custom skin already exists, revert to default.
  // Otherwise, let the user pick a new custom skin.
  const skin = await getCustomSkin();
  if (skin) {
    await revertToDefaultSkin();
    return;
  }

  // Let the user choose a file from the file system.
  let handles = [];

  try {
    handles = await window.showOpenFilePicker({
      multiple: false
    });
  } catch (e) {
    // Silent bail out, the user aborted the file picker.
    return;
  }

  if (!handles.length) {
    return;
  }

  const file = await handles[0].getFile();
  if (file.type !== 'text/css') {
    console.error(`${file.name} is not a CSS file`);
    return;
  }

  const text = await file.text();

  await applyCustomSkin(text);
}

async function applyCustomSkin(skin) {
  // Remove the default stylesheet.
  defaultStyleSheet.remove();

  // Load the CSS file into the page. Replacing the default one.
  if (!customStyleSheet) {
    customStyleSheet = createInlineStyleSheet();
  }
  document.head.appendChild(customStyleSheet);
  customStyleSheet.textContent = skin;
  
  // Load the skin into the store.
  await setCustomSkin(skin);
}

async function revertToDefaultSkin() {
  // Remove the custom CSS.
  customStyleSheet.remove();

  // Load the default CSS again.
  document.head.appendChild(defaultStyleSheet);

  // Remove the custom skin from the store.
  await setCustomSkin(null);
}

function createInlineStyleSheet() {
  const style = document.createElement('style');
  return style;
}
