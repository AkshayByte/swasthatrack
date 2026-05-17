from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    test_name = Column(String(200), nullable=False, index=True)
    test_type = Column(String(100), nullable=False)
    results = Column(Text, nullable=True)  # JSON string
    normal_range = Column(String(100), nullable=True)
    status = Column(String(20), default="pending", index=True)
    ordered_by = Column(String(100), nullable=False)
    ordered_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    priority = Column(String(20), default="normal")
    estimated_completion = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    patient = relationship("Patient", back_populates="lab_reports")

