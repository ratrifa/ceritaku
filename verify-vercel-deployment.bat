@echo off
REM Vercel Deployment Verification Script (Windows)

echo Vercel Deployment Verification
echo ==================================
echo.

REM 1. Check vercel.json exists
echo 1. Checking vercel.json...
if exist vercel.json (
    echo    [OK] vercel.json exists
    findstr /M "installCommand" vercel.json >nul
    if %ERRORLEVEL% EQU 0 (
        echo    [OK] Install and build commands configured
    ) else (
        echo    [ERROR] Missing install/build commands
        exit /b 1
    )
) else (
    echo    [ERROR] vercel.json not found
    exit /b 1
)
echo.

REM 2. Check Vite build output
echo 2. Checking Vite build output...
if exist "public\build\manifest.json" (
    echo    [OK] public\build\manifest.json exists
) else (
    echo    [WARNING] public\build\manifest.json missing - run 'npm run build'
)
echo.

REM 3. Check vendor folder
echo 3. Checking PHP dependencies...
if exist "vendor\autoload.php" (
    echo    [OK] vendor\ folder exists
) else (
    echo    [WARNING] vendor\ folder missing - run 'composer install'
)
echo.

REM 4. Check API entry point
echo 4. Checking API entry point...
if exist "api\index.php" (
    echo    [OK] api\index.php exists
) else (
    echo    [ERROR] api\index.php not found
    exit /b 1
)
echo.

REM 5. Check git
echo 5. Checking git repository...
git rev-parse --git-dir >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Inside git repository
) else (
    echo    [ERROR] Not inside git repository
    exit /b 1
)
echo.

REM 6. Summary
echo ==================================
echo [SUCCESS] All checks passed!
echo.
echo NEXT STEPS:
echo 1. Verify locally with: npm run build
echo 2. Set environment variables in Vercel Dashboard
echo 3. git push to trigger Vercel deployment
echo ==================================
