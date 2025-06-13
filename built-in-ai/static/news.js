const contentEl = document.querySelector('#content');
const contentMirrorEl = document.querySelector('#content-mirror');
const rewriterEl = document.querySelector('#rewriter-ui');
const textToBeRewrittenEl = document.querySelector('#to-be-rewritten');
const rewriteBtn = document.querySelector('#rewrite');
const replaceBtn = document.querySelector('#replace');
const toneEl = document.querySelector('#tone');
const formatEl = document.querySelector('#format');
const lengthEl = document.querySelector('#length');
const headlineEl = document.querySelector('#headline');

const MIN_LENGTH = 25;
const REWRITER_UI_DEBOUNCE_DELAY = 300;

const DEFAULT_CONTENT = `Artificial intelligence is revolutionizing the creative industry, blurring the lines between human imagination and machine-generated artistry. From Al-powered music compositions to algorithm-driven digital paintings, artists and designers are exploring new frontiers of expression.

But as Al-driven creativity gains traction, ethical concerns also emerge-who owns Al-generated works? Can machines replicate the emotional depth of human art? And how does this shift impact traditional creative professions?

In this deep dive, SyncWire explores the evolving landscape of Al creativity, featuring insights from leading innovators who are shaping the future of art, tech, and culture.

## AI and the New Creative Frontier

Artificial intelligence is revolutionizing the creative industry, blurring the lines between human imagination and machine-generated artistry. From Al-powered music compositions to algorithm-driven digital paintings, artists and designers are exploring new frontiers of expression.

With advanced models like generative adversarial networks (GANs) and diffusion models, Al can now produce artwork that rivals traditional human-made pieces. These systems analyze countless works, learning patterns and styles to generate unique compositions. But as Al-driven creativity gains traction, ethical concerns also emerge-who owns Al-generated works? Can machines replicate the emotional depth of human art? And how does this shift impact traditional creative professions?

## Innovation vs. Ethical Dilemmas

While Al-assisted creativity opens exciting possibilities, many questions remain unanswered. For instance:

* Ownership & Attribution: If an Al generates a digital painting, who owns the copyright? The creator of the Al? The user who prompted it? Or is it free for public use?`;

contentEl.value = DEFAULT_CONTENT;

addEventListener("DOMContentLoaded", () => {
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  contentEl.addEventListener("input", () => rewriterEl.classList.toggle('hidden', true));

  contentEl.addEventListener("click", (e) => {
    if (e.target.closest('.rewriter-ui')) {
      // Don't hide the UI if the user interacts with it.
      return;
    }
    rewriterEl.classList.toggle('hidden', true);
  });

  addEventListener("resize", () => rewriterEl.classList.toggle('hidden', true));

  let selectionStart = null;
  let selectionEnd = null;
  let selectedText = null;
  let proposedText = null;

  addEventListener("selectionchange", debounce(async () => {
    // Hide the rewriter UI.
    rewriterEl.classList.toggle('hidden', true);

    if (document.activeElement !== contentEl) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      return;
    }

    if (contentEl.selectionStart === contentEl.selectionEnd || contentEl.selectionEnd - contentEl.selectionStart < MIN_LENGTH) {
      console.log("Selection too short or empty.");
      return;
    }

    selectionStart = contentEl.selectionStart;
    selectionEnd = contentEl.selectionEnd;
    selectedText = contentEl.value.substring(selectionStart, selectionEnd);

    textToBeRewrittenEl.innerHTML = "";

    // Make sure the mirror element matches the textarea.
    contentMirrorEl.style.width = `${contentEl.offsetWidth}px`;
    contentMirrorEl.style.height = `${contentEl.offsetHeight}px`;
    contentMirrorEl.scrollTop = contentEl.scrollTop;
    const textareaStyles = window.getComputedStyle(contentEl);
    [
      'border',
      'boxSizing',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'letterSpacing',
      'lineHeight',
      'padding',
      'textDecoration',
      'textIndent',
      'textTransform',
      'whiteSpace',
      'wordSpacing',
      'wordWrap',
    ].forEach((property) => {
      contentMirrorEl.style[property] = textareaStyles[property];
    });

    // Populate the mirror element with the same text as the textarea,
    // split into 3 elements, so we can get the coordinates of the cursor.
    const textBeforeCursor = contentEl.value.substring(0, selectionEnd);
    const textAfterCursor = contentEl.value.substring(selectionEnd);

    const pre = document.createTextNode(textBeforeCursor);
    const post = document.createTextNode(textAfterCursor);
    const caretEle = document.createElement('span');
    caretEle.innerHTML = '&nbsp;';

    contentMirrorEl.innerHTML = '';
    contentMirrorEl.append(pre, caretEle, post);

    const caretPosition = caretEle.getBoundingClientRect();

    // Position and show the rewriter UI.
    rewriterEl.style.top = `${caretPosition.y}px`;
    rewriterEl.style.width = contentEl.offsetWidth - 50 + 'px';
    rewriterEl.classList.remove('hidden');
  }, REWRITER_UI_DEBOUNCE_DELAY));

  rewriteBtn.addEventListener("click", async () => {
    if (!selectedText || selectedText.length < MIN_LENGTH) {
      console.log("No valid text selected for rewriting.");
      return;
    }

    textToBeRewrittenEl.textContent = "";

    const session = await getRewriterSession({
      tone: toneEl.value,
      format: formatEl.value,
      length: lengthEl.value,
      sharedContext: `This is a news article titled "${headlineEl.value}".`
    });

    const stream = session.rewriteStreaming(selectedText);

    for await (const chunk of stream) {
      textToBeRewrittenEl.textContent += chunk;
    }

    proposedText = textToBeRewrittenEl.textContent;
  });

  replaceBtn.addEventListener("click", () => {
    if (!selectedText || !proposedText || (!selectionStart && !selectionEnd)) {
      console.log("No valid text selected or proposed text available for replacement.");
      return;
    }

    contentEl.value = contentEl.value.substring(0, selectionStart) +
      proposedText +
      contentEl.value.substring(selectionEnd);

    rewriterEl.classList.toggle('hidden', true);

    contentEl.focus();
    // Can't do this, because it triggers a new selectionchange event.
    // contentEl.setSelectionRange(selectionStart, selectionStart + proposedText.length);

    selectedText = null;
    proposedText = null;
  });
});
