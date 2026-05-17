from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.medicine import Medicine

def test_create_medicine_admin(client: TestClient, admin_token: str):
    response = client.post(
        "/api/medicine/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "name": "Test Medicine",
            "generic_name": "Test Generic",
            "current_stock": 100,
            "minimum_stock": 10,
            "unit_price": 5.0,
            "is_active": True
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Medicine"
    assert data["current_stock"] == 100

def test_create_medicine_unauthorized(client: TestClient, token: str):
    response = client.post(
        "/api/medicine/",
        headers={"Authorization": f"Bearer {token}"},  # Normal user
        json={
            "name": "Test Medicine",
            "current_stock": 100
        }
    )
    assert response.status_code == 403

def test_read_medicines(client: TestClient, admin_token: str):
    # Create a medicine first
    client.post(
        "/api/medicine/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Med 1", "current_stock": 10}
    )
    
    response = client.get(
        "/api/medicine/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_update_medicine(client: TestClient, admin_token: str):
    # Create medicine
    create_res = client.post(
        "/api/medicine/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "Old Name", "current_stock": 10}
    )
    med_id = create_res.json()["id"]
    
    # Update
    response = client.put(
        f"/api/medicine/{med_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "New Name", "current_stock": 20}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Name"
    assert data["current_stock"] == 20

def test_delete_medicine(client: TestClient, admin_token: str):
    # Create medicine
    create_res = client.post(
        "/api/medicine/",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"name": "To Delete", "current_stock": 10}
    )
    med_id = create_res.json()["id"]
    
    # Delete
    response = client.delete(
        f"/api/medicine/{med_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 204
    
    # Verify deleted
    get_res = client.get(
        f"/api/medicine/{med_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert get_res.status_code == 404
