"""Gunicorn production configuration for SwasthaTrack API on Render."""

import multiprocessing
import os

# Render automatically sets PORT (defaults to 8000)
port = os.getenv("PORT", "8000")
bind = f"0.0.0.0:{port}"

# Free tier has 512MB RAM; 2 workers is ideal for stability
workers = int(os.getenv("WEB_CONCURRENCY", "2"))

# Use Uvicorn's async worker class for FastAPI
worker_class = "uvicorn.workers.UvicornWorker"

# Timeouts
timeout = 120
graceful_timeout = 30
keepalive = 5

# Logging to stdout/stderr for cloud log aggregators (Render)
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info")

# Do not preload app with async Uvicorn workers to prevent loop/fork issues
preload_app = False
