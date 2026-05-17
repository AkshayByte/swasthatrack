from sqlalchemy import Column, Integer, String, Date, Float, Boolean, DateTime
from database import Base
from datetime import datetime, timezone

class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    generic_name = Column(String, index=True)
    description = Column(String)
    manufacturer = Column(String, index=True)
    current_stock = Column(Integer, default=0)
    minimum_stock = Column(Integer, default=0)
    maximum_stock = Column(Integer, default=1000)
    unit_price = Column(Float, default=0.0)
    expiry_date = Column(Date)
    category = Column(String, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))