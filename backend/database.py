from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./swasthatrack.db")

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
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

