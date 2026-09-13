"""Gunicorn production configuration for SwasthaTrack API."""

import multiprocessing
import os

# Bind to the PORT env var (Render sets this automatically)
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"

# Workers: 2 * CPU + 1 (Render free = 1 CPU → 3 workers)
workers = int(os.getenv("WEB_CONCURRENCY", multiprocessing.cpu_count() * 2 + 1))

# Use Uvicorn's async worker class for FastAPI
worker_class = "uvicorn.workers.UvicornWorker"

# Timeouts
timeout = 120          # Kill workers that hang for > 120s
graceful_timeout = 30  # Allow 30s for in-flight requests on shutdown
keepalive = 5          # Keep TCP connections alive for 5s between requests

# Logging
accesslog = "-"        # Log to stdout (Render captures this)
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info")

# Preload app for faster worker startup and shared memory
preload_app = True
