import onPasteHtml from "./on-paste-html.js";
import extractMainContent from "./main-content-extractor.js";
import { getEntry, getAllEntries, getTheme, storeContent, storeTheme } from "./store.js";
import { restoreRanges } from "./highlighter.js";
import "./text-snippet/text-snippet.js";

const articleEl = document.querySelector("main.reader");
const themeSelectorEl = document.querySelector("theme-selector");
const articleListEl = document.querySelector(".existing-articles");

window.currentIndex = 0;

async function loadArticle(index) {
  window.currentIndex = index;

  const theme = await getTheme();
  const entry = await getEntry(index);

  if (!entry) {
    return;
  }

  const { content, ranges } = entry;

  document.body.classList.remove('home-page');

  articleEl.innerHTML = content;
  restoreRanges(ranges, index);
  setTheme(theme);
}

async function loadHomePage() {
  const theme = await getTheme();
  setTheme(theme);

  const entries = await getAllEntries();
  for (const [index, entry] of entries.entries()) {
    const el = document.createElement("li");

    const articleExcerpt = document.createElement('text-snippet');

    const tempEl = document.createElement('div');
    tempEl.innerHTML = entry;

    articleExcerpt.textContent = tempEl.textContent;
    el.appendChild(articleExcerpt);

    articleListEl.appendChild(el);

    articleExcerpt.addEventListener('snippet-clicked', e => {
      loadArticle(index);
    });
  }
}

loadHomePage();

onPasteHtml(async (dom) => {
  // On paste, we create a new article right away.
  document.body.classList.remove('home-page');

  const container = extractMainContent(dom);

  const articles = await getAllEntries();
  const newIndex = articles.length;

  await storeContent(container.outerHTML, newIndex);
  await loadArticle(newIndex);
});

function setTheme(theme) {
  const customHighlightRule = document.styleSheets[0].cssRules[1];

  for (const name in theme) {
    document.documentElement.style.setProperty(`--theme-${name}`, theme[name]);
    // See the ::highlight rule in reader.css for an explanation of why this is necessary.
    customHighlightRule.style.setProperty(`--theme-${name}`, theme[name]);
  }

  storeTheme(theme);
}

themeSelectorEl.addEventListener('theme-selected', e => {
  setTheme(e.detail.theme);
});
