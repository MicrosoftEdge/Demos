// ---- Feature detection ----
const supportsOpaqueRange = typeof HTMLTextAreaElement.prototype.createValueRange === "function";
console.log("OpaqueRange supported:", supportsOpaqueRange);
console.log("CSS.highlights available:", typeof CSS !== "undefined" && "highlights" in CSS);
console.log("Highlight constructor available:", typeof Highlight !== "undefined");

if (!supportsOpaqueRange) {
    document.getElementById("feature-warning").hidden = false;
}

// ===========================================================================
// Use Case 1: Caret Popup Positioning
// ===========================================================================

const mentionPopup = document.getElementById("mention-popup");
const textareaPopup = document.getElementById("textarea-popup");
const inputPopup = document.getElementById("input-popup");

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
}

function hideMentionPopup() {
    mentionPopup.hidden = true;
}

/**
 * Handle input in the mention fields.
 * Shows the popup when the user types '@'.
 */
function handleMentionInput(event) {
    const el = event.target;
    const text = el.value;
    const pos = el.selectionStart;

    if (pos > 0 && text[pos - 1] === "@") {
        showMentionPopup(el);
    } else {
        hideMentionPopup();
    }
}

textareaPopup.addEventListener("input", handleMentionInput);
inputPopup.addEventListener("input", handleMentionInput);

// Insert selected user name and close popup.
mentionPopup.addEventListener("click", (event) => {
    const li = event.target.closest("li[data-user]");
    if (!li) {
        return;
    }

    const username = li.dataset.user;
    // Determine which field is active.
    const activeField = document.activeElement === inputPopup ? inputPopup : textareaPopup;
    const pos = activeField.selectionStart;
    const before = activeField.value.slice(0, pos);
    const after = activeField.value.slice(pos);
    activeField.value = before + username + " " + after;

    // Move caret after inserted name.
    const newPos = pos + username.length + 1;
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
// Use Case 2: Spell-Check Highlighting
// ===========================================================================

// A small sample dictionary of common English words.
const dictionary = new Set([
    "a", "about", "all", "also", "an", "and", "any", "are", "as", "at",
    "be", "been", "but", "by", "can", "come", "could", "day", "did", "do",
    "each", "even", "find", "first", "for", "from", "get", "give", "go",
    "good", "great", "had", "has", "have", "he", "hello", "her", "here",
    "him", "his", "how", "i", "if", "in", "into", "is", "it", "its",
    "just", "know", "let", "like", "long", "look", "make", "many", "may",
    "me", "more", "most", "much", "my", "new", "no", "not", "now", "of",
    "on", "one", "only", "or", "other", "our", "out", "over", "own",
    "people", "say", "see", "she", "so", "some", "still", "such", "take",
    "tell", "than", "that", "the", "their", "them", "then", "there",
    "these", "they", "thing", "think", "this", "those", "through", "time",
    "to", "too", "two", "up", "us", "use", "very", "want", "was", "way",
    "we", "well", "were", "what", "when", "which", "while", "who", "will",
    "with", "word", "work", "world", "would", "write", "year", "you",
    "your", "type", "some", "text", "test", "demo", "range", "opaque",
    "check", "words", "misspelled", "try", "typing", "followed", "space"
]);

const textareaHighlight = document.getElementById("textarea-highlight");
const inputHighlight = document.getElementById("input-highlight");

// Track current OpaqueRanges so we can disconnect them before creating new ones.

let currentSpellRanges = [];

/**
 * Find all word boundaries in the given text and return an array of
 * { start, end, word } objects.
 */
function findWords(text) {
    const words = [];
    const regex = /\b[a-zA-Z']+\b/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        words.push({ start: match.index, end: match.index + match[0].length, word: match[0] });
    }
    return words;
}

/**
 * Re-run spell checking and update the shared "misspelled" CSS custom
 * highlight. We collect OpaqueRanges from both fields into a single
 * Highlight so a single ::highlight(misspelled) CSS rule covers both.
 */
function updateAllSpellHighlights() {
    if (!supportsOpaqueRange) {
        return;
    }

    // Disconnect old ranges so they don't accumulate in the element's
    // set of associated OpaqueRanges.
    currentSpellRanges.forEach((r) => r.disconnect());
    currentSpellRanges = [];

    const newRanges = [];

    [textareaHighlight, inputHighlight].forEach((element) => {
        try {
            const text = element.value;
            const words = findWords(text);
            const misspelled = words.filter((w) => !dictionary.has(w.word.toLowerCase()));
            console.log("Spell-check: element =", element.id, "text =", JSON.stringify(text), "misspelled words =", misspelled.map(w => w.word));
            misspelled.forEach((w) => {
                const range = element.createValueRange(w.start, w.end);
                console.log("  Created OpaqueRange for", JSON.stringify(w.word), "offsets", w.start, "-", w.end,
                    "range type:", range.constructor.name,
                    "startOffset:", range.startOffset, "endOffset:", range.endOffset);
                currentSpellRanges.push(range);
                newRanges.push(range);
            });
        } catch (e) {
            console.log("Spell-check highlighting error:", e);
        }
    });

    // Create a fresh Highlight and register it each time, matching the
    // pattern from the OpaqueRange explainer.
    const spellHighlight = new Highlight(...newRanges);
    CSS.highlights.set("misspelled", spellHighlight);
    console.log("Spell-check update complete. Total ranges:", spellHighlight.size, "CSS.highlights has 'misspelled':", CSS.highlights.has("misspelled"));
}

textareaHighlight.addEventListener("input", updateAllSpellHighlights);
inputHighlight.addEventListener("input", updateAllSpellHighlights);

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
        console.log("Live range created:", liveRange.constructor.name, "startOffset:", liveRange.startOffset, "endOffset:", liveRange.endOffset);
        const trackedHighlight = new Highlight(liveRange);
        CSS.highlights.set("tracked-word", trackedHighlight);
        console.log("trackedHighlight.size:", trackedHighlight.size, "CSS.highlights has 'tracked-word':", CSS.highlights.has("tracked-word"));

        liveInfo.textContent = `Highlighted "hello" at offsets ${liveRange.startOffset}–${liveRange.endOffset}. Type before it and watch the highlight follow!`;
    } catch (e) {
        console.log("Live range highlighting error:", e);
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
        console.log("Disconnect range created:", disconnectRange.constructor.name, "startOffset:", disconnectRange.startOffset, "endOffset:", disconnectRange.endOffset);
        const disconnectHighlight = new Highlight(disconnectRange);
        CSS.highlights.set("disconnect-demo", disconnectHighlight);
        console.log("disconnectHighlight.size:", disconnectHighlight.size, "CSS.highlights has 'disconnect-demo':", CSS.highlights.has("disconnect-demo"));

        disconnectInfo.textContent = showRangeState(disconnectRange, "Created");
    } catch (e) {
        console.log("Disconnect demo highlighting error:", e);
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

// ===========================================================================
// Use Case 5: getClientRects()
// ===========================================================================

const textareaRects = document.getElementById("textarea-rects");
const btnShowRects = document.getElementById("btn-show-rects");
const btnClearRects = document.getElementById("btn-clear-rects");
const rectsOutput = document.getElementById("rects-output");

btnShowRects.addEventListener("click", () => {
    if (!supportsOpaqueRange) {
        rectsOutput.textContent = "OpaqueRange is not supported in this browser.";
        return;
    }

    const range = textareaRects.createValueRange(0, textareaRects.value.length);
    const boundingRect = range.getBoundingClientRect();
    const clientRects = range.getClientRects();

    let output = `getBoundingClientRect():\n  x=${boundingRect.x.toFixed(1)}, y=${boundingRect.y.toFixed(1)}, ` +
        `width=${boundingRect.width.toFixed(1)}, height=${boundingRect.height.toFixed(1)}\n\n` +
        `getClientRects() — ${clientRects.length} rect(s):\n`;

    for (let i = 0; i < clientRects.length; i++) {
        const r = clientRects[i];
        output += `  [${i}] x=${r.x.toFixed(1)}, y=${r.y.toFixed(1)}, width=${r.width.toFixed(1)}, height=${r.height.toFixed(1)}\n`;
    }

    rectsOutput.textContent = output;
});

btnClearRects.addEventListener("click", () => {
    rectsOutput.textContent = "";
});
