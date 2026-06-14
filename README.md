# NVDA Documentation Language Switcher

Adds an English link to Chinese NVDA documentation pages and a Chinese link to
English NVDA documentation pages.

Supported documents:

- `userGuide.html`
- `keyCommands.html`
- `changes.html`

Supported locations:

- Local NVDA documentation under `file:///.../NVDA/documentation/...`
- `https://download.nvaccess.org/documentation/...`
- `https://download.nvaccess.org/releases/.../documentation/...`
- `https://download.nvaccess.mirror.nvdadr.com/documentation/...`
- `https://www.nvaccess.org/files/nvda/documentation/...`

## Tampermonkey userscript

Install from:

```text
https://raw.githubusercontent.com/cary-rowen/nvda-doc-language-switcher/main/nvda-doc-language-switcher.user.js
```

For local `file:///` NVDA documentation pages, open the browser extension details
page for Tampermonkey and enable access to file URLs.

## Chrome extension

The Chrome extension source is in `chrome-extension`.

For local testing:

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable developer mode.
3. Choose "Load unpacked".
4. Select the `chrome-extension` folder.
5. Open the extension details and enable access to file URLs if local NVDA
   documentation should be supported.

To create the Chrome Web Store upload package:

```powershell
.\scripts\package-chrome-extension.ps1
```

The package is written to `dist/` with `manifest.json` at the zip root.

Chrome Web Store publishing notes are in `docs/chrome-web-store.md`.

## Privacy

The extension does not collect, store, transmit, sell, or share user data. See
`PRIVACY.md`.
