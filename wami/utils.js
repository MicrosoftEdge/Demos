export function getUniqueId() {
  let id = '';
  id += 'abcdefghijklmnopqrstuvwxyz'.split('')[Math.floor(Math.random() * 26)];
  id += 'abcdefghijklmnopqrstuvwxyz'.split('')[Math.floor(Math.random() * 26)];
  id += '0123456789'.split('')[Math.floor(Math.random() * 10)];
  id += '0123456789'.split('')[Math.floor(Math.random() * 10)];
  return id += Date.now();
}

export function extractImagesFromDataTransfer(event) {
  const items = [...event.dataTransfer.items];
  const images = [];

  for (const item of items) {
    if (item.kind !== 'file') {
      continue;
    }

    if (item.type.startsWith('image/')) {
      images.push(item.getAsFile());
    }
  }

  return images;
}
