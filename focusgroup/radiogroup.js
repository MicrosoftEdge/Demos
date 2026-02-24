/* ============================================================
   Focusgroup Demo — Radio Group
   ============================================================
   focusgroup handles arrow-key navigation between options.
   This file handles the remaining application logic:
     - Toggling aria-checked so exactly one option is checked
     - Optional "selection follows focus" mode via a toggle

   The toggle (#selection-follows-focus) lets the user switch
   between two modes:
     - Off (default): arrows only move focus; Enter/Space selects.
     - On: moving focus also selects, matching native <input type="radio">.

   Requires shared.js to be loaded first.
   ============================================================ */

(function () {
    "use strict";

    function initRadioGroups() {
        // Explicit selection via click / Enter / Space
        initSingleSelect(
            '[focusgroup~="radiogroup"]',
            ".radio-option",
            "aria-checked",
            "checked"
        );

        // Selection-follows-focus toggle
        var toggle = document.getElementById("selection-follows-focus");
        if (!toggle) return;

        document.querySelectorAll('[focusgroup~="radiogroup"]').forEach(function (container) {
            var items = Array.from(container.querySelectorAll(".radio-option"));

            items.forEach(function (item) {
                item.addEventListener("focus", function () {
                    if (toggle.checked) {
                        items.forEach(function (i) {
                            var isSelected = i === item;
                            i.setAttribute("aria-checked", String(isSelected));
                            i.classList.toggle("checked", isSelected);
                        });
                    }
                });
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initRadioGroups();
    });
})();
