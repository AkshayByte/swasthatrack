from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class LabReportBase(BaseModel):
    patient_id: int
    test_name: str
    test_type: str
    results: Optional[str] = None  # JSON string
    normal_range: Optional[str] = None
    status: str = "pending"
    ordered_by: str
    notes: Optional[str] = None
    file_url: Optional[str] = None
    priority: str = "normal"
    estimated_completion: Optional[datetime] = None

class LabReportCreate(LabReportBase):
    pass

class LabReport(LabReportBase):
    id: int
    ordered_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
