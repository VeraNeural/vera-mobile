# VERA Web Server Startup Script
# This bypasses turbo and runs ONLY Next.js dev server
# Port: localhost:3000
# Safe to re-run anytime - kills old processes automatically

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "  VERA Web Server Launcher" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Kill any existing node processes
Write-Host "[1/4] Clearing old processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null
Start-Sleep -Seconds 1
Write-Host "      ✓ Done" -ForegroundColor Green

# Navigate to web app directory
Write-Host "[2/4] Navigating to web directory..." -ForegroundColor Yellow
Set-Location c:\vera-mobile\apps\web
Write-Host "      ✓ Ready at: $(Get-Location)" -ForegroundColor Green

# Start Next.js
Write-Host "[3/4] Booting Next.js dev server..." -ForegroundColor Yellow
Write-Host "      ⏳ Wait 5-10 seconds for full boot..." -ForegroundColor Cyan
Write-Host ""

& npx next dev --port 3000

Write-Host ""
Write-Host "Server stopped. To restart, re-run this script." -ForegroundColor Yellow
