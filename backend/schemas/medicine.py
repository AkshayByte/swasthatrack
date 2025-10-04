from pydantic import BaseModel
from datetime import date
from typing import Optional

# Base Schema (shared fields)
class MedicineBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int
    expiry_date: Optional[date] = None

# For creating a medicine
class MedicineCreate(MedicineBase):
    pass

# For reading a medicine (with ID)
class Medicine(MedicineBase):
    id: int

    class Config:
        orm_mode = True  # Tells Pydantic to use ORM model (SQLAlchemy)
