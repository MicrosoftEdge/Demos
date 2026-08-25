// The catalog of apps that can be installed.
const APPS = [
  {
    btnId: 'btnInstallStore'
  },
  {
    btnId: 'installPwinter',
    manifestUrl: 'https://diek.us/pwinter/manifest.json',
    manifestId: 'https://diek.us/pwinter/index.html?randomize=true'
  },
  {
    btnId: 'installPwamp',
    manifestUrl: 'https://microsoftedge.github.io/Demos/pwamp/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/pwamp/'
  },
  {
    btnId: 'installPwaGettingStarted',
    manifestUrl: 'https://microsoftedge.github.io/Demos/temperature-converter/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/temperature-converter/'
  },
  {
    btnId: 'installEmailClient',
    manifestUrl: 'https://microsoftedge.github.io/Demos/email-client/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/email-client/index.html'
  },
  {
    btnId: 'install1Div',
    manifestUrl: 'https://microsoftedge.github.io/Demos/1DIV/dist/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/1DIV/dist/index.html'
  },
  {
    btnId: 'installWami',
    manifestUrl: 'https://microsoftedge.github.io/Demos/wami/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/wami/'
  },
  {
    btnId: 'installBubble',
    manifestUrl: 'https://diek.us/bubble/manifest.json',
    manifestId: 'https://diek.us/bubble/'
  },
  {
    btnId: 'installappTitle',
    manifestUrl: 'https://microsoftedge.github.io/Demos/pwa-application-title/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/pwa-application-title/'
  }
];

const categoryFilters = document.querySelector('.category_filter_nav');
const appEntries = document.querySelectorAll('main .app_entry');
const installStoreBtn = document.getElementById('btnInstallStore');

for (const appInstallData of APPS) {
  console.log(`Setting up install button for ${appInstallData.btnId}`);

  const installBtn = document.getElementById(appInstallData.btnId);
  if (!installBtn) {
    console.error(`Could not find button with id ${appInstallData.btnId}`);
    continue;
  }

  installBtn.addEventListener('click', async () => {
    try {
      let result = null;
      if (appInstallData.manifestUrl) {
        result = await navigator.install({
          manifest: appInstallData.manifestUrl,
          manifestId: appInstallData.manifestId
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
