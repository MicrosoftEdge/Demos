/* ============================================================
   Focusgroup Demo - Listbox
   ============================================================
   focusgroup handles arrow-key navigation between options.
   This file handles the remaining application logic:
   - Setting aria-selected so exactly one option is selected
     (click or Enter/Space to confirm)

   Requires shared.js to be loaded first.
   ============================================================ */

(function () {
  "use strict";

  function initListboxes() {
    initSingleSelect(
      '[focusgroup~="listbox"]',
      ".listbox-option",
      "aria-selected",
      "selected",
      function (target, items) {
        items.forEach(function (item) {
          if (item === target) {
            item.setAttribute("focusgroupstart", "");
          } else {
            item.removeAttribute("focusgroupstart");
          }
        });
      }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    initListboxes();
  });
})();
