// This module attempts to extract the main article content from a given DOM subtree.
// It looks for common classes and IDs to identify the main wrapper.
// It then removes all of the useless elements that wrap the main content but don't add any value.
// And finally removes all inline styles.

const USUAL_CONTAINERS = [
  '#main',
  '.article-container',
  '.main-content',
  '.article-body',
  '.article-content',
  '.article-content-inner',
];

function removeUselessWrappers(el) {
  // Start at the root element, remove it if it does not contain any content
  // but only a single nested element. And then do the same for that element, and so on.
  while (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.ELEMENT_NODE) {
    el = el.childNodes[0];
  }
  
  // Now only keep the headings, lists, images, pre, and paragraphs.
  const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'p', 'img', 'pre'];
  const newEl = document.createElement('div');

  while (true) {
    const toMove = el.querySelector(allowedTags.join(','));
    if (!toMove) {
      break;
    }
    newEl.appendChild(toMove);
  }

  // Get rid of certain elements we really don't want.
  const disallowedTags = ['script', 'style', 'iframe'];
  for (const tag of disallowedTags) {
    const els = newEl.querySelectorAll(tag);
    for (const el of els) {
      el.remove();
    }
  }

  // Finally, get rid of all of the inline style attributes.
  newEl.querySelectorAll('[style]').forEach(el => {
    el.removeAttribute('style');
  });

  return newEl;
}

export default function(el) {
  // Try them all and return the first that matches.
  const mainContent = el.querySelector(USUAL_CONTAINERS.join(','));
  if (mainContent) {
    return removeUselessWrappers(mainContent);
  }

  // If none of the usual containers match, try to find the <main>.
  const main = el.querySelector('main');
  if (main) {
    return removeUselessWrappers(main);
  }

  // If none of the above match, try to find the <body>.
  const body = el.querySelector('body');
  if (body) {
    return removeUselessWrappers(body);
  }

  // If none of the above match, return the provided el.
  return removeUselessWrappers(el);
}
