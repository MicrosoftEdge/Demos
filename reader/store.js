import { get, set } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

export async function storeContent(text, index) {
  const contentList = await getAllEntries();
  contentList[index] = text;

  await set('content', contentList);
}

export async function storeRanges(ranges, index) {
  const rangesList = (await get('ranges')) || [];
  rangesList[index] = ranges;

  await set('ranges', rangesList);
}

export async function getEntry(index) {
  let contentList = await getAllEntries();
  const content = contentList[index];

  const rangesList = (await get('ranges')) || [];
  const ranges = rangesList[index];

  if (!content) {
    return null;
  }

  return { content, ranges };
}

export async function storeTheme(theme) {
  await set('theme', theme);
}

export async function getTheme() {
  return await get('theme');
}

export async function getAllEntries() {
  let entries = await get('content');

  // In the first version, the 'content' key was just a string. 
  // Now it's expected to be an array. Override it if it's not.
  if (typeof entries === 'string') {
    entries = [entries];
    await set('content', entries);
  }

  return entries || [];
}

export async function deleteEntry(index) {
  await storeContent(null, index);
  await storeRanges(null, index);
}
