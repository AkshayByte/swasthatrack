from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Any


class LabOrderCreateRequest(BaseModel):
    patient_id: int
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    ordered_by: Optional[str] = None
    test_name: str
    category: Optional[str] = "General"
    test_type: Optional[str] = None
    priority: Optional[str] = "routine"
    status: Optional[str] = "pending"
    notes: Optional[str] = None


class LabOrderStatusUpdate(BaseModel):
    status: str
    results: Optional[str] = None
    notes: Optional[str] = None


class LabOrderResponse(BaseModel):
    id: int
    patient_id: int
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    test_name: str
    category: str
    priority: str
    status: str
    results: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    ordered_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
