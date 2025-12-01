const SEARCH_HIGHLIGHT_NAME = "search-result-highlight";

const query = document.querySelector("#query");
const includeShadow = document.querySelector("#include-shadow");
const highlightInfo = document.querySelector("#highlight-info");
const highlightDetails = document.querySelector("#highlight-details");

// Setup shadow DOM
const shadowContainer = document.querySelector("#shadow-container");
const shadowTemplate = document.querySelector("#shadow-template");
const shadowRoot = shadowContainer.attachShadow({ mode: "open" });
shadowRoot.appendChild(shadowTemplate.content.cloneNode(true));

// Find all text nodes contained in a root element
function getAllTextNodes(root) {
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let currentNode = treeWalker.nextNode();
  while (currentNode) {
    textNodes.push(currentNode);
    currentNode = treeWalker.nextNode();
  }
  return textNodes;
}

const shadowTextNodes = getAllTextNodes(shadowRoot);

// Get all text nodes from document.body but exclude the popup
const mainTextNodes = getAllTextNodes(document.body).filter(textNode => {
  let parent = textNode.parentNode;
  while (parent) {
    if (parent.id === 'highlight-info') {
      return false;
    }
    parent = parent.parentNode;
  }
  return true;
});

const allTextNodes = mainTextNodes.concat(shadowTextNodes);

// Function to create highlights for specific words/phrases
function createHighlightsForWords(textNodes, words, highlightName) {
  const ranges = [];

  // Look for the words/phrases in each text node in textNodes
  textNodes.forEach(textNode => {
    const text = textNode.textContent.toLowerCase();

    words.forEach(word => {
      let startPos = 0;
      while (startPos < text.length) {
        const index = text.indexOf(word.toLowerCase(), startPos);
        if (index === -1) break;

        const range = new Range();
        range.setStart(textNode, index);
        range.setEnd(textNode, index + word.length);
        ranges.push(range);

        startPos = index + word.length;
      }
    });
  });

  // If we found any words/phrases, create and register the highlight with the respective ranges
  if (ranges.length > 0) {
    let highlight = new Highlight(...ranges);
    if (["spelling-error", "grammar-error"].includes(highlightName)) {
      highlight.type = highlightName;
    }
    CSS.highlights.set(highlightName, highlight);
  }
}

// Create pre-existing highlights
function setupPreExistingHighlights() {
  // Spelling errors (deliberately misspelled words that actually exist in the text)
  const spellingErrors = [
    "demostrate", "speling", "grammer", "writting",
    "allowes", "particually", "usefull", "independantly", "highlihgting"
  ];

  // Grammar errors (context-dependent phrases that exist in the text)
  const grammarErrors = [
    "This demostrate", "work independantly", "mistake"
  ];

  // Citations (bracketed references that actually exist in the text)
  const citations = ["[John Doe et al., 2023]", "[Someone, 2022]"];

  // Quotations (phrases in quotes that actually exist in the text)
  const quotations = [
    "the future of web-based text editing lies in layered highlihgting capabilities",
    "isolation provided by shadow boundaries"
  ];

  // Code elements (API names and parameters)
  const codeElements = [
    "CSS.highlights.highlightsFromPoint()",
    "highlightsFromPoint()",
    "highlightsFromPoint",
    "shadowRoots"
  ];

  // Definitions (words that exist in shadow DOM)
  const definitions = ["shadow DOM", "isolation", "shadow boundaries", "CSS Custom Highlight"];

  // Create the different highlights
  createHighlightsForWords(allTextNodes, spellingErrors, "spelling-error");
  createHighlightsForWords(allTextNodes, grammarErrors, "grammar-error");
  createHighlightsForWords(allTextNodes, citations, "citation-highlight");
  createHighlightsForWords(allTextNodes, quotations, "quotation-highlight");
  createHighlightsForWords(allTextNodes, codeElements, "code-highlight");
  createHighlightsForWords(allTextNodes, definitions, "definition-highlight");
}

// Setup pre-existing highlights
setupPreExistingHighlights();
searchAndHighlightResults();

function searchAndHighlightResults() {
  // Remove previous search highlights
  CSS.highlights.delete(SEARCH_HIGHLIGHT_NAME);

  const str = query.value.trim().toLowerCase();
  if (!str) {
    return;
  }

  const ranges =
    (includeShadow.checked ? allTextNodes : mainTextNodes)
      .map((el) => {
        return { el, text: el.textContent.toLowerCase() };
      })
      .filter(({ text }) => text.includes(str))
      .map(({ text, el }) => {
        const indices = [];
        let startPos = 0;
        while (startPos < text.length) {
          const index = text.indexOf(str, startPos);
          if (index === -1) break;
          indices.push(index);
          startPos = index + str.length;
        }

        return indices.map((index) => {
          const range = new Range();
          range.setStart(el, index);
          range.setEnd(el, index + str.length);
          return range;
        });
      });

  if (ranges.flat().length > 0) {
    const highlight = new Highlight(...ranges.flat());
    CSS.highlights.set(SEARCH_HIGHLIGHT_NAME, highlight);
    highlightObjectToHighlightNameMap.set(highlight, SEARCH_HIGHLIGHT_NAME);
  }
}

// Search functionality
query.addEventListener("input", () => {
  searchAndHighlightResults();
});

includeShadow.addEventListener("change", () => {
  searchAndHighlightResults();
});

// Hover functionality to show highlights at point
document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;

  try {
    // Get highlights at the current point
    let highlightHitResults = [];

    if (includeShadow.checked) {
      // Include shadow DOM in the search
      highlightHitResults = CSS.highlights.highlightsFromPoint(x, y, { shadowRoots: [shadowRoot] });
    } else {
      // Only search main document
      highlightHitResults = CSS.highlights.highlightsFromPoint(x, y);
    }

    if (highlightHitResults.length > 0) {
      showHighlightInfo(event, highlightHitResults);
    } else {
      hideHighlightInfo();
    }
  } catch (error) {
    console.log("highlightsFromPoint not supported:", error.message);
    hideHighlightInfo();
  }
});

// Create a map of highlight objects to their names
const highlightObjectToHighlightNameMap = new Map();
for (const [name, highlight] of CSS.highlights) {
  highlightObjectToHighlightNameMap.set(highlight, name);
}

function showHighlightInfo(event, highlightHitResults) {
  highlightDetails.innerHTML = "";

  if (highlightHitResults.length === 0) {
    hideHighlightInfo();
    return;
  }

  highlightHitResults.forEach(hitResult => {
    const highlight = hitResult.highlight;
    const ranges = hitResult.ranges;
    const name = highlightObjectToHighlightNameMap.get(highlight) || "unknown";

    // Extract text from the ranges
    const rangeTexts = ranges.map(range => {
      try {
        return range.toString().trim();
      } catch (e) {
        return "[unable to extract text]";
      }
    }).filter(text => text.length > 0);

    const div = document.createElement("div");
    div.className = `highlight-item ${getHighlightClass(name)}`;

    // Create the display text
    let displayText = `${name}`;
    if (rangeTexts.length > 0) {
      const textPreview = rangeTexts.map(text =>
        text.length > 20 ? `"${text.substring(0, 17)}..."` : `"${text}"`
      ).join(", ");
      displayText += `\n  Text: ${textPreview}`;
    }

    div.style.whiteSpace = "pre-line";
    div.textContent = displayText;
    highlightDetails.appendChild(div);
  });

  // Position the info box near the mouse cursor
  highlightInfo.style.left = (event.pageX + 15) + "px";
  highlightInfo.style.top = (event.pageY - 10) + "px";
  highlightInfo.showPopover();
}

function hideHighlightInfo() {
  highlightInfo.hidePopover();
}

function getHighlightClass(name) {
  if (name.includes("search")) return "search-legend";
  if (name.includes("spelling")) return "spelling-legend";
  if (name.includes("grammar")) return "grammar-legend";
  if (name.includes("citation")) return "citation-legend";
  if (name.includes("quotation")) return "quotation-legend";
  if (name.includes("definition")) return "definition-legend";
  if (name.includes("code")) return "code-legend";
  return "";
}

// Hide info on mouse leave
document.addEventListener("mouseleave", hideHighlightInfo);