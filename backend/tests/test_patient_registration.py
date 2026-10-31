from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


def _payload(**overrides):
    payload = {
        "name": "Asha Verma",
        "age": 34,
        "gender": "Female",
        "phone": "+919876543210",
    }
    payload.update(overrides)
    return payload


def test_create_patient_without_registration_number_generates_one(
    client: TestClient, admin_token: str
):
    response = client.post(
        "/api/patients/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json=_payload(),
    )

    assert response.status_code == 201
    registration_number = response.json()["registration_number"]
    assert registration_number
    assert registration_number.startswith("REG")


def test_create_patient_normalizes_phone(client: TestClient, admin_token: str, db_session: Session):
    response = client.post(
        "/api/patients/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json=_payload(phone="+91 98765 43210"),
    )

    assert response.status_code == 201
    assert response.json()["phone"] == "+919876543210"

    from models.patient import Patient

    stored = db_session.query(Patient).filter(Patient.phone == "+919876543210").first()
    assert stored is not None


def test_create_patient_rejects_invalid_phone(client: TestClient, admin_token: str):
    response = client.post(
        "/api/patients/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json=_payload(phone="12345"),
    )

    assert response.status_code == 422
