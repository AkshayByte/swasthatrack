from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class StatItem(BaseModel):
    label: str
    value: int
    change: Optional[int] = 0
    trend: Optional[str] = "neutral"

class MedicineStats(BaseModel):
    total_medicines: int
    low_stock_items: int
    expiring_soon: int
    recent_activities: List[Dict[str, Any]]

class DoctorStats(BaseModel):
    total_patients: int
    pending_appointments: int
    completed_appointments: int
    today_appointments: List[Dict[str, Any]]

class PatientStats(BaseModel):
    active_prescriptions: int
    upcoming_appointments: int
    pending_lab_reports: int
    recent_history: List[Dict[str, Any]]

class RegistrationStats(BaseModel):
    total_patients: int
    today_registrations: int
    active_queue: int
    recent_registrations: List[Dict[str, Any]]

class LabStats(BaseModel):
    pending_tests: int
    completed_today: int
    critical_results: int
    recent_reports: List[Dict[str, Any]]
