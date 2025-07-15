// All of the UI DOM elements we need.
const installBtn = document.getElementById("btnInstallStore");
const pwinterBtn = document.getElementById("installPwinter");
const pwampBtn = document.getElementById("installPwamp");
const tempConvBtn = document.getElementById("installPwaGettingStarted");
const emailClientBtn = document.getElementById("installEmailClient");
const oneDivBtn = document.getElementById("install1Div");
const wamiBtn = document.getElementById("installWami");
const bubbleBtn = document.getElementById("installBubble");
const appTitleBtn = document.getElementById("installappTitle");


installBtn.addEventListener('click', async () => {
  let installation = await navigator.install();
});

pwinterBtn.addEventListener('click', async () => {
  let installation = await navigator.install('https://diek.us/pwinter/',
                    'https://diek.us/pwinter/index.html?randomize=true');
});

pwampBtn.addEventListener('click', async () => {
  let installation = await navigator.install('https://microsoftedge.github.io/Demos/pwamp/',
                    'https://microsoftedge.github.io/Demos/pwamp/');
});

bubbleBtn.addEventListener('click', async () => {
  let installation = await navigator.install('https://diek.us/bubble/',
                    'https://diek.us/bubble/index.html');
});

tempConvBtn.addEventListener('click', async () => {
  let installation = await navigator.install('https://microsoftedge.github.io/Demos/pwa-getting-started/index.html', 'https://microsoftedge.github.io/Demos/pwa-getting-started/');

});

emailClientBtn.addEventListener('click', async () => {
  let installation = await navigator.install('https://microsoftedge.github.io/Demos/email-client/',
                    'https://microsoftedge.github.io/Demos/email-client/index.html');
});

oneDivBtn.addEventListener('click', async () => {
  let installation = await navigator.install('https://microsoftedge.github.io/Demos/1DIV/dist/',
                    'https://microsoftedge.github.io/Demos/1DIV/dist/index.html');
}); 

wamiBtn.addEventListener('click', async () => {
  let installation = await navigator.install('https://microsoftedge.github.io/Demos/wami/index.html', 'https://microsoftedge.github.io/Demos/wami/');
}); 

appTitleBtn.addEventListener('click', async () => {
  let installation = await navigator.install('https://microsoftedge.github.io/Demos/app-title/',
                    'https://microsoftedge.github.io/Demos/app-title/');
}); 


const init = () => {
  if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: window-controls-overlay)').matches) {
    installBtn.style.display = 'none';
  }
};

init();