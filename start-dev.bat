@echo off
echo ===================================================
echo   Starting SwasthaTrack (Backend + Frontend)
echo ===================================================

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "SwasthaTrack Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

echo [2/2] Launching Astro Frontend on http://localhost:4321 ...
start "SwasthaTrack Frontend (Astro)" cmd /k "cd frontend-v2 && npm run dev"

echo.
echo Both services are running:
echo   - Frontend: http://localhost:4321
echo   - Backend:  http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo ===================================================
