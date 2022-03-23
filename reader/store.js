import { get, set, del } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

export async function storeContent(text) {
  await set('content', text);
  // Also delete all stored ranges.
  await del('ranges');
}

export async function storeRanges(ranges) {
  await set('ranges', ranges);
}

export async function restore() {
  const content = await get('content');
  const ranges = await get('ranges');
  const theme = await get('theme');
  return { content, ranges, theme };
}

export async function deleteRanges() {
  await del('ranges');
}

export async function storeTheme(theme) {
  await set('theme', theme);
}
