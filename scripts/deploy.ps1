# Cloud Deployment Script
# Requires: VERCEL_TOKEN, RENDER_API_KEY (optional if using interactive login)
# Database: PlanetScale or any MySQL host (set DATABASE_URL, DB_USERNAME, DB_PASSWORD)

param(
    [string]$VercelToken = $env:VERCEL_TOKEN,
    [string]$RenderApiKey = $env:RENDER_API_KEY,
    [string]$DatabaseUrl = $env:DATABASE_URL,
    [string]$DbUsername = $env:DB_USERNAME,
    [string]$DbPassword = $env:DB_PASSWORD,
    [string]$CorsOrigins = $env:CORS_ORIGINS,
    [switch]$SkipFrontend,
    [switch]$SkipBackend
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodeDir = Join-Path $Root "tools\node-v20.18.0-win-x64"
$Maven = Join-Path $Root "tools\apache-maven-3.9.6\bin\mvn.cmd"
$env:PATH = "$NodeDir;" + $env:PATH

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

Write-Step "Building backend"
Set-Location (Join-Path $Root "backend")
& $Maven clean package -DskipTests -q

if (-not $SkipFrontend) {
    Write-Step "Building frontend"
    Set-Location (Join-Path $Root "frontend")
    if (-not $env:VITE_API_URL) {
        Write-Warning "VITE_API_URL not set. Set it to your Render backend URL before building for production."
    }
    npm run build
}

if (-not $SkipBackend) {
    Write-Step "Deploying backend to Render"
    if ($RenderApiKey) {
        $env:RENDER_API_KEY = $RenderApiKey
    }
    npx --yes @renderinc/cli deploy --help 2>$null
    if (-not $RenderApiKey) {
        Write-Host "Run: npx @renderinc/cli login" -ForegroundColor Yellow
        Write-Host "Then create a Web Service from render.yaml at https://dashboard.render.com/blueprints" -ForegroundColor Yellow
    }
}

if (-not $SkipFrontend) {
    Write-Step "Deploying frontend to Vercel"
    Set-Location (Join-Path $Root "frontend")
    $vercelArgs = @("deploy", "--prod", "--yes")
    if ($VercelToken) {
        $vercelArgs += @("--token", $VercelToken)
    }
    npx vercel @vercelArgs
}

Write-Step "Done"
Write-Host @"

Next steps if not fully automated:
1. Database: Create MySQL at https://planetscale.com and set DATABASE_URL, DB_USERNAME, DB_PASSWORD on Render
2. Backend: https://dashboard.render.com -> New Blueprint -> connect GitHub repo -> apply render.yaml
3. Frontend: Set VITE_API_URL to your Render URL, then redeploy Vercel
4. Update CORS_ORIGINS on Render to your Vercel URL

"@ -ForegroundColor Green
