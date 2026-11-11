# Portfolio Asset Minifier
# Minifies style.css -> style.min.css and app.js -> app.min.js

$rootDir = if (Test-Path "$PSScriptRoot\..\index.html") {
    (Resolve-Path "$PSScriptRoot\..").Path
} elseif (Test-Path "$PSScriptRoot\index.html") {
    $PSScriptRoot
} else {
    $pwd.Path
}

$cssPath = Join-Path $rootDir "assets\css\style.css"
$minCssPath = Join-Path $rootDir "assets\css\style.min.css"
$jsPath = Join-Path $rootDir "assets\js\app.js"
$minJsPath = Join-Path $rootDir "assets\js\app.min.js"

if (Test-Path $cssPath) {
    $rawCss = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)
    # Remove CSS comments
    $minCss = [System.Text.RegularExpressions.Regex]::Replace($rawCss, '(?s)/\*.*?\*/', '')
    # Normalize whitespace
    $minCss = [System.Text.RegularExpressions.Regex]::Replace($minCss, '\r\n', ' ')
    $minCss = [System.Text.RegularExpressions.Regex]::Replace($minCss, '\n', ' ')
    $minCss = [System.Text.RegularExpressions.Regex]::Replace($minCss, '\s+', ' ')
    # Safe symbol spacing (preserve + and - for calc)
    $minCss = [System.Text.RegularExpressions.Regex]::Replace($minCss, '\s*([{}:;,>~])\s*', '$1')
    $minCss = $minCss.Replace(';}', '}')
    $minCss = $minCss.Trim()

    [System.IO.File]::WriteAllText($minCssPath, $minCss, [System.Text.Encoding]::UTF8)
    $saving = [Math]::Round((1 - ($minCss.Length / $rawCss.Length)) * 100)
    Write-Host "CSS: $($rawCss.Length) -> $($minCss.Length) bytes (-$saving%)"
}

if (Test-Path $jsPath) {
    $rawJs = [System.IO.File]::ReadAllText($jsPath, [System.Text.Encoding]::UTF8)
    # Remove block comments
    $minJs = [System.Text.RegularExpressions.Regex]::Replace($rawJs, '(?s)/\*.*?\*/', '')
    # Remove line comments that are not URLs
    $minJs = [System.Text.RegularExpressions.Regex]::Replace($minJs, '(?m)^\s*//.*$', '')
    # Normalize newlines and excessive whitespace
    $minJs = [System.Text.RegularExpressions.Regex]::Replace($minJs, '\r\n', "`n")
    $minJs = [System.Text.RegularExpressions.Regex]::Replace($minJs, '[ \t]+', ' ')
    $minJs = [System.Text.RegularExpressions.Regex]::Replace($minJs, '\n\s*\n', "`n")
    $minJs = $minJs.Trim()

    [System.IO.File]::WriteAllText($minJsPath, $minJs, [System.Text.Encoding]::UTF8)
    $saving = [Math]::Round((1 - ($minJs.Length / $rawJs.Length)) * 100)
    Write-Host "JS:  $($rawJs.Length) -> $($minJs.Length) bytes (-$saving%)"
}

Write-Host "Build complete! Assets updated."
