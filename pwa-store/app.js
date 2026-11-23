import { APPS, CATEGORIES, getApp, isInstallable, isSafeHttpsUrl } from './apps.js';
import { installApp, setupSelfInstall, supportsInstallApi } from './install.js';

const view = document.getElementById('view');
const searchInput = document.getElementById('search');
const categoryNav = document.getElementById('categories');

const state = { query: '', category: 'All' };

// Build DOM without ever inserting untrusted HTML.
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (key === 'class') el.className = value;
    else el.setAttribute(key, value === true ? '' : value);
  }
  el.append(...children.flat().filter((c) => c != null));
  return el;
}

function externalLink(url, label, attrs = {}) {
  if (!isSafeHttpsUrl(url)) return h('span', {}, label);
  return h('a', { href: url, target: '_blank', rel: 'noopener noreferrer', ...attrs }, label);
}

const HUES = { Productivity: 215, Creativity: 330, Communication: 160, Entertainment: 35 };

// Prefer the app's own icon; fall back to original generic artwork (a tinted tile with the initial).
function artwork(app, size = 'md') {
  const fallback = fallbackArt(app, size);
  if (!app.iconUrl || !isSafeHttpsUrl(app.iconUrl)) return fallback;
  const img = h('img', {
    class: `art art-${size} art-icon`,
    src: app.iconUrl,
    alt: '',
    loading: 'lazy',
    decoding: 'async',
    referrerpolicy: 'no-referrer',
  });
  img.addEventListener('error', () => img.replaceWith(fallback), { once: true });
  return img;
}

function fallbackArt(app, size) {
  const hue = HUES[app.category] ?? 250;
  const svgNs = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNs, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', `art art-${size}`);
  const shapes = [
    ['rect', { width: 100, height: 100, rx: 22, fill: `hsl(${hue} 70% 92%)` }],
    ['circle', { cx: 82, cy: 18, r: 30, fill: `hsl(${hue} 70% 82%)` }],
    ['circle', { cx: 14, cy: 92, r: 26, fill: `hsl(${(hue + 40) % 360} 65% 85%)` }],
  ];
  for (const [name, a] of shapes) {
    const node = document.createElementNS(svgNs, name);
    for (const [k, v] of Object.entries(a)) node.setAttribute(k, v);
    svg.append(node);
  }
  const text = document.createElementNS(svgNs, 'text');
  for (const [k, v] of Object.entries({
    x: 50, y: 66, 'text-anchor': 'middle', 'font-size': 52, 'font-weight': 700,
    'font-family': 'Georgia, serif', fill: `hsl(${hue} 55% 28%)`,
  })) text.setAttribute(k, v);
  text.textContent = app.name.replace(/^The /, '').charAt(0).toUpperCase();
  svg.append(text);
  return svg;
}

function statusLine() {
  return h('p', { class: 'status', role: 'status' });
}

function setStatus(el, message, kind = 'info') {
  el.textContent = message;
  el.dataset.kind = kind;
}

function installButton(app, status, { label = 'Install', large = false } = {}) {
  const button = h('button', { type: 'button', class: `btn${large ? ' btn-large' : ''}`, 'aria-label': `${label} ${app.name}` }, label);
  button.addEventListener('click', () => {
    // aria-disabled instead of disabled so focus isn't dropped while the browser prompt is open.
    if (button.getAttribute('aria-disabled') === 'true') return;
    button.setAttribute('aria-disabled', 'true');
    setStatus(status, 'Waiting for your browser…', 'info');
    installApp(app).then(({ message, kind }) => {
      setStatus(status, message, kind);
      button.removeAttribute('aria-disabled');
    });
  });
  return button;
}

function appCard(app) {
  const status = statusLine();
  const action = isInstallable(app) && supportsInstallApi() ? installButton(app, status) : null;
  const titleId = `card-${app.id}`;
  return h(
    'article',
    { class: 'card', 'aria-labelledby': titleId },
    artwork(app),
    h('p', { class: 'category' }, app.category),
    h('h3', { id: titleId }, app.name),
    h('p', { class: 'summary' }, app.summary),
    h(
      'div',
      { class: 'card-actions' },
      action ?? null,
      h('a', { class: 'link', href: `#/app/${app.id}`, 'aria-label': `View details for ${app.name}` }, 'View details'),
    ),
    status,
  );
}

function matches(app) {
  const q = state.query.trim().toLowerCase();
  const inCategory = state.category === 'All' || app.category === state.category;
  const inQuery = !q || [app.name, app.summary, app.category, app.description].some((t) => t.toLowerCase().includes(q));
  return inCategory && inQuery;
}

function renderCatalog() {
  const grid = h('div', { class: 'grid', id: 'grid' });
  const count = h('p', { class: 'results-count', role: 'status' });
  const empty = h('p', { class: 'empty', hidden: true }, 'No apps match your search. Try another word or category.');

  function refresh() {
    const list = APPS.filter(matches);
    grid.replaceChildren(...list.map((app) => appCard(app)));
    empty.hidden = list.length > 0;
    count.textContent = `${list.length} ${list.length === 1 ? 'app' : 'apps'}`;
  }
  view.refreshGrid = refresh;

  view.replaceChildren(
    h(
      'section',
      { class: 'hero' },
      h('p', { class: 'eyebrow' }, 'Hand-picked web apps'),
      h('h1', {}, 'Discover and install useful apps for the web.'),
      h(
        'p',
        { class: 'lede' },
        'Find tools for drawing, planning, listening and getting things done. Install the ones you like, and they sit on your device next to every other app.',
      ),
    ),
    h(
      'section',
      { 'aria-labelledby': 'browse', id: 'browse-section' },
      h('h2', { id: 'browse', tabindex: '-1' }, 'Browse all apps'),
      count,
      grid,
      empty,
    ),
  );
  refresh();
}

function renderDetail(slug) {
  const app = getApp(slug);
  if (!app) return renderNotFound();
  document.title = `${app.name} – Contoso App`;
  const status = statusLine();

  let install;
  if (!isInstallable(app)) {
    install = h(
      'p',
      { class: 'note' },
      'Installing from Contoso App isn’t available for this app yet. You can still use it on its website.',
    );
  } else if (!supportsInstallApi()) {
    install = h(
      'p',
      { class: 'note' },
      'This browser doesn’t support installing apps from other sites. Visit the website instead.',
    );
  } else {
    install = installButton(app, status, { label: 'Install', large: true });
  }

  view.replaceChildren(
    h('p', {}, h('a', { class: 'link', href: '#/' }, '← Back to catalog')),
    h(
      'article',
      { class: 'detail' },
      artwork(app, 'lg'),
      h(
        'div',
        { class: 'detail-body' },
        h('p', { class: 'category' }, app.category),
        h('h1', {}, app.name),
        h('p', { class: 'lede' }, app.description),
        h('h2', {}, 'What you can do'),
        h('ul', {}, app.useCases.map((u) => h('li', {}, u))),
        h(
          'div',
          { class: 'detail-actions' },
          install,
          externalLink(app.websiteUrl, 'Visit website', { class: 'btn btn-secondary btn-large' }),
        ),
        status,
        isInstallable(app) && supportsInstallApi()
          ? h(
              'p',
              { class: 'note' },
              'Your browser will ask you to confirm before anything is installed. Because this app is hosted on another site, it may first ask for permission.',
            )
          : null,
      ),
    ),
    related(app),
  );
}

function related(app) {
  const others = APPS.filter((a) => a.category === app.category && a.id !== app.id).slice(0, 3);
  if (!others.length) return null;
  return h(
    'section',
    { 'aria-labelledby': 'related-title' },
    h('h2', { id: 'related-title' }, `More in ${app.category}`),
    h('div', { class: 'grid' }, others.map((a) => appCard(a))),
  );
}

const SNIPPET_ELEMENT = `<install></install>

el.addEventListener('installresult', (e) => {
  // e.result: 'success' | 'aborted' | 'invalid-data'
});`;

const SNIPPET_API = `button.addEventListener('click', async () => {
  try {
    await navigator.install({
      manifest: 'https://example.com/manifest.webmanifest',
      manifestId: 'https://example.com/app-id',
    });
  } catch (err) {
    // AbortError, DataError, NotAllowedError, ...
  }
});`;

function renderHow() {
  document.title = 'How this works – Contoso App';
  const code = (t) => h('pre', {}, h('code', {}, t));
  view.replaceChildren(
    h('p', {}, h('a', { class: 'link', href: '#/' }, '← Back to catalog')),
    h(
      'article',
      { class: 'prose' },
      h('h1', {}, 'How this works'),
      h(
        'p',
        { class: 'lede' },
        'Contoso App is a static demo of two web platform features that let one site offer to install another site’s web app.',
      ),
      h(
        'div',
        { class: 'compare' },
        h(
          'section',
          {},
          h('h2', {}, h('code', {}, '<install>')),
          h('p', {}, 'A declarative HTML element. The browser renders and controls the button, so it can’t be restyled to look like something else, and it must be visible and stable to be activated.'),
          code(SNIPPET_ELEMENT),
          h('p', {}, 'Used for the Install button in the header, which installs Contoso App itself. With a ', h('code', {}, 'manifest'), ' attribute it can also install another app. Support: ', h('code', {}, "'HTMLInstallElement' in window"), '.'),
        ),
        h(
          'section',
          {},
          h('h2', {}, h('code', {}, 'navigator.install()')),
          h('p', {}, 'A JavaScript API called from a user click, which lets a site design its own button. It returns a promise and rejects when installation doesn’t complete.'),
          code(SNIPPET_API),
          h('p', {}, 'Used to install the apps in the catalog, from both the cards and the detail pages. Support: ', h('code', {}, "typeof navigator.install === 'function'"), '.'),
        ),
      ),
      h('h2', {}, 'Good to know'),
      h(
        'ul',
        {},
        h('li', {}, 'To install another app, pass its manifest URL. When the manifest has no ', h('code', {}, 'id'), ', the app’s ID is its ', h('code', {}, 'start_url'), '; ', h('code', {}, 'manifestId'), ' is optional and must match the computed app ID.'),
        h('li', {}, 'The browser always asks the user to confirm. Cross-origin installs through ', h('code', {}, 'navigator.install()'), ' may show an extra permission prompt first; the declarative element doesn’t.'),
        h('li', {}, 'Sites can’t install silently, and browser policy can disable installation.'),
        h('li', {}, 'When these features aren’t available, Contoso App falls back to a Visit website link.'),
      ),
      h('h2', {}, 'Learn more'),
      h(
        'ul',
        {},
        h('li', {}, externalLink('https://github.com/MicrosoftEdge/Demos/tree/main/pwa-store', 'Source code for this demo')),
        h('li', {}, externalLink('https://github.com/WICG/install-element/blob/main/explainer-manifest-url.md', '<install> element explainer')),
        h('li', {}, externalLink('https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/WebInstall/explainer.md', 'Web Install API explainer')),
      ),
    ),
  );
}

function renderAbout() {
  document.title = 'About – Contoso App';
  view.replaceChildren(
    h('p', {}, h('a', { class: 'link', href: '#/' }, '← Back to catalog')),
    h(
      'article',
      { class: 'prose' },
      h('h1', {}, 'About this demo'),
      h('p', { class: 'lede' }, 'Contoso App is a small, curated demo of discovering and installing web apps.'),
      h('p', {}, 'It isn’t an official store. Apps shown here are examples, they aren’t endorsed, certified or vetted by Microsoft, and their names belong to their owners. App names, descriptions and links are placeholders pending review.'),
      h('p', {}, h('a', { class: 'link', href: '#/how-it-works' }, 'See how installation works')),
    ),
  );
}

function renderNotFound() {
  view.replaceChildren(
    h('h1', {}, 'App not found'),
    h('p', {}, h('a', { class: 'link', href: '#/' }, 'Back to the catalog')),
  );
}

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [page, slug] = hash.split('/');
  document.title = 'Contoso App – Discover and install useful apps for the web';
  const searchForm = document.getElementById('search-form');
  searchForm.hidden = categoryNav.hidden = page !== '';

  if (page === 'app' && slug) renderDetail(decodeURIComponent(slug));
  else if (page === 'how-it-works') renderHow();
  else if (page === 'about') renderAbout();
  else if (page === '') renderCatalog();
  else renderNotFound();

  window.scrollTo(0, 0);
  view.focus({ preventScroll: true });
}

function renderCategories() {
  categoryNav.replaceChildren(
    ...['All', ...CATEGORIES].map((name) => {
      const b = h('button', { type: 'button', 'aria-pressed': String(state.category === name) }, name);
      b.addEventListener('click', () => {
        state.category = name;
        renderCategories();
        if (location.hash.replace(/^#\/?/, '') === '') view.refreshGrid?.();
        else location.hash = '#/';
      });
      return b;
    }),
  );
}

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  if (location.hash.replace(/^#\/?/, '') === '') view.refreshGrid?.();
  else location.hash = '#/';
});
document.getElementById('search-form').addEventListener('submit', (e) => e.preventDefault());
// The hash is used for routing, so move focus manually instead of following #view.
document.querySelector('.skip').addEventListener('click', (e) => {
  e.preventDefault();
  view.focus();
});

setupSelfInstall(document.getElementById('self-install'), document.getElementById('self-status'));
renderCategories();
window.addEventListener('hashchange', route);
route();
