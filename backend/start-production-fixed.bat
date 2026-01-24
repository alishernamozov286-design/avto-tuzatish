@echo off
echo Starting Mator Life Backend (Production Mode)...
echo.

REM Copy production env file
copy /Y .env.production .env

REM Start with PM2
pm2 start ecosystem.config.js --env production

echo.
echo Backend started in production mode!
echo Check logs: pm2 logs mator-life-backend
pause
