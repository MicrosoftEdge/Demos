import onPasteHtml from "./on-paste-html.js";
import "./highlighted-text-snippet/highlighted-text-snippet.js";
import { storeRanges, deleteRanges } from "./store.js";

const isSupported = 'Highlight' in window;

const highlightBtn = document.querySelector('.highlight-btn');
const highlightedList = document.querySelector('.highlighted ul');

let currentRange = null;
const ranges = new WeakMap();

const customHighlightInstance = isSupported ? new Highlight() : null;
isSupported && CSS.highlights.set('custom-highlight', customHighlightInstance);

document.addEventListener('selectionchange', () => {
  if (!isSupported || document.body.classList.contains('initial-state')) {
    return;
  }

  const selection = document.getSelection();
  currentRange = selection.isCollapsed ? null : selection.getRangeAt(0);

  toggleButton();
});

function toggleButton() {
  highlightBtn.toggleAttribute('disabled', !currentRange);
  highlightBtn.style.display = currentRange ? 'block' : 'none';

  if (currentRange) {
    const { top, right } = currentRange.getBoundingClientRect();
    highlightBtn.style.top = `${top + document.documentElement.scrollTop}px`;
    highlightBtn.style.left = `${right + 20}px`;
  }
}

highlightBtn.addEventListener('click', () => {
  if (!currentRange) {
    return;
  }

  highlight();
  storeRanges([...document.querySelectorAll('highlighted-text-snippet')].map(snippet => serializeRange(ranges.get(snippet).range)));
});

function highlight() {
  customHighlightInstance.add(currentRange);
  addRangeToList(currentRange);
  document.getSelection().removeAllRanges();
}

function getRangeTextExcerpt(range) {
  const doc = range.cloneContents();
  const str = doc.textContent.trim().replace(/\s+/g, ' ');
  return str || 'Empty range';
}

function addRangeToList(range) {
  const snippet = document.createElement('highlighted-text-snippet');
  snippet.textContent = getRangeTextExcerpt(range);

  highlightedList.appendChild(snippet);

  ranges.set(snippet, { range });
}

function deleteHighlight(snippet) {
  if (!ranges.has(snippet)) {
    return;
  }

  const { range } = ranges.get(snippet);
  snippet.remove();

  customHighlightInstance.delete(range);
}

function scrollToHighlight(snippet) {
  if (!ranges.has(snippet)) {
    return;
  }

  const { range } = ranges.get(snippet);
  const el = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentElement : range.startContainer;
  el.scrollIntoView({ behavior: 'smooth' });
}

// Listen for delete events from the snippet.
addEventListener('delete', e => {
  deleteHighlight(e.target);
});

// Listen for scroll events from the snippet.
addEventListener('scroll', e => {
  scrollToHighlight(e.target);
});

// Delete all highlights when new content is pasted.
onPasteHtml(() => {
  highlightedList.querySelectorAll('highlighted-text-snippet').forEach(snippet => {
    deleteHighlight(snippet);
  });
  deleteRanges();
});

export function restoreRanges(ranges) {
  if (!ranges) {
    return;
  }

  for (const range of ranges) {
    currentRange = unSerializeRange(range);
    highlight();
  }
}

function serializeRange(range) {
  return {
    startContainerPath: getPathToNode(range.startContainer),
    startOffset: range.startOffset,
    endContainerPath: getPathToNode(range.endContainer),
    endOffset: range.endOffset
  }
}

function unSerializeRange(serialized) {
  const startContainer = getNodeFromPath(serialized.startContainerPath);
  const endContainer = getNodeFromPath(serialized.endContainerPath);
  
  const range = new Range();
  range.setStart(startContainer, serialized.startOffset);
  range.setEnd(endContainer, serialized.endOffset);

  return range;
}

function getPathToNode(node) {
  const path = [];
  let current = node;
  while (current.parentNode) {
    path.push([...current.parentNode.childNodes].indexOf(current));
    current = current.parentNode;
  }
  return path.reverse();
}

function getNodeFromPath(path) {
  let current = document;
  for (const index of path) {
    current = current.childNodes[index];
    if (!current) {
      return null;
    }
  }
  return current;
}

