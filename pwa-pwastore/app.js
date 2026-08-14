// All of the UI DOM elements we need.
const installBtn = document.getElementById('btnInstallStore');
const pwinterBtn = document.getElementById('installPwinter');
const pwampBtn = document.getElementById('installPwamp');
const tempConvBtn = document.getElementById('installPwaGettingStarted');
const emailClientBtn = document.getElementById('installEmailClient');
const oneDivBtn = document.getElementById('install1Div');
const wamiBtn = document.getElementById('installWami');
const bubbleBtn = document.getElementById('installBubble');
const appTitleBtn = document.getElementById('installappTitle');

installBtn.addEventListener('click', async () => {
  await navigator.install();
});

pwinterBtn.addEventListener('click', async () => {
  await navigator.install({
    manifest: 'https://diek.us/pwinter/manifest.json',
    manifestId: 'https://diek.us/pwinter/index.html?randomize=true',
  });
});

pwampBtn.addEventListener('click', async () => {
  await navigator.install({
    manifest: 'https://microsoftedge.github.io/Demos/pwamp/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/pwamp/',
  });
});

bubbleBtn.addEventListener('click', async () => {
  await navigator.install({
    manifest: 'https://diek.us/bubble/manifest.json',
    manifestId: 'https://diek.us/bubble/',
  });
});

tempConvBtn.addEventListener('click', async () => {
  await navigator.install({
    manifest: 'https://microsoftedge.github.io/Demos/temperature-converter/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/temperature-converter/',
  });
});

emailClientBtn.addEventListener('click', async () => {
  await navigator.install({
    manifest: 'https://microsoftedge.github.io/Demos/email-client/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/email-client/index.html',
  });
});

oneDivBtn.addEventListener('click', async () => {
  await navigator.install({
    manifest: 'https://microsoftedge.github.io/Demos/1DIV/dist/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/1DIV/dist/index.html',
  });
});

wamiBtn.addEventListener('click', async () => {
  await navigator.install({
    manifest: 'https://microsoftedge.github.io/Demos/wami/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/wami/',
  });
});

appTitleBtn.addEventListener('click', async () => {
  await navigator.install({
    manifest: 'https://microsoftedge.github.io/Demos/pwa-application-title/manifest.json',
    manifestId: 'https://microsoftedge.github.io/Demos/pwa-application-title/',
  });
});

const init = () => {
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches;

  if (isInstalled) {
    installBtn.style.display = 'none';
  }
};

init();