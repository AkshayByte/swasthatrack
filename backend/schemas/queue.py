from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional
from schemas.patient import Patient

class QueueEntryBase(BaseModel):
    patient_id: int
    queue_number: str
    service_type: str
    doctor_id: Optional[int] = None
    doctor_name: Optional[str] = None
    priority: str = "normal"
    status: str = "waiting"
    estimated_wait_time: int = 0
    notes: Optional[str] = None

class QueueEntryCreate(QueueEntryBase):
    pass

class QueueEntry(QueueEntryBase):
    id: int
    check_in_time: datetime
    called_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    patient: Optional["Patient"] = None

    model_config = ConfigDict(from_attributes=True)

