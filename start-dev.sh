#!/bin/bash
echo "==================================================="
echo "  Starting SwasthaTrack (Backend + Frontend)"
echo "==================================================="

# Function to kill child processes on exit
cleanup() {
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM

echo "[1/2] Starting FastAPI Backend on http://localhost:8000 ..."
(cd backend && python -m uvicorn main:app --reload --port 8000) &

echo "[2/2] Starting Astro Frontend on http://localhost:4321 ..."
(cd frontend-v2 && npm run dev) &

echo "Both services are running in parallel."
echo "Press Ctrl+C to stop both."
wait
