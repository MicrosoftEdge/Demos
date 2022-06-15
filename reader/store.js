import { get, set, del } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

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
  return (await get('content')) || [];
}
