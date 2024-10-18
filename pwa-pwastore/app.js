// All of the UI DOM elements we need.
const pwinterBtn = document.getElementById("installPwinter");
const pwampBtn = document.getElementById("installPwamp");
const bubbleBtn = document.getElementById("installBubble");

pwinterBtn.addEventListener("click", () => {
  navigator.install("https://diek.us/pwinter/index.html?randomize=true",
                    "https://diek.us/pwinter/")
});

pwampBtn.addEventListener("click", () => {
  navigator.install("https://microsoftedge.github.io/Demos/pwamp/",
                    "https://microsoftedge.github.io/Demos/pwamp/")
});

bubbleBtn.addEventListener("click", () => {
  navigator.install("https://diek.us/bubble/index.html",
                    "https://diek.us/bubble/")
});
