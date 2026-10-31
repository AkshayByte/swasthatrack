import os
import sys

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Add backend directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set testing flag
os.environ["TESTING"] = "true"

from database import Base, get_db
from main import app
from models.user import User
from utils.limiter import limiter
from utils.security import get_password_hash

limiter.enabled = False


@pytest.fixture(autouse=True)
def reset_gemini_circuit_breaker():
    from utils import gemini_triage

    gemini_triage._reset_circuit_breaker()
    yield
    gemini_triage._reset_circuit_breaker()


# Default to in-memory SQLite. CI also runs this suite against PostgreSQL by
# setting TEST_DATABASE_URL to a PostgreSQL connection string.
TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "").strip()
USING_POSTGRES = TEST_DATABASE_URL.startswith(("postgres://", "postgresql://"))

if USING_POSTGRES:
    if TEST_DATABASE_URL.startswith("postgres://"):
        TEST_DATABASE_URL = TEST_DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
    elif "+psycopg" not in TEST_DATABASE_URL:
        TEST_DATABASE_URL = TEST_DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
    engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
else:
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_engine():
    """Expose the test engine for tests that need their own sessions/threads."""
    return engine

@pytest.fixture(scope="session")
def db_session_factory():
    """Expose the test session factory for threaded concurrency tests."""
    return TestingSessionLocal

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with the test database session."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db_session):
    """Create a test user."""
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        full_name="Test User",
        role="user",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def admin_user(db_session):
    """Create an admin user."""
    user = User(
        email="admin@example.com",
        hashed_password=get_password_hash("adminpassword"),
        full_name="Admin User",
        role="admin",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def token(client, test_user):
    """Get an access token for the test user."""
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "testpassword"}
    )
    return response.json()["access_token"]

@pytest.fixture
def admin_token(client, admin_user):
    """Get an access token for the admin user."""
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"}
    )
    return response.json()["access_token"]

@pytest.fixture
def doctor_token(client, db_session):
    """Create a doctor user and return access token."""
    user = User(
        email="doctor@example.com",
        hashed_password=get_password_hash("doctorpassword"),
        full_name="Dr. Vikram Sethi",
        role="doctor",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    response = client.post(
        "/api/auth/login",
        json={"email": "doctor@example.com", "password": "doctorpassword"}
    )
    return response.json()["access_token"]

@pytest.fixture
def pharmacist_token(client, db_session):
    """Create a pharmacist user and return access token."""
    user = User(
        email="pharmacist@example.com",
        hashed_password=get_password_hash("pharmapassword"),
        full_name="Pharmacist Sunil",
        role="pharmacist",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    response = client.post(
        "/api/auth/login",
        json={"email": "pharmacist@example.com", "password": "pharmapassword"}
    )
    return response.json()["access_token"]

@pytest.fixture
def lab_token(client, db_session):
    """Create a lab technician user and return access token."""
    user = User(
        email="lab@example.com",
        hashed_password=get_password_hash("labpassword"),
        full_name="Lab Tech Meenakshi",
        role="lab",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    response = client.post(
        "/api/auth/login",
        json={"email": "lab@example.com", "password": "labpassword"}
    )
    return response.json()["access_token"]
