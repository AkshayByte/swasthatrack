from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    medicines = Column(Text, nullable=False)  # JSON string
    instructions = Column(Text, nullable=True)
    prescribed_by = Column(String(100), nullable=False)
    prescribed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    valid_until = Column(DateTime, nullable=False)
    status = Column(String(20), default="active")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    patient = relationship("Patient", back_populates="prescriptions")
