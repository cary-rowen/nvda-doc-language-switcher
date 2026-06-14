# Chrome Web Store Publishing

## Build the package

Run from the repository root:

```powershell
.\scripts\package-chrome-extension.ps1
```

Upload the generated zip from `dist/`. The zip must contain `manifest.json` at
the root.

## Developer Dashboard

1. Create or open a Chrome Web Store developer account.
2. Open the Chrome Web Store Developer Dashboard.
3. Choose "New item".
4. Upload the generated zip.
5. Complete the store listing:
   - name: `NVDA Documentation Language Switcher`
   - summary: Adds Chinese/English switch links to NVDA documentation pages.
   - category: Accessibility or Productivity
   - language: English
6. Complete privacy fields:
   - data collection: no user data collected
   - privacy policy: use
     `https://github.com/cary-rowen/nvda-doc-language-switcher/blob/main/PRIVACY.md`
7. Submit for review.

## Local file access

Chrome does not grant `file:///` page access automatically. Users who want local
NVDA documentation support must open the extension details page and enable file
URL access.
