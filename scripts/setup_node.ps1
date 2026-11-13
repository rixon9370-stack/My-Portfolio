$ErrorActionPreference = "Stop"
$toolsDir = Join-Path $env:LOCALAPPDATA "Programs\nodejs"
if (!(Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
}
$nodeExe = Join-Path $toolsDir "node.exe"
if (!(Test-Path $nodeExe)) {
    $zipUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
    $zipFile = Join-Path $env:TEMP "node-v20.18.0.zip"
    Write-Host "Downloading Node.js v20.18.0..."
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile
    Write-Host "Extracting Node.js..."
    $extractDir = Join-Path $env:TEMP "node_extract"
    if (Test-Path $extractDir) { Remove-Item -Path $extractDir -Recurse -Force }
    Expand-Archive -Path $zipFile -DestinationPath $extractDir -Force
    Copy-Item -Path (Join-Path $extractDir "node-v20.18.0-win-x64\*") -Destination $toolsDir -Recurse -Force
    Remove-Item -Path $zipFile -Force
    Remove-Item -Path $extractDir -Recurse -Force
}

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$toolsDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$toolsDir", "User")
}
$env:Path = "$toolsDir;$env:Path"

Write-Host "Node version:"
& (Join-Path $toolsDir "node.exe") -v
Write-Host "NPM version:"
& (Join-Path $toolsDir "npm.cmd") -v
