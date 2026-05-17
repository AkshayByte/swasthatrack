from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.patient import Patient as PatientModel
from schemas.patient import Patient, PatientCreate, PatientUpdate
from datetime import datetime
import json

router = APIRouter()

@router.post("/", response_model=Patient)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    # Check if patient with same phone exists (or registration number)
    existing_patient = db.query(PatientModel).filter(PatientModel.phone == patient.phone).first()
    if existing_patient:
        raise HTTPException(status_code=400, detail="Patient with this phone number already exists")
    
    # Generate registration number if not provided or empty
    if not patient.registration_number:
        # Format: REG-YYYYMMDD-Timestamp
        import time
        patient.registration_number = f"REG{datetime.now().strftime('%Y%m%d')}{int(time.time())}"
    
    existing_reg = db.query(PatientModel).filter(PatientModel.registration_number == patient.registration_number).first()
    if existing_reg:
        # If successfully generated one clashes (unlikely) or user provided existing
        raise HTTPException(status_code=400, detail="Registration number already exists")

    db_patient = PatientModel(
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        phone=patient.phone,
        email=patient.email,
        address=patient.address,
        emergency_contact=patient.emergency_contact,
        blood_group=patient.blood_group,
        allergies=json.dumps(patient.allergies) if patient.allergies else "[]",
        medical_history=json.dumps(patient.medical_history) if patient.medical_history else "[]",
        registration_number=patient.registration_number,
        status=patient.status
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    
    # Return as Pydantic model, manually converting back to list for response
    return Patient(
        id=db_patient.id,
        name=db_patient.name,
        age=db_patient.age,
        gender=db_patient.gender,
        phone=db_patient.phone,
        email=db_patient.email,
        address=db_patient.address,
        emergency_contact=db_patient.emergency_contact,
        blood_group=db_patient.blood_group,
        allergies=json.loads(db_patient.allergies) if db_patient.allergies else [],
        medical_history=json.loads(db_patient.medical_history) if db_patient.medical_history else [],
        registration_number=db_patient.registration_number,
        status=db_patient.status,
        created_at=db_patient.created_at,
        updated_at=db_patient.updated_at,
        registration_date=db_patient.registration_date
    )

@router.get("/", response_model=List[Patient])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = db.query(PatientModel).offset(skip).limit(limit).all()
    # Convert DB models to Pydantic models with parsed JSON
    return [
        Patient(
            id=p.id,
            name=p.name,
            age=p.age,
            gender=p.gender,
            phone=p.phone,
            email=p.email,
            address=p.address,
            emergency_contact=p.emergency_contact,
            blood_group=p.blood_group,
            allergies=json.loads(p.allergies) if p.allergies else [],
            medical_history=json.loads(p.medical_history) if p.medical_history else [],
            registration_number=p.registration_number,
            status=p.status,
            created_at=p.created_at,
            updated_at=p.updated_at,
            registration_date=p.registration_date
        ) for p in patients
    ]

@router.get("/{patient_id}", response_model=Patient)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return Patient(
        id=db_patient.id,
        name=db_patient.name,
        age=db_patient.age,
        gender=db_patient.gender,
        phone=db_patient.phone,
        email=db_patient.email,
        address=db_patient.address,
        emergency_contact=db_patient.emergency_contact,
        blood_group=db_patient.blood_group,
        allergies=json.loads(db_patient.allergies) if db_patient.allergies else [],
        medical_history=json.loads(db_patient.medical_history) if db_patient.medical_history else [],
        registration_number=db_patient.registration_number,
        status=db_patient.status,
        created_at=db_patient.created_at,
        updated_at=db_patient.updated_at,
        registration_date=db_patient.registration_date
    )

@router.put("/{patient_id}", response_model=Patient)
def update_patient(patient_id: int, patient_update: PatientUpdate, db: Session = Depends(get_db)):
    db_patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = patient_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
    
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(patient)
    db.commit()
    return None
