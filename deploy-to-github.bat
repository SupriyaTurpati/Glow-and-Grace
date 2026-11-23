@echo off
setlocal
echo ========================================================
echo   Glow and Grace - Quick GitHub & Vercel Deployment
echo ========================================================
echo.

REM Set Git Path
set "GIT_PATH=C:\Users\ASUS\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd"
set "PATH=%GIT_PATH%;%PATH%"

echo 1. Make sure you have created an empty repository on GitHub:
echo    https://github.com/new
echo    (Name it: glow-and-grace)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/YOUR_USER/glow-and-grace.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Aborting.
    pause
    exit /b 1
)

echo.
echo Connecting to GitHub repository: %REPO_URL% ...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing code to GitHub...
echo (A sign-in window may pop up to authenticate with GitHub once)
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Your code is now live on GitHub!
    echo ========================================================
    echo.
    echo Next Step - Deploy to Vercel in 60 seconds:
    echo 1. Open: https://vercel.com/new
    echo 2. Sign in with GitHub
    echo 3. Click "Import" next to "glow-and-grace"
    echo 4. Click "Deploy"
    echo.
    echo Vercel will provide your live website link!
) else (
    echo.
    echo [NOTE] If git requested sign-in or failed, check your repo URL and permissions.
)

echo.
pause
