from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from models.prescription import PrescriptionStatus


class MedicineItem(BaseModel):
    name: str
    dosage: str | None = None
    frequency: str | None = None
    duration: str | None = None
    instructions: str | None = None
    quantity: int = 1


class PrescriptionCreateRequest(BaseModel):
    patient_id: int
    patient_name: str | None = None
    doctor_name: str | None = None
    prescribed_by: str | None = None
    medicines: list[MedicineItem] | list[dict] | str
    instructions: str | None = None
    valid_until: datetime | None = None
    status: PrescriptionStatus = PrescriptionStatus.PENDING
    notes: str | None = None


class PrescriptionStatusUpdate(BaseModel):
    status: PrescriptionStatus


class PrescriptionResponse(BaseModel):
    id: int
    patient_id: int
    patient_name: str | None = None
    doctor_name: str | None = None
    medicines: list[Any] = []
    instructions: str | None = None
    status: PrescriptionStatus
    notes: str | None = None
    created_at: datetime
    valid_until: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
