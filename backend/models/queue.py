from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    queue_number = Column(String(20), nullable=False)
    service_type = Column(String(50), nullable=False)
    doctor_id = Column(Integer, nullable=True)
    doctor_name = Column(String(100), nullable=True)
    priority = Column(String(20), default="normal")
    status = Column(String(20), default="waiting", index=True)
    estimated_wait_time = Column(Integer, default=0)  # in minutes
    check_in_time = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    called_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    patient = relationship("Patient")

