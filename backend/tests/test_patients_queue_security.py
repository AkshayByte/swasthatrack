from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

def test_patients_unauthenticated_blocked(client: TestClient):
    response = client.get("/api/patients/")
    assert response.status_code == 401

def test_queue_unauthenticated_blocked(client: TestClient):
    response = client.get("/api/queue/")
    assert response.status_code == 401

def test_patients_admin_authenticated(client: TestClient, admin_token: str):
    # Admin can access patients directory
    response = client.get(
        "/api/patients/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_queue_admin_authenticated(client: TestClient, admin_token: str):
    # Admin can access live queue
    response = client.get(
        "/api/queue/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_patient_delete_non_admin_forbidden(client: TestClient, token: str):
    # Standard user cannot delete patient
    response = client.delete(
        "/api/patients/999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
