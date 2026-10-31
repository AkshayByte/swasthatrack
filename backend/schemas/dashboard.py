from typing import Any

from pydantic import BaseModel


class StatItem(BaseModel):
    label: str
    value: int
    change: int | None = 0
    trend: str | None = "neutral"

class AdminDashboardStats(BaseModel):
    total_patients: int
    today_registrations: int
    active_queue: int
    pending_prescriptions: int
    pending_lab_orders: int
    low_stock_medicines: int
    total_medicines: int
    queue_by_department: list[dict[str, Any]]

class MedicineStats(BaseModel):
    total_medicines: int
    low_stock_items: int
    expiring_soon: int
    recent_activities: list[dict[str, Any]]

class DoctorStats(BaseModel):
    total_patients: int
    pending_appointments: int
    completed_appointments: int
    today_appointments: list[dict[str, Any]]

class PatientStats(BaseModel):
    active_prescriptions: int
    upcoming_appointments: int
    pending_lab_reports: int
    recent_history: list[dict[str, Any]]

class RegistrationStats(BaseModel):
    total_patients: int
    today_registrations: int
    active_queue: int
    recent_registrations: list[dict[str, Any]]

class LabStats(BaseModel):
    pending_tests: int
    completed_today: int
    critical_results: int
    recent_reports: list[dict[str, Any]]
