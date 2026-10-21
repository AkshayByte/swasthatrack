from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from schemas.patient import Patient


class QueueStatus(str, Enum):
    WAITING = "waiting"
    CALLED = "called"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no-show"

class QueueEntryBase(BaseModel):
    patient_id: int
    queue_number: str | None = Field(default="", description="OPD queue token number. Leave empty to auto-generate.")
    service_type: str
    doctor_id: int | None = None
    doctor_name: str | None = None
    priority: str = "normal"
    priority_score: int = 25
    status: QueueStatus = QueueStatus.WAITING
    estimated_wait_time: int = 0
    notes: str | None = None

class QueueEntryCreate(QueueEntryBase):
    pass

class QueueEntry(QueueEntryBase):
    id: int
    check_in_time: datetime
    called_at: datetime | None = None
    completed_at: datetime | None = None
    priority_score: int
    created_at: datetime
    updated_at: datetime

    patient: Optional["Patient"] = None

    model_config = ConfigDict(from_attributes=True)


class VitalsInput(BaseModel):
    temperature_f: float | None = Field(None, description="Body temperature in Fahrenheit, e.g. 98.6")
    heart_rate_bpm: int | None = Field(None, description="Heart rate in beats per minute, e.g. 72")
    blood_pressure: str | None = Field(None, description="Blood pressure string, e.g. '120/80'")
    spo2_percent: float | None = Field(None, description="Blood oxygen saturation percentage, e.g. 98.0")
    respiratory_rate: int | None = Field(None, description="Breaths per minute, e.g. 16")


class TriageRequest(BaseModel):
    symptoms: str = Field(..., min_length=2, description="Patient reported symptoms and chief complaint")
    vitals: VitalsInput | None = None
    age: int | None = Field(None, ge=0, le=130, description="Patient age in years")
    gender: str | None = None
    medical_history: list[str] | None = Field(default_factory=list, description="Known chronic conditions and history")
    allergies: list[str] | None = Field(default_factory=list, description="Known patient allergies")


class TriageResponse(BaseModel):
    urgency: str = Field(..., description="Triage acuity level: 'emergency', 'high', 'medium', 'low'")
    priority_score: int = Field(..., ge=1, le=100, description="Priority score from 1 (lowest) to 100 (highest emergency)")
    recommended_department: str = Field(..., description="Suggested clinical department or specialist")
    estimated_wait_minutes: int = Field(..., ge=0, description="Recommended target wait time in minutes")
    diagnostic_indicators: list[str] = Field(default_factory=list, description="Key clinical risk factors and diagnostic markers identified")
    reasoning: str = Field(..., description="Clinical reasoning explaining the assigned priority")
    source: str = Field("gemini", description="Inference engine source: 'gemini' or 'heuristic_fallback'")

