from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import os
from dotenv import load_dotenv
import logging
import time

# Load environment variables
load_dotenv()

# Configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT == "production"

from database import create_tables
from routes import medicine, dashboard, auth, patients, queue


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler — replaces deprecated on_event('startup')."""
    logger.info("Starting up SwasthaTrack API...")
    create_tables()
    yield
    logger.info("SwasthaTrack API shut down.")


app = FastAPI(
    title="SwasthaTrack API",
    version="1.0.0",
    description="Healthcare Management Platform API",
    lifespan=lifespan,
)

# CORS Configuration — restrictive in production, permissive in dev
if IS_PRODUCTION:
    _default_origins = ""  # must be set explicitly via ALLOWED_ORIGINS
else:
    _default_origins = "http://localhost:4321,http://localhost:3000,http://localhost:8080"

ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers
@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Database operation failed"},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )

# Middleware for request logging (verbose in dev, minimal in prod — gunicorn logs access in prod)
if not IS_PRODUCTION:
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
        return response

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(medicine.router, prefix="/api/medicine", tags=["medicine"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
app.include_router(queue.router, prefix="/api/queue", tags=["queue"])

@app.get("/")
def read_root():
    return {"message": "SwasthaTrack backend is running!", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}