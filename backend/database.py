from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./swasthatrack.db")

# SQLAlchemy requires postgresql:// or postgresql+psycopg2:// instead of postgres:// (common in Render / Heroku URLs)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://") and "+psycopg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

# Create engine with connection pool resilience
if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,  # Automatically reconnect dropped cloud database connections
        pool_recycle=300
    )

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class
class Base(DeclarativeBase):
    pass

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    # Import all models to ensure they are registered with Base
    from models.medicine import Medicine
    from models.patient import Patient
    from models.diagnosis import Diagnosis
    from models.prescription import Prescription
    from models.lab_report import LabReport
    from models.appointment import Appointment
    from models.queue import QueueEntry
    from models.user import User
    
    Base.metadata.create_all(bind=engine)

