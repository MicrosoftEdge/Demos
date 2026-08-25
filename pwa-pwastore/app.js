const categoryFilters = document.querySelector('.category_filter_nav');
const appEntries = document.querySelectorAll('main .app_entry');
const installStoreBtn = document.getElementById('btnInstallStore');

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

  console.log(`Setting up install button for ${btnEl.id}`);

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

  for (const appEntry of appEntries) {
    const categories = appEntry.dataset.categories.split(' ');
    appEntry.hidden = category !== 'all' && !categories.includes(category);
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
