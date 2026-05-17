from pydantic import BaseModel, ConfigDict, Field, field_validator
from datetime import date, datetime
from typing import Optional

# Base Schema (shared fields)
class MedicineBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    generic_name: Optional[str] = None
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    current_stock: int = Field(0, ge=0)
    minimum_stock: int = Field(0, ge=0)
    maximum_stock: int = Field(1000, ge=0)
    unit_price: float = Field(0.0, ge=0.0)
    expiry_date: Optional[date] = None
    category: Optional[str] = None
    is_active: bool = True

    @field_validator('maximum_stock')
    @classmethod
    def check_max_stock(cls, v, info):
        if 'minimum_stock' in info.data and v < info.data['minimum_stock']:
            raise ValueError('maximum_stock must be greater than minimum_stock')
        return v

# For creating a medicine
class MedicineCreate(MedicineBase):
    pass

# For reading a medicine (with ID)
class Medicine(MedicineBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
