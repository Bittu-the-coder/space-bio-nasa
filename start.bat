@echo off
echo Starting NASA Space Biology Knowledge Engine servers...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && python main.py"

timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause > nul

echo Stopping servers...
taskkill /f /im "python.exe" 2>nul
taskkill /f /im "node.exe" 2>nul
echo Servers stopped.
