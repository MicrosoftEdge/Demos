window.onload = function () {
  if (HTMLElement.prototype.hasOwnProperty("popover")) {
    document.documentElement.classList.toggle('no-popup', false);
    return;
  }
  
  document.documentElement.classList.toggle('no-popup', true);

  const popovers = [...document.querySelectorAll('[popover]')];

  popovers.forEach(popover => {
    popover.showPopover = function () {
      popover.removeAttribute('hidden');
    }
    popover.hidePopover = function () {
      popover.setAttribute('hidden', '');
    };

    popover.setAttribute('hidden', '');
  });

  addEventListener('click', e => {
    const popover = popovers.find(popover => !popover.hasAttribute('hidden'));
    if (popover) {
      popover.hidePopover();
    }
  }, true);
}
