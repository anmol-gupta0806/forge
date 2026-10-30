@echo off
echo ===================================================================
echo   SENTINEL — Autonomous Disaster Intelligence & Logistics Swarm
echo ===================================================================
echo [1/2] Launching Backend on http://localhost:8000
start "SENTINEL Backend" cmd /c "run_backend.bat"
timeout /t 3 /nobreak >nul
echo [2/2] Launching Frontend on http://localhost:5173
start "SENTINEL Frontend" cmd /c "run_frontend.bat"
echo.
echo Application initiated. Access SENTINEL at: http://localhost:5173
echo API Documentation available at: http://localhost:8000/docs
echo ===================================================================
