from pydantic import BaseModel, ConfigDict, Field, EmailStr
from datetime import datetime
from typing import Optional, List, Any

class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., gt=0, lt=150)
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    phone: str = Field(..., pattern=r"^\+?[0-9]{10,15}$")
    email: Optional[EmailStr] = None
    address: str
    emergency_contact: str = Field(..., pattern=r"^\+?[0-9]{10,15}$")
    blood_group: Optional[str] = Field(None, pattern="^(A|B|AB|O)[+-]$")
    allergies: Optional[List[str]] = []
    medical_history: Optional[List[str]] = []
    status: str = "active"

class PatientCreate(PatientBase):
    registration_number: str

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = None
    medical_history: Optional[List[str]] = None
    status: Optional[str] = None

class Patient(PatientBase):
    id: int
    registration_date: datetime
    registration_number: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
