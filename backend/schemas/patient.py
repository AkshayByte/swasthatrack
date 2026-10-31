import json
import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., gt=0, lt=150)
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    phone: str = Field(..., pattern=r"^\+?[0-9]{10,15}$")
    email: EmailStr | None = None
    address: str | None = None
    emergency_contact: str | None = None
    blood_group: str | None = Field(None, pattern="^(A|B|AB|O)[+-]$")
    allergies: list[str] | None = []
    medical_history: list[str] | None = []
    status: str = "active"

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_phone(cls, value):
        if isinstance(value, str):
            return re.sub(r"[\s\-()]", "", value)
        return value

    @field_validator("allergies", "medical_history", mode="before")
    @classmethod
    def parse_json_list(cls, value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except (json.JSONDecodeError, ValueError):
                return []
        return value

class PatientCreate(PatientBase):
    registration_number: str | None = None

class PatientUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
    gender: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
    emergency_contact: str | None = None
    blood_group: str | None = None
    allergies: list[str] | None = None
    medical_history: list[str] | None = None
    status: str | None = None

class Patient(PatientBase):
    id: int
    registration_date: datetime
    registration_number: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
