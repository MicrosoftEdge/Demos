const installStoreBtn = document.getElementById("install-store");
const mainEl = document.querySelector("main");
const filtersEl = document.querySelector(".filters");
const appEntryEls = mainEl.querySelectorAll('.app-entry');

// Install the store itself.
installStoreBtn.addEventListener('click', async () => {
  let installation = await navigator.install();

  console.log("Store installed", installation);
});

// Install buttons for individual apps.
mainEl.addEventListener('click', async (e) => {
  const installBtn = e.target;
  const appEntryEl = installBtn.closest('.app-entry');

  if (!appEntryEl || !installBtn.classList.contains('install-button')) {
    return;
  }

  const installUrl = appEntryEl.dataset.installUrl;
  const manifestId = appEntryEl.dataset.manifestId;

  let installation = await navigator.install(installUrl, manifestId);

  console.log("App installed", installation);
});

// Filter apps by category.
filtersEl.addEventListener('click', (e) => {
  const filterBtn = e.target;
  if (!filterBtn.classList.contains('category-filter')) {
    return;
  }

  const category = filterBtn.dataset.category;

  appEntryEls.forEach((entry) => {
    if (category === 'all' || entry.dataset.categories.includes(category)) {
      entry.style.display = '';
    } else {
      entry.style.display = 'none';
    }
  });
});

const init = () => {
  if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: window-controls-overlay)').matches) {
    installStoreBtn.style.display = 'none';
  }
};

init();