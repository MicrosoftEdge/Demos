
(function () {
  if (!!document.createElement('div').showPopup) {
    return;
  }

  const popups = [...document.querySelectorAll('[popup]')];
  
  popups.forEach(popup => {
    popup.showPopup = function () {
      popup.removeAttribute('hidden');
    }
    popup.hidePopup = function () {
      popup.setAttribute('hidden', '');
    };

    popup.setAttribute('hidden', '');
  });

  addEventListener('click', e => {
    const popup = popups.find(popup => !popup.hasAttribute('hidden'));
    if (popup) {
      popup.hidePopup();
    }
  }, true);
})();
