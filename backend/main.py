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
from routes import medicine, dashboard, auth, patients, queue, prescriptions, lab_orders


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler — replaces deprecated on_event('startup')."""
    logger.info("Starting up SwasthaTrack API...")
    create_tables()
    try:
        from seed import seed
        seed_env = os.getenv("SEED_SAMPLE_DATA", "false").lower()
        # In production, only seed if explicitly requested via SEED_SAMPLE_DATA=true
        if not IS_PRODUCTION or seed_env == "true":
            seed()
            logger.info("Database initialized with baseline clinical accounts and data.")
        else:
            logger.info("Production mode: Skipping automated demo seeding.")
    except Exception as e:
        logger.warning(f"Startup seed notice: {e}")
    yield
    logger.info("SwasthaTrack API shut down.")


from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from utils.limiter import limiter

app = FastAPI(
    title="SwasthaTrack API",
    version="1.0.0",
    description="Healthcare Management Platform API",
    lifespan=lifespan,
)

# Attach rate limiter to application state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration — strict origin whitelist with support for custom env domains & Vercel previews
DEFAULT_ORIGINS = [
    "http://localhost:4321",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:4321",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://swasthatrack.vercel.app",
]
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "").strip()

if allowed_origins_env and allowed_origins_env != "*":
    env_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
    allowed_origins = list(set(DEFAULT_ORIGINS + env_origins))
else:
    allowed_origins = DEFAULT_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https:\/\/.*\.vercel\.app",  # Safely permits preview deployments on Vercel
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

# Include routers (supports both with and without /api prefix)
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(medicine.router, prefix="/api/medicine", tags=["medicine"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
app.include_router(queue.router, prefix="/api/queue", tags=["queue"])
app.include_router(prescriptions.router, prefix="/api/prescriptions", tags=["prescriptions"])
app.include_router(lab_orders.router, prefix="/api/lab-orders", tags=["lab-orders"])

app.include_router(auth.router, prefix="/auth", tags=["auth-direct"], include_in_schema=False)
app.include_router(medicine.router, prefix="/medicine", tags=["medicine-direct"], include_in_schema=False)
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard-direct"], include_in_schema=False)
app.include_router(patients.router, prefix="/patients", tags=["patients-direct"], include_in_schema=False)
app.include_router(queue.router, prefix="/queue", tags=["queue-direct"], include_in_schema=False)
app.include_router(prescriptions.router, prefix="/prescriptions", tags=["prescriptions-direct"], include_in_schema=False)
app.include_router(lab_orders.router, prefix="/lab-orders", tags=["lab-orders-direct"], include_in_schema=False)

@app.get("/")
def read_root():
    return {"message": "SwasthaTrack backend is running!", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": time.time()}