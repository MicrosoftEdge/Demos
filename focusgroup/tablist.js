/* ============================================================
   Focusgroup Demo - Tablist
   ============================================================
   focusgroup handles arrow-key navigation between tabs.
   This file handles the remaining application logic:
   - Setting aria-selected on the active tab
   - Showing/hiding the associated tabpanel
   - Moving focusgroupstart to the active tab (so that
     nomemory re-entry always lands on the selected tab)

   Selection follows focus ("follow focus" tabs).

   Requires shared.js to be loaded first.
   ============================================================ */

(function () {
  "use strict";

  function initTabPanels() {
    document.querySelectorAll('[focusgroup~="tablist"]').forEach(function (tablist) {
      var tabs = Array.from(tablist.querySelectorAll(".tab"));

      function selectTab(tab) {
        tabs.forEach(function (t) {
          var isSelected = t === tab;

          // Mark selected state
          t.setAttribute("aria-selected", String(isSelected));
          t.classList.toggle("selected", isSelected);

          // Move the focusgroup entry point to the active tab
          if (isSelected) {
            t.setAttribute("focusgroupstart", "");
          } else {
            t.removeAttribute("focusgroupstart");
          }

          // Show/hide the linked panel
          var panelId = t.getAttribute("aria-controls");
          if (panelId) {
            var panel = document.getElementById(panelId);
            if (panel) {
              panel.hidden = !isSelected;
            }
          }
        });
      }

      tabs.forEach(function (tab) {
        tab.addEventListener("focus", function () { selectTab(tab); });
        tab.addEventListener("click", function () { selectTab(tab); });
        tab.addEventListener("keydown", function (e) {
          if (e.key === "Home") {
            e.preventDefault();
            tabs[0].focus();
          } else if (e.key === "End") {
            e.preventDefault();
            tabs[tabs.length - 1].focus();
          }
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTabPanels();
  });
})();
