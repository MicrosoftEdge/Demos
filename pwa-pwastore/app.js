// All of the UI DOM elements we need.
const pwinterBtn = document.getElementById("installPwinter");
const pwampBtn = document.getElementById("installPwamp");
const bubbleBtn = document.getElementById("installBubble");
const installBtn = document.getElementById("btnInstallStore");

pwinterBtn.addEventListener('click', () => {
  navigator.install('https://diek.us/pwinter/',
                    'https://diek.us/pwinter/index.html?randomize=true')
});

pwampBtn.addEventListener('click', () => {
  navigator.install('https://microsoftedge.github.io/Demos/pwamp/',
                    'https://microsoftedge.github.io/Demos/pwamp/')
});

bubbleBtn.addEventListener('click', () => {
  navigator.install('https://diek.us/bubble/',
                    'https://diek.us/bubble/index.html')
});

installBtn.addEventListener('click', () => {
  navigator.install();
});

const init = () => {
  if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: window-controls-overlay)').matches) {
    installBtn.style.display = 'none';
  }
};

init();