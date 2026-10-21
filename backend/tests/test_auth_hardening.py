from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch
import os
import importlib
from models.user import User
from utils.security import get_password_hash


# ─── (a) GOOGLE_CLIENT_ID empty → 503 ─────────────────────────────────────────

def test_google_login_fails_closed_when_client_id_missing(client: TestClient, db_session: Session):
    """If GOOGLE_CLIENT_ID is empty, /auth/google must fail closed with 503."""
    email = "noclientid@example.com"

    with patch.dict(os.environ, {"GOOGLE_CLIENT_ID": ""}):
        with patch("google.oauth2.id_token.verify_oauth2_token", return_value={
            "email": email, "name": "No Client", "email_verified": True, "sub": "123"
        }):
            response = client.post(
                "/api/auth/google",
                json={"credential": "fake_jwt"},
            )
    assert response.status_code == 503
    assert "not configured" in response.json()["detail"].lower()


# ─── (b) No hardcoded superadmin email ─────────────────────────────────────────

def test_google_login_no_hardcoded_superadmin(client: TestClient, db_session: Session):
    """SUPERADMIN_EMAILS must be the only source of superadmin elevation.
    The previously hardcoded akshayislesnar@gmail.com must NOT auto-elevate."""
    email = "akshayislesnar@gmail.com"

    env_backup = os.environ.copy()
    os.environ["SUPERADMIN_EMAILS"] = "someoneelse@example.com"
    try:
        with patch("google.oauth2.id_token.verify_oauth2_token", return_value={
            "email": email, "name": "Akshay", "email_verified": True, "sub": "123"
        }):
            response = client.post(
                "/api/auth/google",
                json={"credential": "fake_jwt"},
            )
    finally:
        os.environ.clear()
        os.environ.update(env_backup)

    assert response.status_code == 200
    user = db_session.query(User).filter(User.email == email).first()
    assert user is not None
    assert user.role == "user"  # Must NOT be admin


def test_google_login_superadmin_from_env_only(client: TestClient, db_session: Session):
    """Emails in SUPERADMIN_EMAILS get admin role."""
    email = "rightfuladmin@example.com"

    env_backup = os.environ.copy()
    os.environ["SUPERADMIN_EMAILS"] = "rightfuladmin@example.com"
    try:
        with patch("google.oauth2.id_token.verify_oauth2_token", return_value={
            "email": email, "name": "Admin", "email_verified": True, "sub": "123"
        }):
            response = client.post(
                "/api/auth/google",
                json={"credential": "fake_jwt"},
            )
    finally:
        os.environ.clear()
        os.environ.update(env_backup)

    assert response.status_code == 200
    user = db_session.query(User).filter(User.email == email).first()
    assert user is not None
    assert user.role == "admin"


# ─── (c) is_active checks ───────────────────────────────────────────────────

def test_login_rejects_inactive_user(client: TestClient, db_session: Session):
    """POST /api/auth/login must return 403 for a deactivated user."""
    user = User(
        email="inactive@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Inactive User",
        role="user",
        is_active=False,
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/auth/login",
        json={"email": "inactive@example.com", "password": "password123"},
    )
    assert response.status_code == 403
    assert "deactivated" in response.json()["detail"].lower()


def test_token_rejects_inactive_user(client: TestClient, db_session: Session):
    """POST /api/auth/token must return 403 for a deactivated user."""
    user = User(
        email="inactive_token@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Inactive Token User",
        role="user",
        is_active=False,
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/auth/token",
        data={"username": "inactive_token@example.com", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 403
    assert "deactivated" in response.json()["detail"].lower()


def test_get_current_user_rejects_inactive_user(client: TestClient, db_session: Session):
    """GET /api/auth/me must reject a deactivated user even with a valid token."""
    from utils.security import create_access_token
    from datetime import timedelta

    user = User(
        email="inactive_me@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Inactive Me User",
        role="user",
        is_active=True,  # Start active, generate token, then deactivate
    )
    db_session.add(user)
    db_session.commit()

    token = create_access_token(
        data={"user_id": user.id, "role": user.role, "sub": user.email},
        expires_delta=timedelta(minutes=30),
    )

    # Deactivate the user after token issuance
    user.is_active = False
    db_session.commit()

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code in (401, 403)


# ─── (d) Secret key check in production ─────────────────────────────────────

def test_secret_key_check_raises_in_production_with_default():
    """In production, a default SECRET_KEY must raise at startup."""
    import utils.security as security
    with patch.object(security, "ENVIRONMENT", "production"), \
         patch.object(security, "SECRET_KEY", None):
        with patch.dict(os.environ, {"ENVIRONMENT": "production"}, clear=False):
            try:
                security.validate_secret_key()
                raised = False
            except RuntimeError:
                raised = True
            assert raised, "Expected RuntimeError for missing SECRET_KEY in production"


def test_secret_key_check_raises_in_production_with_dev_default():
    """In production, the dev default SECRET_KEY must raise at startup."""
    import utils.security as security
    with patch.object(security, "ENVIRONMENT", "production"), \
         patch.object(security, "SECRET_KEY", "dev_secret_key_change_in_production"):
        try:
            security.validate_secret_key()
            raised = False
        except RuntimeError:
            raised = True
        assert raised, "Expected RuntimeError for dev-default SECRET_KEY in production"


def test_secret_key_check_passes_in_development():
    """In development, a missing or default SECRET_KEY should NOT raise."""
    import utils.security as security
    with patch.object(security, "ENVIRONMENT", "development"), \
         patch.object(security, "SECRET_KEY", "dev_secret_key_change_in_production"):
        security.validate_secret_key()  # Should not raise
