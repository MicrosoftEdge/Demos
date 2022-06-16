import onPasteHtml from "./on-paste-html.js";
import "./text-snippet/text-snippet.js";
import { storeRanges } from "./store.js";

const isSupported = 'Highlight' in window;

const highlightBtn = document.querySelector('.highlight-btn');
const highlightedList = document.querySelector('.highlighted ul');

let currentRange = null;
const ranges = new Map();

const customHighlightInstance = isSupported ? new Highlight() : null;
isSupported && CSS.highlights.set('custom-highlight', customHighlightInstance);

document.addEventListener('selectionchange', () => {
  if (!isSupported || document.body.classList.contains('home-page')) {
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
    const { top, left, width } = currentRange.getBoundingClientRect();
    highlightBtn.style.top = `${top + document.documentElement.scrollTop - 40}px`;
    highlightBtn.style.left = `${left + (width / 2) - 35}px`;
  }
}

highlightBtn.addEventListener('click', () => {
  if (!currentRange) {
    return;
  }

  highlight();
  updateRangesInStore();
});

function updateRangesInStore() {
  const rangesToStore = [...document.querySelectorAll('.toolbar text-snippet')];
  const serialized = rangesToStore.map(snippet => serializeRange(ranges.get(snippet).range));
  return storeRanges(serialized, window.currentIndex);
}

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
  const snippet = document.createElement('text-snippet');
  snippet.textContent = getRangeTextExcerpt(range);

  highlightedList.appendChild(snippet);

  ranges.set(snippet, { range });
}

function deleteAllSnippets() {
  for (const [snippet] of ranges) {
    snippet.remove();
  }
}

function deleteHighlight(snippet) {
  if (!ranges.has(snippet)) {
    return;
  }

  const { range } = ranges.get(snippet);
  snippet.remove();

  customHighlightInstance.delete(range);

  updateRangesInStore();
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
addEventListener('snippet-deleted', e => {
  deleteHighlight(e.target);
});

// Listen for click events from the snippet.
addEventListener('snippet-clicked', e => {
  scrollToHighlight(e.target);
});

// Delete all highlights when new content is pasted.
onPasteHtml(() => {
  highlightedList.querySelectorAll('text-snippet').forEach(snippet => {
    deleteHighlight(snippet);
  });
});

export function restoreRanges(rangesToRestore) {
  deleteAllSnippets();

  if (!rangesToRestore) {
    return;
  }

  for (const range of rangesToRestore) {
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

