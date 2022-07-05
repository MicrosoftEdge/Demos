/**
 * Given a time in seconds, return a string in the format MM:SS.
 */
export function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
