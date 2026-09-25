from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime, timezone, timedelta

from database import get_db
from models.prescription import Prescription as PrescriptionModel
from models.patient import Patient as PatientModel
from models.user import User
from routes.auth import get_current_user
from schemas.prescription import (
    PrescriptionCreateRequest,
    PrescriptionStatusUpdate,
    PrescriptionResponse,
)

router = APIRouter()


def _format_prescription(rx: PrescriptionModel, patient_name: Optional[str] = None) -> dict:
    meds = []
    if rx.medicines:
        if isinstance(rx.medicines, list):
            meds = rx.medicines
        elif isinstance(rx.medicines, str):
            try:
                meds = json.loads(rx.medicines)
            except Exception:
                meds = [{"name": rx.medicines}]
    return {
        "id": rx.id,
        "patient_id": rx.patient_id,
        "patient_name": patient_name or (rx.patient.name if rx.patient else f"Patient #{rx.patient_id}"),
        "doctor_name": rx.prescribed_by,
        "medicines": meds,
        "instructions": rx.instructions,
        "status": rx.status,
        "notes": rx.notes,
        "created_at": rx.created_at or rx.prescribed_at,
        "valid_until": rx.valid_until,
    }


@router.get("/", response_model=List[PrescriptionResponse])
def get_prescriptions(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List prescriptions with optional status filter (e.g. 'pending', 'dispensed').
    Accessible to Pharmacists, Doctors, and Administrators.
    """
    if current_user.role not in ["admin", "pharmacist", "doctor", "registration"]:
        raise HTTPException(status_code=403, detail="Not authorized to access clinical prescriptions")

    query = db.query(PrescriptionModel).join(PatientModel, PrescriptionModel.patient_id == PatientModel.id, isouter=True)
    if status and status.lower() != "all":
        query = query.filter(PrescriptionModel.status == status.lower())

    results = query.order_by(PrescriptionModel.created_at.desc()).offset(skip).limit(limit).all()
    return [_format_prescription(rx) for rx in results]


@router.post("/", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED)
def create_prescription(
    data: PrescriptionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Issue an e-prescription for a patient.
    Authorization guard: Restrict to Doctors and Administrators.
    """
    if current_user.role not in ["admin", "doctor"]:
        raise HTTPException(
            status_code=403,
            detail="Access restricted. Only physicians or administrators may issue prescriptions."
        )

    patient = db.query(PatientModel).filter(PatientModel.id == data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient ID {data.patient_id} not found")

    doctor_name = data.doctor_name or data.prescribed_by or current_user.full_name or "Dr. Physician"
    
    # Normalize medicines to JSON string for database storage
    if isinstance(data.medicines, str):
        medicines_json = data.medicines
    else:
        medicines_list = [m.model_dump() if hasattr(m, "model_dump") else m for m in data.medicines]
        medicines_json = json.dumps(medicines_list)

    valid_until = data.valid_until or (datetime.now(timezone.utc) + timedelta(days=30))

    new_rx = PrescriptionModel(
        patient_id=data.patient_id,
        medicines=medicines_json,
        instructions=data.instructions or "Take medications as directed",
        prescribed_by=doctor_name,
        prescribed_at=datetime.now(timezone.utc),
        valid_until=valid_until,
        status=data.status or "pending",
        notes=data.notes,
    )
    db.add(new_rx)
    db.commit()
    db.refresh(new_rx)

    return _format_prescription(new_rx, patient_name=patient.name)


@router.get("/{rx_id}", response_model=PrescriptionResponse)
def get_prescription(
    rx_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rx = db.query(PrescriptionModel).filter(PrescriptionModel.id == rx_id).first()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return _format_prescription(rx)


@router.put("/{rx_id}/status", response_model=PrescriptionResponse)
def update_prescription_status(
    rx_id: int,
    update: PrescriptionStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Transition prescription status (e.g., 'dispensed', 'cancelled').
    Authorization guard: Restricted to Pharmacists and Administrators.
    """
    if current_user.role not in ["admin", "pharmacist", "doctor"]:
        raise HTTPException(
            status_code=403,
            detail="Access restricted. Only pharmacists or administrators may dispense medications."
        )

    rx = db.query(PrescriptionModel).filter(PrescriptionModel.id == rx_id).first()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")

    rx.status = update.status.lower()
    rx.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(rx)

    return _format_prescription(rx)


@router.get("/patient/{patient_id}", response_model=List[PrescriptionResponse])
def get_patient_prescriptions(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    records = db.query(PrescriptionModel).filter(PrescriptionModel.patient_id == patient_id).all()
    return [_format_prescription(rx, patient_name=patient.name) for rx in records]
