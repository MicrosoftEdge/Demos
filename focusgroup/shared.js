/* ============================================================
   Focusgroup Demos — Shared Utilities
   ============================================================
   Common code used across multiple demo pages.
   Include this file before any per-page script.
   ============================================================ */

/**
 * Show a warning banner when the browser does not support
 * the focusgroup attribute, so visitors know to enable
 * the experimental flag.
 */
function checkFocusgroupSupport() {
  "use strict";

  if ("focusgroup" in HTMLElement.prototype) {
    return;
  }

  var banner = document.createElement("div");
  banner.className = "warning-banner";
  banner.setAttribute("role", "alert");
  banner.innerHTML =
    "<strong>⚠ focusgroup is not supported in this browser.</strong> " +
    "The <code>focusgroup</code> attribute is an experimental feature. " +
    "To try these demos, use Microsoft Edge or another Chromium-based browser " +
    "and enable the <em>Experimental Web Platform features</em> flag " +
    "at <code>about://flags/#enable-experimental-web-platform-features</code>.";

  var target = document.querySelector(".page-content") || document.body;
  target.prepend(banner);
}

/**
 * Set up single-select behavior for a group of items.
 * Adds click and Enter/Space handlers that toggle a boolean
 * ARIA attribute (e.g. aria-checked or aria-selected) so that
 * exactly one item in the group is "on" at a time.
 *
 * @param {string} containerSelector  CSS selector for the container(s)
 * @param {string} itemSelector     CSS selector for selectable items
 * @param {string} ariaAttr       ARIA attribute name ("aria-checked" or "aria-selected")
 * @param {string} [selectedClass]  CSS class to toggle on the selected item
 * @param {Function} [afterSelect]  Optional callback called with (target, items) after each selection
 */
function initSingleSelect(containerSelector, itemSelector, ariaAttr, selectedClass, afterSelect) {
  "use strict";

  document.querySelectorAll(containerSelector).forEach(function (container) {
    var items = Array.from(container.querySelectorAll(itemSelector));

    function select(target) {
      items.forEach(function (item) {
        var isSelected = item === target;
        item.setAttribute(ariaAttr, String(isSelected));
        if (selectedClass) {
          item.classList.toggle(selectedClass, isSelected);
        }
      });
      if (afterSelect) {
        afterSelect(target, items);
      }
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        select(item);
      });
      item.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          select(item);
        }
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  checkFocusgroupSupport();
});
