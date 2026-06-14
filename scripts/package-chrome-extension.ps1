$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$extensionDir = Join-Path $repoRoot "chrome-extension"
$manifestPath = Join-Path $extensionDir "manifest.json"
$distDir = Join-Path $repoRoot "dist"

if (-not (Test-Path -LiteralPath $manifestPath)) {
    throw "Missing manifest: $manifestPath"
}

$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$version = $manifest.version
if (-not $version) {
    throw "manifest.json does not contain a version"
}

New-Item -ItemType Directory -Force -Path $distDir | Out-Null
$zipPath = Join-Path $distDir "nvda-doc-language-switcher-chrome-$version.zip"
if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

$requiredFiles = @(
    "manifest.json",
    "nvda-doc-language-switcher.js",
    "icons/icon16.png",
    "icons/icon32.png",
    "icons/icon48.png",
    "icons/icon128.png"
)

foreach ($relativePath in $requiredFiles) {
    $path = Join-Path $extensionDir $relativePath
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing extension file: $relativePath"
    }
}

Push-Location $extensionDir
try {
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::Open(
        $zipPath,
        [System.IO.Compression.ZipArchiveMode]::Create
    )

    try {
        $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
        $entries = @(
            @{ Source = "manifest.json"; Entry = "manifest.json" },
            @{ Source = "nvda-doc-language-switcher.js"; Entry = "nvda-doc-language-switcher.js" },
            @{ Source = "icons/icon16.png"; Entry = "icons/icon16.png" },
            @{ Source = "icons/icon32.png"; Entry = "icons/icon32.png" },
            @{ Source = "icons/icon48.png"; Entry = "icons/icon48.png" },
            @{ Source = "icons/icon128.png"; Entry = "icons/icon128.png" }
        )

        foreach ($entry in $entries) {
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip,
                (Join-Path $extensionDir $entry.Source),
                $entry.Entry,
                $compressionLevel
            ) | Out-Null
        }
    }
    finally {
        $zip.Dispose()
    }
}
finally {
    Pop-Location
}

Write-Host "Created $zipPath"
