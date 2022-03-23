import onPasteHtml from "./on-paste-html.js";
import extractMainContent from "./main-content-extractor.js";
import { restore, storeContent, storeTheme } from "./store.js";
import { restoreRanges } from "./highlighter.js";

const articleEl = document.querySelector("main.reader");
const themeSelectorEl = document.querySelector("theme-selector");

// Load initial content if any.
restore().then(({ content, ranges, theme }) => {
  if (!content) {
    return;
  }

  document.body.classList.remove('initial-state', false);

  articleEl.innerHTML = content;
  restoreRanges(ranges);
  setTheme(theme);
});

onPasteHtml(dom => {
  document.body.classList.remove('initial-state', false);

  const container = extractMainContent(dom);
  articleEl.innerHTML = '';
  articleEl.appendChild(container);

  storeContent(container.outerHTML);
});

function setTheme(theme) {
  for (const name in theme) {
    document.documentElement.style.setProperty(`--theme-${name}`, theme[name]);
  }
  storeTheme(theme);
}

themeSelectorEl.addEventListener('theme-selected', e => {
  setTheme(e.detail.theme);
});
