from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from models.medicine import Medicine
from schemas.medicine import Medicine as MedicineSchema, MedicineCreate
from database import get_db
from routes.auth import get_current_user
from models.user import User

# Prefix is handled in main.py
router = APIRouter()

@router.get("/", response_model=List[MedicineSchema])
def read_medicines(
    skip: int = Query(0, ge=0), 
    limit: int = Query(100, ge=1, le=1000), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Medicine).offset(skip).limit(limit).all()

@router.post("/", response_model=MedicineSchema, status_code=status.HTTP_201_CREATED)
def create_medicine(
    medicine: MedicineCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "pharmacist"]:
        raise HTTPException(status_code=403, detail="Not authorized to create medicines")
        
    db_medicine = Medicine(**medicine.model_dump())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.get("/{medicine_id}", response_model=MedicineSchema)
def read_medicine(
    medicine_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine

@router.put("/{medicine_id}", response_model=MedicineSchema)
def update_medicine(
    medicine_id: int, 
    medicine: MedicineCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "pharmacist"]:
        raise HTTPException(status_code=403, detail="Not authorized to update medicines")

    db_medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    update_data = medicine.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_medicine, key, value)
    
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.delete("/{medicine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medicine(
    medicine_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "pharmacist"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete medicines")

    db_medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    db.delete(db_medicine)
    db.commit()
    return None