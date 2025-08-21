@echo off
echo Starting NASA Space Biology Knowledge Engine...
echo.

echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setting up backend environment...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    if %ERRORLEVEL% neq 0 (
        echo Failed to create virtual environment
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing backend dependencies...
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Run 'npm run dev' in one terminal for the frontend
echo 2. Run 'python backend/main.py' in another terminal for the backend
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
