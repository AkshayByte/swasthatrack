from datetime import date, datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, Date, DateTime, Float, Integer, String
from sqlalchemy import update as sa_update
from sqlalchemy.orm import Session, relationship

from database import Base

if TYPE_CHECKING:
    from models.prescription import PrescriptionItem


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

    prescription_items = relationship("PrescriptionItem", back_populates="medicine")

    @classmethod
    def deduct_stock(cls, db: Session, items: list["PrescriptionItem"]) -> tuple:
        """
        Atomically decrement stock for each prescription item.

        For each item runs:
            UPDATE medicines SET current_stock = current_stock - :qty
            WHERE id = :id AND current_stock >= :qty

        Returns (insufficient: List[str], expired: List[str]) — names of medicines
        that could not be deducted (short stock or expired).
        If either list is non-empty, the caller should roll back.
        """
        insufficient: list[str] = []
        expired: list[str] = []

        for item in items:
            if item.medicine_id is None:
                continue

            med = db.query(cls).filter(cls.id == item.medicine_id).first()
            if med is None:
                insufficient.append(item.medicine_name)
                continue
            if med.expiry_date and med.expiry_date < date.today():
                expired.append(med.name)
                insufficient.append(med.name)
                continue

            stmt = (
                sa_update(cls)
                .where(
                    cls.id == item.medicine_id,
                    cls.current_stock >= item.quantity,
                )
                .values(current_stock=cls.current_stock - item.quantity)
            )
            result = db.execute(stmt)
            if result.rowcount == 0:
                insufficient.append(med.name)

        return insufficient, expired
