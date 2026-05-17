from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class PrescriptionBase(BaseModel):
    patient_id: int
    medicines: str  # JSON string
    instructions: Optional[str] = None
    prescribed_by: str
    valid_until: datetime
    status: str = "active"
    notes: Optional[str] = None

class PrescriptionCreate(PrescriptionBase):
    pass

class Prescription(PrescriptionBase):
    id: int
    prescribed_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
