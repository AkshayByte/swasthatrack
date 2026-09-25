from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from database import get_db
from models.lab_report import LabReport as LabReportModel
from models.patient import Patient as PatientModel
from models.user import User
from routes.auth import get_current_user
from schemas.lab_report import (
    LabOrderCreateRequest,
    LabOrderStatusUpdate,
    LabOrderResponse,
)

router = APIRouter()


def _format_lab_order(report: LabReportModel, patient_name: Optional[str] = None) -> dict:
    return {
        "id": report.id,
        "patient_id": report.patient_id,
        "patient_name": patient_name or (report.patient.name if report.patient else f"Patient #{report.patient_id}"),
        "doctor_name": report.ordered_by,
        "test_name": report.test_name,
        "category": report.test_type or "General",
        "priority": report.priority or "routine",
        "status": report.status or "pending",
        "results": report.results,
        "notes": report.notes,
        "created_at": report.created_at or report.ordered_at,
        "ordered_at": report.ordered_at,
    }


@router.get("/", response_model=List[LabOrderResponse])
def get_lab_orders(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List lab test orders with optional status filter.
    Accessible to Lab Technicians, Doctors, and Administrators.
    """
    if current_user.role not in ["admin", "lab", "doctor", "registration"]:
        raise HTTPException(status_code=403, detail="Not authorized to access pathology lab orders")

    query = db.query(LabReportModel).join(PatientModel, LabReportModel.patient_id == PatientModel.id, isouter=True)
    if status and status.lower() != "all":
        query = query.filter(LabReportModel.status == status.lower())

    results = query.order_by(LabReportModel.created_at.desc()).offset(skip).limit(limit).all()
    return [_format_lab_order(report) for report in results]


@router.post("/", response_model=LabOrderResponse, status_code=status.HTTP_201_CREATED)
def create_lab_order(
    data: LabOrderCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Doctor orders a diagnostic pathology or radiology test.
    Authorization guard: Restrict to Doctors and Administrators.
    """
    if current_user.role not in ["admin", "doctor"]:
        raise HTTPException(
            status_code=403,
            detail="Access restricted. Only physicians or administrators may order lab tests."
        )

    patient = db.query(PatientModel).filter(PatientModel.id == data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient ID {data.patient_id} not found")

    doctor_name = data.doctor_name or data.ordered_by or current_user.full_name or "Dr. Physician"
    category = data.category or data.test_type or "General"

    new_report = LabReportModel(
        patient_id=data.patient_id,
        test_name=data.test_name,
        test_type=category,
        status=data.status or "pending",
        ordered_by=doctor_name,
        ordered_at=datetime.now(timezone.utc),
        notes=data.notes,
        priority=data.priority or "routine",
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return _format_lab_order(new_report, patient_name=patient.name)


@router.get("/{order_id}", response_model=LabOrderResponse)
def get_lab_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = db.query(LabReportModel).filter(LabReportModel.id == order_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Lab order not found")

    if current_user.role not in ["admin", "lab", "doctor", "registration"]:
        if not report.patient or current_user.email != report.patient.email:
            raise HTTPException(status_code=403, detail="Not authorized to access this diagnostic lab order")

    return _format_lab_order(report)


@router.put("/{order_id}/status", response_model=LabOrderResponse)
def update_lab_order_status(
    order_id: int,
    update: LabOrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update test status (sample_collected, in_analysis, completed) and enter results.
    Authorization guard: Restricted to Lab Technicians and Administrators.
    """
    if current_user.role not in ["admin", "lab", "doctor"]:
        raise HTTPException(
            status_code=403,
            detail="Access restricted. Only lab technicians or administrators may update lab results."
        )

    report = db.query(LabReportModel).filter(LabReportModel.id == order_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Lab order not found")

    report.status = update.status.lower()
    if update.results:
        report.results = update.results
    if update.notes:
        report.notes = update.notes

    if report.status == "in_analysis" and not report.started_at:
        report.started_at = datetime.now(timezone.utc)
    elif report.status == "completed":
        report.completed_at = datetime.now(timezone.utc)

    report.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(report)

    return _format_lab_order(report)


@router.get("/patient/{patient_id}", response_model=List[LabOrderResponse])
def get_patient_lab_orders(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if current_user.role not in ["admin", "lab", "doctor", "registration"]:
        if current_user.email != patient.email:
            raise HTTPException(status_code=403, detail="Not authorized to access patient lab orders")

    records = db.query(LabReportModel).filter(LabReportModel.patient_id == patient_id).all()
    return [_format_lab_order(report, patient_name=patient.name) for report in records]
