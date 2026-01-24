@echo off
echo ========================================
echo Mator Life Backend - Production Start
echo ========================================
echo.

REM Kill existing node processes
echo Stopping existing node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Check if build exists
if not exist "dist\index.js" (
    echo Building project...
    call npm run build
    if errorlevel 1 (
        echo Build failed!
        pause
        exit /b 1
    )
)

echo.
echo Starting server on port 4000...
echo Press Ctrl+C to stop
echo.

REM Start the server
set NODE_ENV=production
node dist\index.js

pause
