(function (root) {
  "use strict";

  const ENGLISH_LOCALE = "en";
  const FALLBACK_LOCAL_LOCALE = "zh_CN";
  const STORAGE_KEY = "nvda-doc-language-switcher-local-locale";
  const SWITCHER_ID = "nvda-doc-language-switcher";
  const KNOWN_NVDA_LOCALES = new Set([
    "am",
    "an",
    "ar",
    "bg",
    "bs",
    "ca",
    "cs",
    "da",
    "de",
    "de_CH",
    "el",
    "en",
    "es",
    "es_CO",
    "fa",
    "fi",
    "fr",
    "ga",
    "gl",
    "he",
    "hi",
    "hr",
    "hu",
    "id",
    "is",
    "it",
    "ja",
    "km",
    "ko",
    "ky",
    "mk",
    "mn",
    "my",
    "nb_NO",
    "ne",
    "nl",
    "pl",
    "pt_BR",
    "pt_PT",
    "ro",
    "ru",
    "sk",
    "sl",
    "sq",
    "sr",
    "sv",
    "ta",
    "tr",
    "uk",
    "vi",
    "zh_CN",
    "zh_TW",
  ]);
  const DEFAULT_REGIONAL_LOCALES = {
    nb: "nb_NO",
    pt: "pt_BR",
    zh: "zh_CN",
  };
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

  function normalizeLocale(locale) {
    if (!locale || typeof locale !== "string") {
      return "";
    }

    const parts = locale.trim().replace(/-/g, "_").split("_").filter(Boolean);
    if (parts.length === 0) {
      return "";
    }

    const language = parts[0].toLowerCase();
    const region = parts
      .slice(1)
      .find((part) => /^[a-z]{2}$/i.test(part) || /^\d{3}$/.test(part));

    return region ? `${language}_${region.toUpperCase()}` : language;
  }

  function resolveAvailableLocale(locale) {
    const normalizedLocale = normalizeLocale(locale);
    if (!normalizedLocale || normalizedLocale === ENGLISH_LOCALE) {
      return null;
    }

    if (KNOWN_NVDA_LOCALES.has(normalizedLocale)) {
      return normalizedLocale;
    }

    const baseLocale = normalizedLocale.split("_")[0];
    if (baseLocale === ENGLISH_LOCALE) {
      return null;
    }

    if (KNOWN_NVDA_LOCALES.has(baseLocale)) {
      return baseLocale;
    }

    const regionalLocale = DEFAULT_REGIONAL_LOCALES[baseLocale];
    if (regionalLocale && KNOWN_NVDA_LOCALES.has(regionalLocale)) {
      return regionalLocale;
    }

    return null;
  }

  function getStoredLocalLocale(win) {
    try {
      return (
        win &&
        win.localStorage &&
        normalizeLocale(win.localStorage.getItem(STORAGE_KEY))
      );
    } catch (error) {
      return "";
    }
  }

  function rememberCurrentLocale(info, win) {
    if (!win || info.currentLocale.toLowerCase() === ENGLISH_LOCALE) {
      return;
    }

    const locale = normalizeLocale(info.currentLocale);
    if (!isLanguageSegment(locale)) {
      return;
    }

    try {
      if (win.localStorage) {
        win.localStorage.setItem(STORAGE_KEY, locale);
      }
    } catch (error) {
      // Storage may be unavailable on some local file pages.
    }
  }

  function getPreferredLocalLocale(win) {
    const storedLocale = getStoredLocalLocale(win);
    const resolvedStoredLocale = resolveAvailableLocale(storedLocale);
    if (resolvedStoredLocale) {
      return resolvedStoredLocale;
    }

    const languages = (win && win.navigator && win.navigator.languages) || [];
    const languageCandidates = languages.length
      ? languages
      : [win && win.navigator && win.navigator.language].filter(Boolean);

    for (const language of languageCandidates) {
      const locale = resolveAvailableLocale(language);
      if (locale) {
        return locale;
      }
    }

    return FALLBACK_LOCAL_LOCALE;
  }

  function getTargetLocale(info, win) {
    const currentLocale = info.currentLocale.toLowerCase();

    if (currentLocale === ENGLISH_LOCALE) {
      return getPreferredLocalLocale(win);
    }

    return ENGLISH_LOCALE;
  }

  function formatLocaleForDisplay(locale) {
    return locale.replace("_", "-");
  }

  function formatLocaleName(locale) {
    const localeForDisplay = formatLocaleForDisplay(locale);
    try {
      if (typeof Intl !== "undefined" && Intl.DisplayNames) {
        const displayNames = new Intl.DisplayNames(["en"], {
          type: "language",
        });
        const displayName = displayNames.of(localeForDisplay);
        if (displayName) {
          return displayName.charAt(0).toUpperCase() + displayName.slice(1);
        }
      }
    } catch (error) {
      // Older browsers can fall back to the BCP 47 language tag.
    }

    return localeForDisplay;
  }

  function buildTarget(info, win) {
    const targetLocale = getTargetLocale(info, win);
    const targetLanguage = formatLocaleForDisplay(targetLocale);
    const targetLanguageName = formatLocaleName(targetLocale);
    const targetUrl = new URL(info.sourceUrl.href);
    targetUrl.pathname = info.prefixSegments
      .concat([targetLocale], info.documentPath)
      .join("/");

    return {
      href: targetUrl.href,
      label:
        targetLocale === ENGLISH_LOCALE
          ? "View English version"
          : `View ${targetLanguageName} version`,
      hreflang: targetLanguage,
    };
  }

  function buildTargetForHref(href, win) {
    const info = getDocumentInfo(href);
    if (!info) {
      return null;
    }

    rememberCurrentLocale(info, win);
    return buildTarget(info, win);
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

    const target = buildTargetForHref(win.location.href, win);
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
    link.lang = "en";

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
