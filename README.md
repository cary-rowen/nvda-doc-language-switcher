# NVDA Documentation Language Switcher

Adds a Chinese/English switch link to NVDA documentation pages.

## Tampermonkey userscript

Install `nvda-doc-language-switcher.user.js` from a raw URL ending in `.user.js`.

For local `file:///` NVDA documentation pages, open the browser extension details
page for Tampermonkey and enable access to file URLs.

## Browser extension fallback

If the Tampermonkey installation page is not accessible enough, load the
`browser-extension` folder as an unpacked Chrome/Edge extension.

1. Open `edge://extensions` or `chrome://extensions`.
2. Enable developer mode.
3. Choose "Load unpacked".
4. Select the `browser-extension` folder.
5. Open the extension details and enable access to file URLs if local NVDA
   documentation should be supported.

The extension version does not require Tampermonkey.
