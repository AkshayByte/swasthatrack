from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DiagnosisBase(BaseModel):
    patient_id: int
    diagnosis: str = Field(..., min_length=1)
    symptoms: str | None = None  # JSON string
    severity: str = Field(..., pattern="^(Low|Medium|High|Critical)$")
    notes: str | None = None
    diagnosed_by: str
    follow_up_required: bool = False
    follow_up_date: datetime | None = None

class DiagnosisCreate(DiagnosisBase):
    pass

class Diagnosis(DiagnosisBase):
    id: int
    diagnosed_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
