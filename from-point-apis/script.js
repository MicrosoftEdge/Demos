const textContainer = document.querySelector('main');
const createButton = document.getElementById('create-highlights');
const deleteButton = document.getElementById('delete-highlights');
const highlightStyleRadios = document.getElementsByName('highlight-style');

const highlights = new Map();

for (const radio of highlightStyleRadios) {
  const highlight = new Highlight();
  CSS.highlights.set(radio.value, highlight);
  highlights.set(radio, highlight);

  radio.addEventListener("change", () => {
    // Reset highligher priorities to ensure the selected one is on top.
    highlights.values().forEach(h => h.priority = 0);
    highlight.priority = 1;
  });
}

createButton.addEventListener("click", () => {
  if (createButton.getAttribute("aria-checked") === "true") {
    createButton.setAttribute("aria-checked", "false");
  } else {
    createButton.setAttribute("aria-checked", "true");
  }

  deleteButton.setAttribute("aria-checked", "false");
});

deleteButton.addEventListener("click", () => {
  if (deleteButton.getAttribute("aria-checked") === "true") {
    deleteButton.setAttribute("aria-checked", "false");
  } else {
    deleteButton.setAttribute("aria-checked", "true");
  }

  createButton.setAttribute("aria-checked", "false");
});

function getCheckedRadio() {
  for (const radio of highlightStyleRadios) {
    if (radio.checked) {
      return radio;
    }
  }
  return null;
}

function isCreating() {
  return createButton.getAttribute("aria-checked") === "true";
}

function isDeleting() {
  return deleteButton.getAttribute("aria-checked") === "true";
}

textContainer.addEventListener("mousedown", e => {
  if (!isCreating()) {
    return;
  }

  let startCaret = document.caretPositionFromPoint(e.clientX, e.clientY);
  document.body.classList.toggle("creating-highlight", true);

  textContainer.addEventListener("mouseup", e => {
    let endCaret = document.caretPositionFromPoint(e.clientX, e.clientY);
    document.body.classList.toggle("creating-highlight", false);

    if (startCaret && endCaret) {
      // Reverse if endCaret is before startCaret.
      if (startCaret.offsetNode === endCaret.offsetNode) {
        if (startCaret.offset > endCaret.offset) {
          [startCaret, endCaret] = [endCaret, startCaret];
        }
      } else {
        const position = startCaret.offsetNode.compareDocumentPosition(endCaret.offsetNode);
        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          [startCaret, endCaret] = [endCaret, startCaret];
        }
      }

      const range = new StaticRange({
        startContainer: startCaret.offsetNode,
        startOffset: startCaret.offset,
        endContainer: endCaret.offsetNode,
        endOffset: endCaret.offset
      });

      const checkedRadio = getCheckedRadio();
      if (!checkedRadio) {
        console.warn("No highlight style selected.");
        return;
      }

      highlights.get(checkedRadio).add(range);

      // Remove the text selection.
      const selection = window.getSelection();
      selection.removeAllRanges();
    }
  }, { once: true });
});

textContainer.addEventListener("mouseup", e => {
  if (!isDeleting()) {
    return;
  }

  const highlightsAtPoint = CSS.highlights.highlightsFromPoint(e.clientX, e.clientY);

  const checkedRadio = getCheckedRadio();
  if (!checkedRadio) {
    console.warn("No highlight style selected.");
    return;
  }
  const checkedHighlight = highlights.get(checkedRadio);

  for (const { highlight, ranges } of highlightsAtPoint) {
    if (highlight === checkedHighlight) {
      for (const range of ranges) {
        highlight.delete(range);
      }
    }
  }
});

textContainer.addEventListener("mousemove", e => {
  if (!isDeleting()) {
    return;
  }

  document.body.classList.toggle("hovering-deletable-highlight", false);

  const highlightsAtPoint = CSS.highlights.highlightsFromPoint(e.clientX, e.clientY);

  const checkedRadio = getCheckedRadio();
  if (!checkedRadio) {
    console.warn("No highlight style selected.");
    return;
  }
  const checkedHighlight = highlights.get(checkedRadio);

  for (const { highlight } of highlightsAtPoint) {
    if (highlight === checkedHighlight) {
      document.body.classList.toggle("hovering-deletable-highlight", true);
    }
  }
});
