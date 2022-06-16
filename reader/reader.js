import onPasteHtml from "./on-paste-html.js";
import extractMainContent from "./main-content-extractor.js";
import { getEntry, getAllEntries, getTheme, storeContent, storeTheme, deleteEntry } from "./store.js";
import { restoreRanges } from "./highlighter.js";
import "./text-snippet/text-snippet.js";

const articleEl = document.querySelector("main.reader");
const themeSelectorEl = document.querySelector("theme-selector");
const articleListEl = document.querySelector(".existing-articles");

const IS_NAVIGATION_ENABLED = "navigation" in window;

window.currentIndex = 0;

async function loadArticle(index) {
  window.currentIndex = index;

  const entry = await getEntry(index);

  if (!entry) {
    return;
  }

  const { content, ranges } = entry;

  document.body.classList.remove('home-page');

  articleEl.innerHTML = content;
  restoreRanges(ranges);
}

async function loadHomePage() {
  articleListEl.innerHTML = "";
  document.body.classList.add('home-page');
  articleEl.innerHTML = '<p contenteditable>Paste an article to begin or choose one of the previous articles.</p>';
  restoreRanges();

  const theme = await getTheme();
  setTheme(theme);

  const entries = await getAllEntries();
  for (const [index, entry] of entries.entries()) {
    if (!entry) {
      continue;
    }

    const el = document.createElement("li");

    const articleExcerpt = document.createElement('text-snippet');

    const tempEl = document.createElement('div');
    tempEl.innerHTML = entry;

    articleExcerpt.textContent = tempEl.textContent;
    el.appendChild(articleExcerpt);

    articleListEl.appendChild(el);

    articleExcerpt.addEventListener('snippet-clicked', e => {
      if (IS_NAVIGATION_ENABLED) {
        navigation.navigate(index);
      } else {
        loadArticle(index);
      }
    });

    articleExcerpt.addEventListener('snippet-deleted', async (e) => {
      await deleteEntry(index);
      await loadHomePage();
    });
  }
}

loadHomePage();

if (IS_NAVIGATION_ENABLED) {
  navigation.addEventListener('navigate', navEvent => {
    const url = navEvent.destination.url;
    const matchArticlePage = url.match(/reader\/([0-9]+)/);
    const matchHomePage = url.endsWith("reader/") || url.endsWith("reader");

    if (matchArticlePage) {
      navEvent.transitionWhile(loadArticle(parseInt(matchArticlePage[1])));
    } else if (matchHomePage) {
      navEvent.transitionWhile(loadHomePage());
    }
  });
}

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
