from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.queue import QueueEntry as QueueEntryModel
from models.user import User
from routes.auth import get_current_user
from schemas.queue import QueueEntry, QueueEntryCreate, TriageRequest, TriageResponse, QueueStatus
from utils.gemini_triage import analyze_clinical_triage
from datetime import datetime, timezone

router = APIRouter()

@router.post("/ai-triage", response_model=TriageResponse)
async def perform_ai_triage(
    request: TriageRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Asynchronous AI Triage pipeline powered by Google Gemini API.
    Evaluates patient symptoms, vitals, and medical history to assign acuity level and queue priority.
    """
    if current_user.role not in ["admin", "registration", "doctor", "pharmacist", "lab"]:
        raise HTTPException(status_code=403, detail="Not authorized to run clinical AI triage")
    
    triage_result = await analyze_clinical_triage(request)
    return triage_result

@router.post("/", response_model=QueueEntry, status_code=status.HTTP_201_CREATED)
def add_to_queue(
    entry: QueueEntryCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "registration", "doctor"]:
        raise HTTPException(status_code=403, detail="Not authorized to triage patients to queue")

    # Auto-generate queue number if empty or not provided (format: Q-YYYYMMDD-001)
    if not entry.queue_number or entry.queue_number.strip() == "":
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        today_str = today_start.strftime("%Y%m%d")
        count = db.query(QueueEntryModel).filter(QueueEntryModel.created_at >= today_start).count()
        candidate = f"Q-{today_str}-{(count + 1):03d}"
        while db.query(QueueEntryModel).filter(QueueEntryModel.queue_number == candidate).first() is not None:
            count += 1
            candidate = f"Q-{today_str}-{(count + 1):03d}"
        entry.queue_number = candidate
    
    db_entry = QueueEntryModel(
        patient_id=entry.patient_id,
        queue_number=entry.queue_number,
        service_type=entry.service_type,
        doctor_id=entry.doctor_id,
        doctor_name=entry.doctor_name,
        priority=entry.priority,
        status=entry.status,
        estimated_wait_time=entry.estimated_wait_time,
        notes=entry.notes
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[QueueEntry])
def read_queue(
    skip: int = 0, 
    limit: int = 100, 
    status: str = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "doctor", "registration", "pharmacist", "lab"]:
        raise HTTPException(status_code=403, detail="Not authorized to inspect live clinical queue")

    query = db.query(QueueEntryModel)
    if status:
        query = query.filter(QueueEntryModel.status == status)
        
    entries = query.order_by(QueueEntryModel.check_in_time).offset(skip).limit(limit).all()
    return entries

@router.get("/{entry_id}", response_model=QueueEntry)
def read_queue_entry(
    entry_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "doctor", "registration", "pharmacist", "lab"]:
        raise HTTPException(status_code=403, detail="Not authorized to view queue entry")

    entry = db.query(QueueEntryModel).filter(QueueEntryModel.id == entry_id).first()
    if entry is None:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    return entry

@router.put("/{entry_id}/status", response_model=QueueEntry)
def update_queue_status(
    entry_id: int, 
    status: QueueStatus, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "doctor", "registration", "pharmacist", "lab"]:
        raise HTTPException(status_code=403, detail="Not authorized to transition queue state")

    entry = db.query(QueueEntryModel).filter(QueueEntryModel.id == entry_id).first()
    if entry is None:
        raise HTTPException(status_code=404, detail="Queue entry not found")
        
    entry.status = status.value
    if status == QueueStatus.COMPLETED:
        entry.completed_at = datetime.now(timezone.utc)
    elif status in [QueueStatus.IN_PROGRESS, QueueStatus.CALLED]:
        entry.called_at = datetime.now(timezone.utc)
        
    db.commit()
    db.refresh(entry)
    return entry
