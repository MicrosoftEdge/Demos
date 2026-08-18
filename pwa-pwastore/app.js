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
  try {
    const result = await navigator.install();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

pwinterBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install({
      manifest: 'https://diek.us/pwinter/manifest.json',
      manifestId: 'https://diek.us/pwinter/index.html?randomize=true',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

pwampBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install({
      manifest: 'https://microsoftedge.github.io/Demos/pwamp/manifest.json',
      manifestId: 'https://microsoftedge.github.io/Demos/pwamp/',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

bubbleBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install({
      manifest: 'https://diek.us/bubble/manifest.json',
      manifestId: 'https://diek.us/bubble/',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

tempConvBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install({
      manifest: 'https://microsoftedge.github.io/Demos/temperature-converter/manifest.json',
      manifestId: 'https://microsoftedge.github.io/Demos/temperature-converter/',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

emailClientBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install({
      manifest: 'https://microsoftedge.github.io/Demos/email-client/manifest.json',
      manifestId: 'https://microsoftedge.github.io/Demos/email-client/index.html',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

oneDivBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install({
      manifest: 'https://microsoftedge.github.io/Demos/1DIV/dist/manifest.json',
      manifestId: 'https://microsoftedge.github.io/Demos/1DIV/dist/index.html',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

wamiBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install({
      manifest: 'https://microsoftedge.github.io/Demos/wami/manifest.json',
      manifestId: 'https://microsoftedge.github.io/Demos/wami/',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

appTitleBtn.addEventListener('click', async () => {
  try {
    const result = await navigator.install({
      manifest: 'https://microsoftedge.github.io/Demos/pwa-application-title/manifest.json',
      manifestId: 'https://microsoftedge.github.io/Demos/pwa-application-title/',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

const init = () => {
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches;

  if (isInstalled) {
    installBtn.style.display = 'none';
  }
};

init();