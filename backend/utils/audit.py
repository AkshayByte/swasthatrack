from sqlalchemy.orm import Session

from models.audit_log import AuditLog
from models.user import User


def log_audit(
    db: Session,
    user: User,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    detail: str | None = None,
):
    entry = AuditLog(
        user_id=user.id if user else None,
        role=user.role if user else None,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id) if resource_id is not None else None,
        detail=detail,
    )
    db.add(entry)
    db.commit()


def log_read(
    db: Session,
    user: User,
    resource_type: str,
    resource_id: str | None = None,
):
    log_audit(db, user, "read", resource_type, resource_id, detail="Resource accessed")


def log_write(
    db: Session,
    user: User,
    action: str,
    resource_type: str,
    resource_id: str,
):
    log_audit(db, user, action, resource_type, resource_id, detail=f"{action.capitalize()} operation on {resource_type}")
