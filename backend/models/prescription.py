from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class PrescriptionStatus(str, Enum):
    PENDING = "pending"
    DISPENSED = "dispensed"
    CANCELLED = "cancelled"


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    medicines = Column(Text, nullable=False)  # JSON string (legacy / free-text)
    instructions = Column(Text, nullable=True)
    prescribed_by = Column(String(100), nullable=False)
    prescribed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    valid_until = Column(DateTime, nullable=False)
    status = Column(String(20), default=PrescriptionStatus.PENDING.value)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    patient = relationship("Patient", back_populates="prescriptions")
    items = relationship("PrescriptionItem", back_populates="prescription", cascade="all, delete-orphan")


class PrescriptionItem(Base):
    __tablename__ = "prescription_items"

    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False, index=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=True, index=True)
    medicine_name = Column(String(200), nullable=False)  # Snapshot for audit
    quantity = Column(Integer, default=1, nullable=False)
    dosage = Column(String(200), nullable=True)
    frequency = Column(String(200), nullable=True)
    duration = Column(String(200), nullable=True)
    instructions = Column(Text, nullable=True)

    medicine = relationship("Medicine", back_populates="prescription_items")
    prescription = relationship("Prescription", back_populates="items")
