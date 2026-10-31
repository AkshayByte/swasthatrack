import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models.patient import Patient
from models.queue import QueueEntry as QueueEntryModel


@pytest.fixture
def sample_patient(db_session: Session):
    patient = Patient(
        name="Rajesh Khanna",
        age=55,
        gender="Male",
        phone="+918888822222",
        registration_number="REG-Q-001",
        status="active",
    )
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    return patient


def _add_to_queue(client: TestClient, token: str, patient_id: int, priority_score: int, check_in_offset=None):
    """Helper: POST a queue entry with the given priority_score."""
    payload = {
        "patient_id": patient_id,
        "service_type": "General OPD",
        "priority": "normal",
        "priority_score": priority_score,
        "queue_number": "",
    }
    return client.post(
        "/api/queue/",
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
    )


def test_queue_entry_accepts_priority_score(client: TestClient, admin_token: str, sample_patient: Patient):
    """POST /api/queue/ must accept and store priority_score."""
    res = _add_to_queue(client, admin_token, sample_patient.id, priority_score=82)
    assert res.status_code == 201
    data = res.json()
    assert data["priority_score"] == 82


def test_queue_priority_score_is_clamped_to_urgency_band(client: TestClient, admin_token: str, sample_patient: Patient):
    """A clinician override must not leave a score outside its urgency band."""
    res = client.post(
        "/api/queue/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "patient_id": sample_patient.id,
            "service_type": "General OPD",
            "priority": "emergency",
            "priority_score": 10,
            "queue_number": "",
        },
    )
    assert res.status_code == 201
    assert res.json()["priority_score"] >= 90


def test_queue_entry_defaults_priority_score(client: TestClient, admin_token: str, sample_patient: Patient):
    """priority_score should default to 25 when not provided."""
    res = client.post(
        "/api/queue/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "patient_id": sample_patient.id,
            "service_type": "General OPD",
            "priority": "normal",
            "queue_number": "",
        },
    )
    assert res.status_code == 201
    assert res.json()["priority_score"] == 25


def test_get_queue_sorted_by_priority_desc_then_checkin_asc(client: TestClient, admin_token: str, db_session: Session, sample_patient: Patient):
    """GET /api/queue/ must sort by priority_score DESC, then check_in_time ASC."""
    from datetime import datetime, timedelta, timezone

    # Insert three entries directly so we control check_in_time ordering.
    base = datetime.now(timezone.utc)
    for idx, (score, offset_seconds) in enumerate([(50, 0), (90, 1), (90, 0)]):
        e = QueueEntryModel(
            patient_id=sample_patient.id,
            queue_number=f"TEST-{score}-{idx:03d}",
            service_type="General OPD",
            status="waiting",
            priority_score=score,
            check_in_time=base + timedelta(seconds=offset_seconds),
        )
        db_session.add(e)
    db_session.commit()

    res = client.get(
        "/api/queue/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    scores = [d["priority_score"] for d in data]
    # Highest score first (90, 90, 50)
    assert scores[0] == 90
    assert scores[-1] == 50
    # The two 90s should be ordered by check_in_time ascending
    assert scores[0] == 90 and scores[1] == 90


def test_get_queue_limit_capped_at_200(client: TestClient, admin_token: str, db_session: Session, sample_patient: Patient):
    """limit must be capped at 200 even if a larger value is requested."""
    for i in range(10):
        e = QueueEntryModel(
            patient_id=sample_patient.id,
            queue_number=f"C-{i:04d}",
            service_type="General OPD",
            status="waiting",
            priority_score=50,
        )
        db_session.add(e)
    db_session.commit()

    res = client.get(
        "/api/queue/?limit=1000",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data) <= 200


def test_get_queue_default_limit_under_200(client: TestClient, admin_token: str, db_session: Session, sample_patient: Patient):
    """Default limit (100) must work and not be affected by the cap."""
    for i in range(5):
        e = QueueEntryModel(
            patient_id=sample_patient.id,
            queue_number=f"D-{i:04d}",
            service_type="General OPD",
            status="waiting",
            priority_score=30,
        )
        db_session.add(e)
    db_session.commit()

    res = client.get(
        "/api/queue/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 5
