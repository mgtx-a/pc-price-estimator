@echo off
echo =================================
echo PC Price Estimator Setup
echo =================================
echo.

echo Installing dependencies...
call npm run setup

echo.
echo Setting up database...
call node setup.js

echo.
echo Starting development servers...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.

call npm run dev

pause