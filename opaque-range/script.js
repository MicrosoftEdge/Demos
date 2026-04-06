// ---- Feature detection ----
const supportsOpaqueRange = typeof HTMLTextAreaElement.prototype.createValueRange === "function";

if (!supportsOpaqueRange) {
    document.getElementById("feature-warning").hidden = false;
}

// ===========================================================================
// Use Case 1: Caret Popup Positioning
// ===========================================================================

const mentionPopup = document.getElementById("mention-popup");
const textareaPopup = document.getElementById("textarea-popup");
const inputPopup = document.getElementById("input-popup");

let mentionTriggerField = null;

/**
 * Show the mention popup at the caret position using OpaqueRange.
 * @param {HTMLTextAreaElement | HTMLInputElement} element
 */
function showMentionPopup(element) {
    if (!supportsOpaqueRange) {
        return;
    }

    const caretPos = element.selectionStart;
    // Create a collapsed OpaqueRange at the caret.
    const range = element.createValueRange(caretPos, caretPos);
    const rect = range.getBoundingClientRect();

    mentionPopup.style.left = `${rect.left}px`;
    mentionPopup.style.top = `${rect.bottom + 4}px`;
    mentionPopup.hidden = false;
    mentionTriggerField = element;
}

function hideMentionPopup() {
    mentionPopup.hidden = true;
    mentionTriggerField = null;
}

/**
 * Handle input in the mention fields.
 * Shows the popup when the user types ':'.
 */
function handleMentionInput(event) {
    const el = event.target;
    const text = el.value;
    const pos = el.selectionStart;

    if (pos > 0 && text[pos - 1] === ":") {
        showMentionPopup(el);
    } else {
        hideMentionPopup();
    }
}

textareaPopup.addEventListener("input", handleMentionInput);
inputPopup.addEventListener("input", handleMentionInput);

// Insert selected emoji and close popup.
mentionPopup.addEventListener("click", (event) => {
    const li = event.target.closest("li[data-emoji]");
    if (!li) {
        return;
    }

    const emoji = li.dataset.emoji;
    const activeField = mentionTriggerField || textareaPopup;
    const pos = activeField.selectionStart;
    // Replace the trigger character ':' with the emoji.
    const before = activeField.value.slice(0, pos - 1);
    const after = activeField.value.slice(pos);
    activeField.value = before + emoji + " " + after;

    // Move caret after inserted emoji.
    const newPos = before.length + emoji.length + 1;
    activeField.setSelectionRange(newPos, newPos);
    activeField.focus();
    hideMentionPopup();
});

// Hide popup when clicking outside.
document.addEventListener("click", (event) => {
    if (!mentionPopup.contains(event.target)) {
        hideMentionPopup();
    }
});

// ===========================================================================
// Use Case 2: Search/Find Highlighting
// ===========================================================================

const searchInput = document.getElementById("search-input");
const textareaSearch = document.getElementById("textarea-search");
const searchCount = document.getElementById("search-count");

let currentSearchRanges = [];

function updateSearchHighlights() {
    if (!supportsOpaqueRange) {
        return;
    }

    // Disconnect old ranges.
    currentSearchRanges.forEach((r) => r.disconnect());
    currentSearchRanges = [];

    const query = searchInput.value;
    if (!query) {
        CSS.highlights.delete("search-match");
        searchCount.textContent = "";
        return;
    }

    const text = textareaSearch.value;
    const newRanges = [];

    try {
        // Find all case-insensitive occurrences of the search term.
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        let startIndex = 0;

        while (startIndex < lowerText.length) {
            const idx = lowerText.indexOf(lowerQuery, startIndex);
            if (idx === -1) {
                break;
            }
            const range = textareaSearch.createValueRange(idx, idx + query.length);
            currentSearchRanges.push(range);
            newRanges.push(range);
            startIndex = idx + 1;
        }
    } catch (e) {
        console.error("Search highlighting error:", e);
    }

    if (newRanges.length > 0) {
        const searchHighlight = new Highlight(...newRanges);
        CSS.highlights.set("search-match", searchHighlight);
    } else {
        CSS.highlights.delete("search-match");
    }

    const count = newRanges.length;
    searchCount.textContent = count === 1 ? "1 match" : `${count} matches`;
}

searchInput.addEventListener("input", updateSearchHighlights);
textareaSearch.addEventListener("input", updateSearchHighlights);

// ===========================================================================
// Use Case 3: Live Range Tracking
// ===========================================================================

const textareaLive = document.getElementById("textarea-live");
const btnHighlight = document.getElementById("btn-highlight-hello");
const btnClear = document.getElementById("btn-clear-live");
const liveInfo = document.getElementById("live-range-info");

let liveRange = null;

btnHighlight.addEventListener("click", () => {
    if (!supportsOpaqueRange) {
        liveInfo.textContent = "OpaqueRange is not supported in this browser.";
        return;
    }

    const text = textareaLive.value;
    const idx = text.indexOf("hello");
    if (idx === -1) {
        liveInfo.textContent = '"hello" not found in the textarea.';
        return;
    }

    // Disconnect the previous range before creating a new one.
    if (liveRange) {
        liveRange.disconnect();
    }

    try {
        liveRange = textareaLive.createValueRange(idx, idx + "hello".length);
        const trackedHighlight = new Highlight(liveRange);
        CSS.highlights.set("tracked-word", trackedHighlight);

        liveInfo.textContent = `Highlighted "hello" at offsets ${liveRange.startOffset}–${liveRange.endOffset}. Type before it and watch the highlight follow!`;
    } catch (e) {
        console.error("Live range highlighting error:", e);
    }
});

// Update the info text whenever the textarea content changes, so users can see
// the live range offsets shift in real time.
textareaLive.addEventListener("input", () => {
    if (liveRange) {
        liveInfo.textContent = `Live range offsets: ${liveRange.startOffset}–${liveRange.endOffset}`;
    }
});

btnClear.addEventListener("click", () => {
    CSS.highlights.delete("tracked-word");
    if (liveRange) {
        liveRange.disconnect();
        liveRange = null;
    }
    liveInfo.textContent = "";
});

// ===========================================================================
// Use Case 4: disconnect()
// ===========================================================================

const textareaDisconnect = document.getElementById("textarea-disconnect");
const btnCreateRange = document.getElementById("btn-create-range");
const btnDisconnectRange = document.getElementById("btn-disconnect-range");
const disconnectInfo = document.getElementById("disconnect-info");

let disconnectRange = null;

function showRangeState(range, label) {
    return `${label}: startOffset=${range.startOffset}, endOffset=${range.endOffset}, collapsed=${range.collapsed}, startContainer=${range.startContainer}, endContainer=${range.endContainer}`;
}

btnCreateRange.addEventListener("click", () => {
    if (!supportsOpaqueRange) {
        disconnectInfo.textContent = "OpaqueRange is not supported in this browser.";
        return;
    }

    // Disconnect any previous range before creating a new one.
    if (disconnectRange) {
        disconnectRange.disconnect();
    }

    // "quick" is at positions 4–9 in "The quick brown fox"
    try {
        disconnectRange = textareaDisconnect.createValueRange(4, 9);
        const disconnectHighlight = new Highlight(disconnectRange);
        CSS.highlights.set("disconnect-demo", disconnectHighlight);

        disconnectInfo.textContent = showRangeState(disconnectRange, "Created");
    } catch (e) {
        console.error("Disconnect demo highlighting error:", e);
    }
});

btnDisconnectRange.addEventListener("click", () => {
    if (!disconnectRange) {
        disconnectInfo.textContent = "No range to disconnect. Create one first.";
        return;
    }

    disconnectRange.disconnect();
    CSS.highlights.delete("disconnect-demo");

    disconnectInfo.textContent = showRangeState(disconnectRange, "After disconnect()") +
        "\nThe range is now detached — offsets are 0, geometry is empty, and edits to the textarea no longer affect it.";
    disconnectRange = null;
});

// Show live updates while a connected range exists.
textareaDisconnect.addEventListener("input", () => {
    if (disconnectRange) {
        disconnectInfo.textContent = showRangeState(disconnectRange, "Live update");
    }
});
