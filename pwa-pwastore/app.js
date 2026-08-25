const categoryFilters = document.querySelector('.category_filter_nav');
const appEntries = document.querySelectorAll('main .app_entry');
const installStoreBtn = document.getElementById('btnInstallStore');

const getAppCategories = (appEntry) => appEntry.dataset.categories.split(/\s+/);
const categories = new Set([...appEntries].flatMap(getAppCategories));

for (const category of [...categories].sort()) {
  const button = document.createElement('button');
  button.className = 'btn_category';
  button.dataset.category = category;
  button.textContent = category;
  button.type = 'button';
  button.setAttribute('aria-pressed', 'false');
  categoryFilters.append(button);
}

const allCategoriesButton = document.createElement('button');
allCategoriesButton.className = 'btn_category';
allCategoriesButton.dataset.category = 'all';
allCategoriesButton.textContent = 'all demos';
allCategoriesButton.type = 'button';
allCategoriesButton.setAttribute('aria-pressed', 'true');
categoryFilters.append(allCategoriesButton);

// Wire the install button for the store itself.
installStoreBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

// Wire the install buttons for each app entry.
for (const appEntryEl of [...appEntries]) {
  const btnEl = appEntryEl.querySelector('.btn_install');
  if (!btnEl) {
    console.error('Could not find install button for app entry', appEntryEl);
    continue;
  }

  const manifestUrl = appEntryEl.dataset.manifestUrl;
  const manifestId = appEntryEl.dataset.manifestId;

  btnEl.addEventListener('click', async () => {
    try {
      let result = null;
      if (manifestUrl && manifestId) {
        result = await navigator.install({
          manifest: manifestUrl,
          manifestId: manifestId
        });
      } else {
        result = await navigator.install();
      }
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  });
}

categoryFilters.addEventListener('click', (event) => {
  const filterButton = event.target.closest('.btn_category');
  if (!filterButton || !categoryFilters.contains(filterButton)) {
    return;
  }

  const category = filterButton.dataset.category;

  for (const button of categoryFilters.querySelectorAll('.btn_category')) {
    button.setAttribute('aria-pressed', String(button === filterButton));
  }

  for (const appEntry of appEntries) {
    appEntry.hidden = category !== 'all' && !getAppCategories(appEntry).includes(category);
  }
});

const init = () => {
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches;

  if (isInstalled) {
    installStoreBtn.style.display = 'none';
  }
};

init();
