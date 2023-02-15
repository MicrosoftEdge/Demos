const menuToggleBox = document.getElementById("main-menu-button");
const menuToggleLabel = document.querySelector("label[for='main-menu-button']");

addEventListener("click", e => {
  // When clicking outside of the input or label, close the menu.
  if (e.target !== menuToggleBox && e.target !== menuToggleLabel) {
    menuToggleBox.checked = false;
  }
});
