# SwasthaTrack Backend (FastAPI)

Asynchronous REST API powering the SwasthaTrack healthcare platform, built with **FastAPI**, **SQLAlchemy**, and **Pydantic v2**.

## Architecture & Directory Structure

```text
backend/
├── main.py              # Application entry point, middleware & router aggregation
├── database.py          # SQLAlchemy engine, session maker & declarative Base
├── models/              # SQLAlchemy ORM database models
│   ├── appointment.py   # Appointments & scheduling
│   ├── diagnosis.py     # Clinical diagnoses, symptoms & doctor notes
│   ├── lab_report.py    # Diagnostic lab test orders & results
│   ├── medicine.py      # Medicine inventory & stock records
│   ├── patient.py       # Patient profiles & ABHA identifiers
│   ├── prescription.py  # Digital prescriptions & dispensing status
│   ├── queue.py         # Live OPD triage queues & token system
│   └── user.py          # Staff accounts, roles & credentials
├── routes/              # FastAPI route handlers (endpoints)
│   ├── auth.py          # JWT authentication, login & token issuance
│   ├── dashboard.py     # Aggregated stats for role dashboards
│   ├── medicine.py      # Pharmacy inventory CRUD & stock alerts
│   ├── patients.py      # Patient record management & lookups
│   └── queue.py         # OPD queue dispatching & token updates
├── schemas/             # Pydantic models for request validation & response serialization
│   ├── appointment.py
│   ├── auth.py
│   ├── dashboard.py
│   ├── diagnosis.py
│   ├── lab_report.py
│   ├── medicine.py
│   ├── patient.py
│   ├── prescription.py
│   └── queue.py
├── utils/
│   └── security.py      # Password hashing (bcrypt) & JWT token handling
├── tests/               # Pytest integration & unit test suite
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_dashboard.py
│   └── test_medicine.py
├── requirements.txt     # Python dependencies
└── pytest.ini          # Test runner configuration
```

## Key Capabilities

- **Role-Based API Access**: Granular endpoints for Registration, Doctors, Pharmacy, Laboratory, and Admin users.
- **Stateless JWT Authentication**: Secure password hashing via `passlib[bcrypt]` and HS256 JWT tokens with expiry checks.
- **Database Flexibility**: Default lightweight SQLite for zero-config local development, easily switched to PostgreSQL via `DATABASE_URL` for production.
- **Automatic Interactive Docs**: OpenAPI documentation generated automatically at `/docs` (Swagger UI) and `/redoc` (ReDoc).

## Getting Started

### 1. Set Up Python Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default values work out of the box for local SQLite development.

### 4. Run the API Server
```bash
uvicorn main:app --reload --port 8000
```

- API Base: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- Alternative ReDoc: `http://localhost:8000/redoc`

## Running Tests

```bash
pytest
```
Run specific test modules:
```bash
pytest tests/test_auth.py
pytest tests/test_dashboard.py
```
