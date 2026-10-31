from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LabOrderCreateRequest(BaseModel):
    patient_id: int
    patient_name: str | None = None
    doctor_name: str | None = None
    ordered_by: str | None = None
    test_name: str
    category: str | None = "General"
    test_type: str | None = None
    priority: str | None = "routine"
    notes: str | None = None


class LabOrderStatusUpdate(BaseModel):
    status: str
    results: str | None = None
    notes: str | None = None


class LabOrderResponse(BaseModel):
    id: int
    patient_id: int
    patient_name: str | None = None
    doctor_name: str | None = None
    test_name: str
    category: str
    priority: str
    status: str
    results: str | None = None
    notes: str | None = None
    created_at: datetime
    ordered_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
