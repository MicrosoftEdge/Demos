/* ============================================================
   Focusgroup Demo — Accordion
   ============================================================
   focusgroup handles arrow-key navigation between headers.
   This file handles the remaining application logic:
     - Toggling aria-expanded and the hidden attribute on panels

   For accordions with the "accordion-focus-into" class,
   expanding a section also moves focus into the panel. This
   mitigates the risk of long panel content being skipped
   when arrow keys jump between headers. The panel is a
   focusable scrollable region (tabindex="0") with
   focusgroup="none", so arrow keys scroll its content.

   Requires shared.js to be loaded first.
   ============================================================ */

(function () {
    "use strict";

    function initAccordions() {
        document.querySelectorAll(".accordion").forEach(function (accordion) {
            var focusInto = accordion.classList.contains("accordion-focus-into");

            accordion.querySelectorAll("h3 button[aria-controls]").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var expanded = btn.getAttribute("aria-expanded") === "true";
                    btn.setAttribute("aria-expanded", String(!expanded));
                    btn.classList.toggle("expanded", !expanded);

                    var panel = document.getElementById(btn.getAttribute("aria-controls"));
                    if (panel) {
                        panel.hidden = expanded;

                        // Mitigation: move focus into the panel on expand
                        // so arrow keys scroll its content instead of
                        // jumping to the next accordion header.
                        if (!expanded && focusInto) {
                            panel.focus();
                        }
                    }
                });
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initAccordions();
    });
})();
