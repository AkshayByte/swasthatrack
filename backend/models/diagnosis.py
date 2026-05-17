from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    diagnosis = Column(String(200), nullable=False)
    symptoms = Column(Text, nullable=True)  # JSON string
    severity = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)
    diagnosed_by = Column(String(100), nullable=False)
    diagnosed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    follow_up_required = Column(Boolean, default=False)
    follow_up_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    patient = relationship("Patient", back_populates="diagnoses")

