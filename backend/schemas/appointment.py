from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class AppointmentBase(BaseModel):
    patient_id: int
    doctor_name: str
    doctor_specialty: str
    appointment_date: datetime
    duration: int = 30
    status: str = "scheduled"
    reason: str
    notes: Optional[str] = None
    location: str

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
