/**
 * Given a time in seconds, return a string in the format MM:SS.
 */
export function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/**
 * Get today's date and time, formatted as YYYY-MM-DD HH:MM:SS.
 */
export function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const seconds = today.getSeconds();
  return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day} ${hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/**
 * Get a somewhat unique ID.
 */
export function getUniqueId() {
  let id = '';
  id += 'abcdefghijklmnopqrstuvwxyz'.split('')[Math.floor(Math.random() * 26)];
  id += 'abcdefghijklmnopqrstuvwxyz'.split('')[Math.floor(Math.random() * 26)];
  id += '0123456789'.split('')[Math.floor(Math.random() * 10)];
  id += '0123456789'.split('')[Math.floor(Math.random() * 10)];
  return id += Date.now();
}

/**
 * Using the FileSystem Access API, open a file picker and return the selected file(s).
 */
export async function openFilesFromDisk() {
  if (!('showOpenFilePicker' in window)) {
    throw new Error('File System Access API not supported');
  }

  // TODO: how to allow selecting a folder?
  const handles = await window.showOpenFilePicker({
    multiple: true
  });

  const files = [];
  for (const handle of handles) {
    const file = await handle.getFile();
    if (file.type.startsWith('audio/')) {
      files.push(file);
    }
  }

  return files;
}

/**
 * Given a string with at least one dot and some text after it, return the part between
 * the start of the string and the last dot.
 */
export function getFileNameWithoutExtension(fileName) {
  return fileName.split('.').slice(0, -1).join('.');
}

export function getSongNameFromURL(url) {
  return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
}

/**
 * Skins are expected to have a `:root` CSS rule with a `--back` custom color property.
 * This function returns the CSS value of that property, so it can be used from JS.
 */
export function getCurrentSkinBackgroundColor() {
  let color = null;

  const rules = document.styleSheets[0].cssRules;
  for (const rule of rules) {
    if (rule.selectorText === ':root') {
      color = rule.style.getPropertyValue('--back');
    }
  }

  return parseColor(color ? color : '#000');
}

function parseColor(color) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  div.style.color = color.trim();
  const style = getComputedStyle(div).color;
  const match = style.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  div.remove();

  if (match) {
    return [match[1], match[2], match[3]];
  }

  throw new Error(`Color ${color} could not be parsed`);
}
