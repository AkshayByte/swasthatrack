from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Any, Union


class MedicineItem(BaseModel):
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    instructions: Optional[str] = None


class PrescriptionCreateRequest(BaseModel):
    patient_id: int
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    prescribed_by: Optional[str] = None
    medicines: Union[List[MedicineItem], List[dict], str]
    instructions: Optional[str] = None
    valid_until: Optional[datetime] = None
    status: str = "pending"
    notes: Optional[str] = None


class PrescriptionStatusUpdate(BaseModel):
    status: str


class PrescriptionResponse(BaseModel):
    id: int
    patient_id: int
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    medicines: List[Any] = []
    instructions: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    valid_until: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
