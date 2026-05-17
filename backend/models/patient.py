from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
    phone = Column(String(15), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=False)
    emergency_contact = Column(String(15), nullable=False)
    blood_group = Column(String(5), nullable=True)
    allergies = Column(Text, nullable=True)  # JSON string
    medical_history = Column(Text, nullable=True)  # JSON string
    registration_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    registration_number = Column(String(20), unique=True, nullable=False, index=True)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    diagnoses = relationship("Diagnosis", back_populates="patient")
    prescriptions = relationship("Prescription", back_populates="patient")
    lab_reports = relationship("LabReport", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")

