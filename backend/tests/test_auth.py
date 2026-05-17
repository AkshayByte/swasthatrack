from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from models.user import User

def test_register_user(client: TestClient, db_session: Session):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "newpassword123",
            "full_name": "New User",
            "role": "user"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    
    # Verify user in database
    user = db_session.query(User).filter(User.email == "newuser@example.com").first()
    assert user is not None
    assert user.full_name == "New User"

def test_register_existing_email(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",  # Already exists
            "password": "password123",
            "full_name": "Duplicate User",
            "role": "user"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client: TestClient, test_user: User):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_get_current_user(client: TestClient, token: str):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"

def test_get_current_user_invalid_token(client: TestClient):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalidtoken"}
    )
    assert response.status_code == 401
