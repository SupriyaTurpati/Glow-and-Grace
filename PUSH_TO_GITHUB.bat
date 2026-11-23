@echo off
title Pushing Glow and Grace to GitHub
setlocal enabledelayedexpansion

set "GIT_PATH=C:\Users\ASUS\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
set "PATH=%GIT_PATH%;%PATH%"

cd /d "%~dp0"

echo ======================================================================
echo    GLOW AND GRACE - PUSHING TO GITHUB
echo    Target: https://github.com/SupriyaTurpati/Glow-and-Grace.git
echo ======================================================================
echo.

echo [1/3] Checking internet connection to GitHub...
powershell -NoProfile -Command "Clear-DnsClientCache -ErrorAction SilentlyContinue; try { $res = [System.Net.Dns]::GetHostAddresses('github.com'); Write-Output ('GitHub IP: ' + $res[0].IPAddressToString) } catch { Write-Output 'DNS_FAILED' }" > "%temp%\gh_test.txt"

set /p GH_STATUS=<"%temp%\gh_test.txt"
echo Status: %GH_STATUS%

if "%GH_STATUS%"=="DNS_FAILED" (
    echo.
    echo [ERROR] Could not resolve github.com.
    echo Please make sure your computer is connected to the Internet / Wi-Fi,
    echo and then try running this file again.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] Configuring git remote...
git remote remove origin 2>nul
git remote add origin https://github.com/SupriyaTurpati/Glow-and-Grace.git
git branch -M main

echo.
echo [3/3] Uploading project files to GitHub...
echo (If a GitHub sign-in window opens, click 'Sign in with your browser')
echo.

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo   [SUCCESS!] Code successfully uploaded to:
    echo   https://github.com/SupriyaTurpati/Glow-and-Grace
    echo ======================================================================
    echo.
    echo Opening Vercel in your browser to deploy live...
    start https://vercel.com/new
) else (
    echo.
    echo ======================================================================
    echo   [NOTICE] If GitHub requested sign-in, please complete it in your
    echo   browser window and run this script once more.
    echo ======================================================================
)

echo.
pause
