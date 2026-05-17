from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class DiagnosisBase(BaseModel):
    patient_id: int
    diagnosis: str = Field(..., min_length=1)
    symptoms: Optional[str] = None  # JSON string
    severity: str = Field(..., pattern="^(Low|Medium|High|Critical)$")
    notes: Optional[str] = None
    diagnosed_by: str
    follow_up_required: bool = False
    follow_up_date: Optional[datetime] = None

class DiagnosisCreate(DiagnosisBase):
    pass

class Diagnosis(DiagnosisBase):
    id: int
    diagnosed_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
