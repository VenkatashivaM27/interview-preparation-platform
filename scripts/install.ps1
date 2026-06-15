# Install project dependencies (Node + Maven already in tools/)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $root
$node = Join-Path $root "tools\node-v20.18.0-win-x64"
$maven = Join-Path $root "tools\apache-maven-3.9.6\bin\mvn.cmd"

Write-Host "Installing frontend dependencies..."
Set-Location (Join-Path $root "frontend")
& (Join-Path $node "npm.cmd") install

Write-Host "Building backend..."
Set-Location (Join-Path $root "backend")
& $maven clean compile -DskipTests

Write-Host "Done."
