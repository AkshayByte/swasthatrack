from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..models.medicine import Medicine
from ..schemas.medicine import Medicine as MedicineSchema, MedicineCreate
from ..db import get_db

router = APIRouter(prefix="/medicines", tags=["medicines"])

@router.get("/", response_model=List[MedicineSchema])
def read_medicines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Medicine).offset(skip).limit(limit).all()

@router.post("/", response_model=MedicineSchema)
def create_medicine(medicine: MedicineCreate, db: Session = Depends(get_db)):
    db_medicine = Medicine(**medicine.dict())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.get("/{medicine_id}", response_model=MedicineSchema)
def read_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine

@router.put("/{medicine_id}", response_model=MedicineSchema)
def update_medicine(medicine_id: int, medicine: MedicineCreate, db: Session = Depends(get_db)):
    db_medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    for key, value in medicine.dict().items():
        setattr(db_medicine, key, value)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    db_medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(db_medicine)
    db.commit()
    return {"ok": True}