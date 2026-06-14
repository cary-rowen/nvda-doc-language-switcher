# NVDA Documentation Language Switcher

NVDA Documentation Language Switcher is a small Chrome and Edge extension for
people who read NVDA documentation in more than one language.

It adds one accessible language switch link near the top of supported NVDA
documentation pages. Non-English pages link to the English version. English
pages link back to the user's preferred local language, using the browser's
language preferences or the most recently visited non-English NVDA
documentation language.

## Features

- Adds a plain, keyboard-accessible link directly after the document heading.
- Preserves the current heading anchor when switching pages.
- Supports local `file:///` NVDA documentation after the user grants file URL
  access.
- Supports official NV Access documentation, historical release documentation,
  and the NVDA Chinese community mirror.
- Runs only on supported NVDA documentation pages.
- Does not collect, store, transmit, sell, or share user data.

## Supported Documents

- `userGuide.html`
- `keyCommands.html`
- `changes.html`

## Supported Locations

- `file:///.../NVDA/documentation/...`
- `https://download.nvaccess.org/documentation/...`
- `https://download.nvaccess.org/releases/.../documentation/...`
- `https://download.nvaccess.mirror.nvdadr.com/documentation/...`
- `https://www.nvaccess.org/files/nvda/documentation/...`

## Local Installation

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable developer mode.
3. Choose "Load unpacked".
4. Select the `chrome-extension` folder.
5. To use local NVDA documentation, open the extension details page and enable
   access to file URLs.

## Packaging

Run from the repository root:

```powershell
.\scripts\package-chrome-extension.ps1
```

The Chrome Web Store upload package is written to `dist/`.

Chrome Web Store publishing notes are in `docs/chrome-web-store.md`.

## Privacy

See `PRIVACY.md`.
