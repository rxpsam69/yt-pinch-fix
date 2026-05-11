// ==UserScript==
// @name         YouTube — Restore Native Pinch-to-Zoom
// @namespace    https://github.com/rxpsam69/yt-pinch-fix
// @version      1.0.0
// @description  Blocks YouTube's pinch-to-zoom hijack and restores native browser zoom.
// @author       rxpsam69
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @run-at       document-start
// @grant        none
// @homepageURL  https://github.com/rxpsam69/yt-pinch-fix
// @supportURL   https://github.com/rxpsam69/yt-pinch-fix/issues
// @downloadURL  https://raw.githubusercontent.com/rxpsam69/yt-pinch-fix/main/youtube-pinch-fix.user.js
// @updateURL    https://raw.githubusercontent.com/rxpsam69/yt-pinch-fix/main/youtube-pinch-fix.user.js
// ==/UserScript==

(function () {
  "use strict";

  const VERBOSE = false;

  const wheelOptions = { capture: true, passive: false };

  function log(...args) {
    if (VERBOSE) console.log("[yt-pinch-fix]", ...args);
  }

  function isPinchEvent(e) {
    return e.type === "wheel" && e.ctrlKey === true;
  }

  function interceptPinch(e) {
    if (!isPinchEvent(e)) return;
    e.stopImmediatePropagation();
    log("Blocked pinch event");
  }

  window.addEventListener("wheel", interceptPinch, wheelOptions);

  const SELECTORS = [
    "ytd-thumbnail .mouseover-overlay",
    "#movie_player",
    ".ytp-gesture-zoom-overlay",
  ];

  function patchOverlays(root) {
    SELECTORS.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => {
        if (el._pinchFixed) return;
        el._pinchFixed = true;

        el.addEventListener(
          "wheel",
          (e) => {
            if (isPinchEvent(e)) e.stopImmediatePropagation();
          },
          wheelOptions
        );
      });
    });
  }

  const observer = new MutationObserver(() => patchOverlays(document));

  function init() {
    if (!document.body) return requestAnimationFrame(init);
    observer.observe(document.body, { childList: true, subtree: true });
    patchOverlays(document);
    log("Loaded");
  }

  init();
})();