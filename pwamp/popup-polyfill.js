window.onload = function () {
  if (Element.prototype.hasOwnProperty("popUp")) {
    return;
  }

  const popups = [...document.querySelectorAll('[popup]')];

  popups.forEach(popup => {
    popup.showPopUp = function () {
      popup.removeAttribute('hidden');
    }
    popup.hidePopUp = function () {
      popup.setAttribute('hidden', '');
    };

    popup.setAttribute('hidden', '');
  });

  addEventListener('click', e => {
    const popup = popups.find(popup => !popup.hasAttribute('hidden'));
    if (popup) {
      popup.hidePopUp();
    }
  }, true);
}
