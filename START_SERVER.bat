@echo off
REM VERA Web Server Starter - Stable Connection
REM This bypasses turbo monorepo parallelization and runs ONLY Next.js
REM Port: localhost:3000
REM
REM Usage: Double-click this file or run it from PowerShell
REM To stop: Ctrl+C in the terminal window

title VERA Server - localhost:3000

taskkill /F /IM node.exe >nul 2>&1

echo.
echo ====================================================
echo   VERA Web Server Starting...
echo   Access at: http://localhost:3000
echo   Ecosystem: http://localhost:3000/ecosystem
echo   Laboratory: http://localhost:3000/laboratory
echo ====================================================
echo.

cd /d c:\vera-mobile\apps\web

echo Booting Next.js dev server...
timeout /t 2 /nobreak

npx next dev --port 3000

pause
