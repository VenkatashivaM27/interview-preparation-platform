$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$node = Join-Path $root "tools\node-v20.18.0-win-x64"
Set-Location (Join-Path $root "frontend")
& (Join-Path $node "npm.cmd") run dev
