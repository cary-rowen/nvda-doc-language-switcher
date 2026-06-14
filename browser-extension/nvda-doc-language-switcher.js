// ==UserScript==
// @name         NVDA documentation Chinese/English switcher
// @namespace    https://www.nvaccess.org/
// @version      1.0.0
// @description  Add Chinese/English switch links to local, official, and mirror NVDA documentation pages.
// @author       cary
// @downloadURL  https://raw.githubusercontent.com/cary-rowen/nvda-doc-language-switcher/main/nvda-doc-language-switcher.user.js
// @updateURL    https://raw.githubusercontent.com/cary-rowen/nvda-doc-language-switcher/main/nvda-doc-language-switcher.user.js
// @match        https://download.nvaccess.org/*
// @match        https://download.nvaccess.mirror.nvdadr.com/*
// @match        https://www.nvaccess.org/files/nvda/documentation/*
// @include      file://*/documentation/*.html
// @include      file://*/documentation/*/*.html
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function (root) {
  "use strict";

  const CHINESE_LOCALE = "zh_CN";
  const ENGLISH_LOCALE = "en";
  const SWITCHER_ID = "nvda-doc-language-switcher";
  const SUPPORTED_DOC_FILES = new Set([
    "changes.html",
    "keyCommands.html",
    "userGuide.html",
  ]);
  const SUPPORTED_HTTP_HOSTS = new Set([
    "download.nvaccess.org",
    "download.nvaccess.mirror.nvdadr.com",
    "www.nvaccess.org",
  ]);
  const LANGUAGE_SEGMENT_RE = /^[a-z]{2}(?:_[A-Z]{2})?$/;

  function isSupportedLocation(url) {
    if (url.protocol === "file:") {
      return true;
    }

    if (!SUPPORTED_HTTP_HOSTS.has(url.hostname)) {
      return false;
    }

    const pathname = url.pathname.toLowerCase();
    if (url.hostname === "www.nvaccess.org") {
      return pathname.includes("/files/nvda/documentation/");
    }

    return pathname.includes("/documentation/");
  }

  function isLanguageSegment(segment) {
    return LANGUAGE_SEGMENT_RE.test(segment);
  }

  function getDocumentInfo(href) {
    const url = new URL(href);
    if (!isSupportedLocation(url)) {
      return null;
    }

    const segments = url.pathname.split("/");
    const docIndex = segments.findIndex(
      (segment) => segment.toLowerCase() === "documentation",
    );
    if (docIndex < 0) {
      return null;
    }

    const afterDocumentation = segments.slice(docIndex + 1).filter(Boolean);
    if (afterDocumentation.length === 0) {
      return null;
    }

    const hasLanguageSegment =
      afterDocumentation.length > 1 && isLanguageSegment(afterDocumentation[0]);
    const currentLocale = hasLanguageSegment
      ? afterDocumentation[0]
      : ENGLISH_LOCALE;
    const documentPath = hasLanguageSegment
      ? afterDocumentation.slice(1)
      : afterDocumentation;
    const fileName = documentPath[documentPath.length - 1];

    if (!SUPPORTED_DOC_FILES.has(fileName)) {
      return null;
    }

    return {
      currentLocale,
      documentPath,
      prefixSegments: segments.slice(0, docIndex + 1),
      sourceUrl: url,
    };
  }

  function buildTarget(info) {
    const currentLocale = info.currentLocale.toLowerCase();
    const targetLocale =
      currentLocale === ENGLISH_LOCALE ? CHINESE_LOCALE : ENGLISH_LOCALE;
    const targetUrl = new URL(info.sourceUrl.href);
    targetUrl.pathname = info.prefixSegments
      .concat([targetLocale], info.documentPath)
      .join("/");

    return {
      href: targetUrl.href,
      label:
        targetLocale === CHINESE_LOCALE
          ? "\u67e5\u770b\u4e2d\u6587\u7248"
          : "\u67e5\u770b\u82f1\u6587\u7248",
      hreflang: targetLocale === CHINESE_LOCALE ? "zh-CN" : "en",
    };
  }

  function buildTargetForHref(href) {
    const info = getDocumentInfo(href);
    return info ? buildTarget(info) : null;
  }

  function ensureStyle(doc) {
    if (doc.getElementById(`${SWITCHER_ID}-style`)) {
      return;
    }

    const style = doc.createElement("style");
    style.id = `${SWITCHER_ID}-style`;
    style.textContent = `
      #${SWITCHER_ID} {
        margin: 0.5em 0 1em;
      }

      #${SWITCHER_ID} a {
        display: inline-block;
        padding: 0.25em 0.55em;
        border: 1px solid currentColor;
        border-radius: 0.25em;
        text-decoration: none;
      }

      #${SWITCHER_ID} a:hover,
      #${SWITCHER_ID} a:focus {
        text-decoration: underline;
      }

      #${SWITCHER_ID} a:focus {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }
    `;
    doc.head.appendChild(style);
  }

  function injectSwitcher(win, doc) {
    if (!win || !doc || doc.getElementById(SWITCHER_ID)) {
      return false;
    }

    const target = buildTargetForHref(win.location.href);
    if (!target) {
      return false;
    }

    const nav = doc.createElement("nav");
    nav.id = SWITCHER_ID;
    nav.setAttribute("aria-label", "NVDA documentation language switcher");

    const link = doc.createElement("a");
    link.href = target.href;
    link.textContent = target.label;
    link.hreflang = target.hreflang;
    link.lang = "zh-CN";

    nav.appendChild(link);
    ensureStyle(doc);

    const firstHeading = doc.querySelector("h1");
    if (firstHeading && firstHeading.parentNode) {
      firstHeading.insertAdjacentElement("afterend", nav);
    } else if (doc.body) {
      doc.body.insertBefore(nav, doc.body.firstChild);
    } else {
      return false;
    }

    return true;
  }

  function run() {
    const win = root.window || root;
    const doc = win.document;
    if (!doc) {
      return;
    }

    if (doc.readyState === "loading") {
      doc.addEventListener(
        "DOMContentLoaded",
        () => injectSwitcher(win, doc),
        { once: true },
      );
      return;
    }

    injectSwitcher(win, doc);
  }

  if (typeof module === "object" && module.exports) {
    module.exports = {
      buildTargetForHref,
      getDocumentInfo,
      injectSwitcher,
      isSupportedLocation,
    };
  } else {
    run();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
