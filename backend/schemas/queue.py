from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List
from schemas.patient import Patient

class QueueEntryBase(BaseModel):
    patient_id: int
    queue_number: Optional[str] = Field(default="", description="OPD queue token number. Leave empty to auto-generate.")
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


class VitalsInput(BaseModel):
    temperature_f: Optional[float] = Field(None, description="Body temperature in Fahrenheit, e.g. 98.6")
    heart_rate_bpm: Optional[int] = Field(None, description="Heart rate in beats per minute, e.g. 72")
    blood_pressure: Optional[str] = Field(None, description="Blood pressure string, e.g. '120/80'")
    spo2_percent: Optional[float] = Field(None, description="Blood oxygen saturation percentage, e.g. 98.0")
    respiratory_rate: Optional[int] = Field(None, description="Breaths per minute, e.g. 16")


class TriageRequest(BaseModel):
    symptoms: str = Field(..., min_length=2, description="Patient reported symptoms and chief complaint")
    vitals: Optional[VitalsInput] = None
    age: Optional[int] = Field(None, ge=0, le=130, description="Patient age in years")
    gender: Optional[str] = None
    medical_history: Optional[List[str]] = Field(default_factory=list, description="Known chronic conditions and history")
    allergies: Optional[List[str]] = Field(default_factory=list, description="Known patient allergies")


class TriageResponse(BaseModel):
    urgency: str = Field(..., description="Triage acuity level: 'emergency', 'high', 'medium', 'low'")
    priority_score: int = Field(..., ge=1, le=100, description="Priority score from 1 (lowest) to 100 (highest emergency)")
    recommended_department: str = Field(..., description="Suggested clinical department or specialist")
    estimated_wait_minutes: int = Field(..., ge=0, description="Recommended target wait time in minutes")
    diagnostic_indicators: List[str] = Field(default_factory=list, description="Key clinical risk factors and diagnostic markers identified")
    reasoning: str = Field(..., description="Clinical reasoning explaining the assigned priority")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence metric for the diagnostic triage assessment (e.g. 0.94 for 94%)")
    source: str = Field("gemini", description="Inference engine source: 'gemini' or 'heuristic_fallback'")

