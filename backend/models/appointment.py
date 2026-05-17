from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    doctor_name = Column(String(100), nullable=False, index=True)
    doctor_specialty = Column(String(100), nullable=False)
    appointment_date = Column(DateTime, nullable=False, index=True)
    duration = Column(Integer, default=30)  # in minutes
    status = Column(String(20), default="scheduled", index=True)
    reason = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    location = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    patient = relationship("Patient", back_populates="appointments")

