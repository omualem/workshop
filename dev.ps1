$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== RentMatch Dev ===" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "[setup] node_modules not found - running npm install..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

if (-not (Test-Path "apps\api\prisma\dev.db")) {
    Write-Host "[setup] Database not found - running first-time setup (migrate + seed)..." -ForegroundColor Yellow
    npm run setup:local
    Write-Host ""
}

foreach ($port in @(3000, 4000)) {
    $procId = (netstat -ano | Select-String ":$port\s" | Select-String "LISTENING" | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1)
    if ($procId) {
        Write-Host "[cleanup] Killing process on port $port (PID $procId)..." -ForegroundColor Yellow
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "[start] Starting API (port 4000) and Web (port 3000)..." -ForegroundColor Green
Write-Host ""

npm run dev
