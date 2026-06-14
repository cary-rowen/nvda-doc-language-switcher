# Chrome Web Store Publishing

This repository publishes a Chrome extension.

## Build

Run from the repository root:

```powershell
.\scripts\package-chrome-extension.ps1
```

Upload the generated zip from `dist/`. The zip contains `manifest.json` at the
root.

## Suggested Store Listing

Name:

```text
NVDA Documentation Language Switcher
```

Short description:

```text
Adds English and local-language switch links to NVDA documentation pages.
```

Detailed description:

```text
NVDA Documentation Language Switcher helps readers move between English and
localized NVDA documentation.

On non-English NVDA documentation pages, the extension adds a "View English
version" link near the document heading. On English pages, it adds a link back
to the user's preferred local language, based on browser language preferences or
the most recently visited non-English NVDA documentation language.

The extension supports the NVDA user guide, key commands reference, and change
log on local NVDA installations, official NV Access documentation, historical
release documentation, and the NVDA Chinese community mirror.

The extension does not collect or transmit user data.
```

Category:

```text
Accessibility
```

## Privacy Fields

Use the following values in the Chrome Web Store privacy form:

- Data collection: no user data collected.
- Remote code: no remote code is used.
- Single purpose: add language switch links to supported NVDA documentation
  pages.
- Privacy policy URL:
  `https://github.com/cary-rowen/nvda-doc-language-switcher/blob/main/PRIVACY.md`

## Permissions Notes

The extension does not declare broad `permissions` or `host_permissions`.
Static content scripts run only on supported NVDA documentation URL patterns.

Local `file:///` support cannot be enabled by the extension automatically.
Users who want local NVDA documentation support must open the extension details
page and enable file URL access.

## Submission Steps

1. Create or open a Chrome Web Store developer account.
2. Open the Chrome Web Store Developer Dashboard.
3. Choose "New item".
4. Upload the generated zip.
5. Complete the store listing, privacy fields, screenshots, and support details.
6. Submit for review.
