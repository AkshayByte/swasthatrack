from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta, timezone
from typing import List

from database import get_db
from models.medicine import Medicine
from models.patient import Patient
from models.appointment import Appointment
from models.lab_report import LabReport
from models.prescription import Prescription
from models.queue import QueueEntry
from models.user import User
from routes.auth import get_current_user
from schemas.dashboard import MedicineStats, DoctorStats, PatientStats, RegistrationStats, LabStats

router = APIRouter()

@router.get("/medicine", response_model=MedicineStats)
def get_medicine_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "pharmacist"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    total_medicines = db.query(func.count(Medicine.id)).scalar()
    low_stock = db.query(func.count(Medicine.id)).filter(Medicine.current_stock < Medicine.minimum_stock).scalar()
    
    # Expiring in next 30 days
    thirty_days_from_now = datetime.now(timezone.utc).date() + timedelta(days=30)
    expiring_soon = db.query(func.count(Medicine.id)).filter(
        Medicine.expiry_date <= thirty_days_from_now,
        Medicine.expiry_date >= datetime.now(timezone.utc).date()
    ).scalar()
    
    # Recent medicines updated (last 3 by name as a lightweight activity feed)
    recent_medicines_query = db.query(Medicine).order_by(desc(Medicine.id)).limit(3).all()
    recent_activities = [
        {"action": "Medicine Record", "item": m.name, "stock": m.current_stock}
        for m in recent_medicines_query
    ]

    return {
        "total_medicines": total_medicines,
        "low_stock_items": low_stock,
        "expiring_soon": expiring_soon,
        "recent_activities": recent_activities
    }

@router.get("/doctor", response_model=DoctorStats)
def get_doctor_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "doctor"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    # For demo purposes, we're counting all patients/appointments
    # In a real app, we'd filter by doctor_id if applicable
    
    total_patients = db.query(func.count(Patient.id)).scalar()
    
    today = datetime.now(timezone.utc).date()
    start_of_day = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)
    end_of_day = datetime.combine(today, datetime.max.time()).replace(tzinfo=timezone.utc)
    
    pending_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.status == "scheduled",
        Appointment.appointment_date >= start_of_day
    ).scalar()
    
    completed_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.status == "completed",
        Appointment.appointment_date >= start_of_day,
        Appointment.appointment_date <= end_of_day
    ).scalar()
    
    today_appointments_query = db.query(Appointment).filter(
        Appointment.appointment_date >= start_of_day,
        Appointment.appointment_date <= end_of_day
    ).order_by(Appointment.appointment_date).limit(5).all()
    
    today_appointments = [
        {
            "id": appt.id,
            "patient_name": appt.patient.name if appt.patient else "Unknown",
            "time": appt.appointment_date.strftime("%H:%M"),
            "status": appt.status
        } for appt in today_appointments_query
    ]
    
    return {
        "total_patients": total_patients,
        "pending_appointments": pending_appointments,
        "completed_appointments": completed_appointments,
        "today_appointments": today_appointments
    }

@router.get("/patient", response_model=PatientStats)
def get_patient_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # "patient" is not a valid staff role — this endpoint is admin-accessible
    # for aggregate reporting. A dedicated patient portal auth flow should be
    # built separately if self-service patient access is needed.
    if current_user.role not in ["admin", "doctor"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    active_prescriptions = db.query(func.count(Prescription.id)).filter(Prescription.status == "active").scalar()
    upcoming_appointments = db.query(func.count(Appointment.id)).filter(Appointment.status == "scheduled").scalar()
    pending_lab_reports = db.query(func.count(LabReport.id)).filter(LabReport.status == "pending").scalar()

    # Build recent history from actual DB records
    recent_appointments = db.query(Appointment).order_by(desc(Appointment.appointment_date)).limit(3).all()
    recent_history = [
        {
            "type": "Appointment",
            "date": appt.appointment_date.strftime("%Y-%m-%d") if appt.appointment_date else "",
            "details": appt.status
        }
        for appt in recent_appointments
    ]

    return {
        "active_prescriptions": active_prescriptions,
        "upcoming_appointments": upcoming_appointments,
        "pending_lab_reports": pending_lab_reports,
        "recent_history": recent_history
    }

@router.get("/registration", response_model=RegistrationStats)
def get_registration_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "registration"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    total_patients = db.query(func.count(Patient.id)).scalar()
    
    today = datetime.now(timezone.utc).date()
    start_of_day = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)
    
    today_registrations = db.query(func.count(Patient.id)).filter(
        Patient.registration_date >= start_of_day
    ).scalar()
    
    active_queue = db.query(func.count(QueueEntry.id)).filter(QueueEntry.status == "waiting").scalar()
    
    recent_regs_query = db.query(Patient).order_by(desc(Patient.registration_date)).limit(5).all()
    recent_registrations = [
        {
            "id": p.id,
            "name": p.name,
            "reg_number": p.registration_number,
            "time": p.registration_date.strftime("%H:%M") if p.registration_date else ""
        } for p in recent_regs_query
    ]
    
    return {
        "total_patients": total_patients,
        "today_registrations": today_registrations,
        "active_queue": active_queue,
        "recent_registrations": recent_registrations
    }

@router.get("/lab", response_model=LabStats)
def get_lab_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "lab"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    pending_tests = db.query(func.count(LabReport.id)).filter(LabReport.status == "pending").scalar()
    
    today = datetime.now(timezone.utc).date()
    start_of_day = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)
    
    completed_today = db.query(func.count(LabReport.id)).filter(
        LabReport.status == "completed",
        LabReport.completed_at >= start_of_day
    ).scalar()
    
    critical_results = db.query(func.count(LabReport.id)).filter(LabReport.priority == "critical").scalar()
    
    recent_reports_query = db.query(LabReport).order_by(desc(LabReport.ordered_at)).limit(5).all()
    recent_reports = [
        {
            "id": r.id,
            "test_name": r.test_name,
            "patient_name": r.patient.name if r.patient else "Unknown",
            "status": r.status
        } for r in recent_reports_query
    ]
    
    return {
        "pending_tests": pending_tests,
        "completed_today": completed_today,
        "critical_results": critical_results,
        "recent_reports": recent_reports
    }
