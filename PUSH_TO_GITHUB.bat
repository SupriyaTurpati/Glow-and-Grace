@echo off
title Pushing Glow and Grace to GitHub
setlocal

set "GIT_PATH=C:\Users\ASUS\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
set "PATH=%GIT_PATH%;%PATH%"

cd /d "%~dp0"

echo ======================================================================
echo    GLOW AND GRACE - PUSHING TO GITHUB
echo    Target: https://github.com/SupriyaTurpati/Glow-and-Grace.git
echo ======================================================================
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/SupriyaTurpati/Glow-and-Grace.git
git branch -M main

echo Uploading project files to GitHub main branch...
echo (If a GitHub sign-in window pops up, click 'Sign in with browser' to approve)
echo.

git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo   [SUCCESS] Code successfully pushed to GitHub!
    echo   Link: https://github.com/SupriyaTurpati/Glow-and-Grace
    echo ======================================================================
    echo.
    echo Press any key to open Vercel and publish your live website...
    pause >nul
    start https://vercel.com/new
) else (
    echo.
    echo ======================================================================
    echo   [NOTE] If authentication is needed, you can also use a GitHub 
    echo   Personal Access Token (classic) with 'repo' scope.
    echo ======================================================================
    echo.
    pause
)
