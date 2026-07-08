// Small helper shared by the old and new demo apps.
// Each page sets `window.DEMO = { role, id }` before loading this script.
(function () {
  "use strict";
  var cfg = window.DEMO || {};
  var $ = function (sel) { return document.querySelector(sel); };

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches ||
           window.matchMedia("(display-mode: window-controls-overlay)").matches ||
           window.navigator.standalone === true;
  }

  function setStatus(kind, msg) {
    var el = $("#status");
    if (!el) { return; }
    el.dataset.kind = kind;
    el.textContent = msg;
  }

  var deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var btn = $("#install-btn");
    if (btn) { btn.hidden = false; }
    if (!isStandalone()) {
      setStatus("installable", "Installable \u2014 click \u201cInstall this app\u201d, then follow the steps below.");
    }
  });

  window.addEventListener("appinstalled", function () {
    setStatus("installed", "Installed \u2714  Now follow the migration steps below.");
    var btn = $("#install-btn");
    if (btn) { btn.hidden = true; }
  });

  function wireInstall() {
    var btn = $("#install-btn");
    if (!btn) { return; }
    btn.addEventListener("click", function () {
      if (!deferredPrompt) {
        setStatus("idle", "No install prompt available. Use the browser\u2019s address-bar install icon.");
        return;
      }
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choice) {
        deferredPrompt = null;
        btn.hidden = true;
        if (choice.outcome === "accepted") {
          setStatus("installed", "Install accepted \u2714  Now follow the migration steps below.");
        } else {
          setStatus("idle", "Install dismissed. Reload to try again.");
        }
      });
    });
  }

  function renderMeta() {
    var linkEl = document.querySelector('link[rel="manifest"]');
    var mEl = $("#manifest-url");
    if (mEl && linkEl) { mEl.textContent = new URL(linkEl.getAttribute("href"), location.href).href; }
    var originEl = $("#origin");
    if (originEl) { originEl.textContent = location.origin; }
    var resolvedIdEl = $("#resolved-id");
    if (resolvedIdEl && cfg.id) { resolvedIdEl.textContent = new URL(cfg.id, location.origin).href; }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (cfg.role) { document.body.dataset.role = cfg.role; }
    renderMeta();
    wireInstall();
    if (isStandalone()) {
      setStatus("running", "Running as an installed app (standalone window). \u2714");
    } else {
      setStatus("idle", "Running in a browser tab. Install this app to test migration.");
    }
  });
})();
