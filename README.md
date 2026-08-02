# SwasthaTrack (स्वस्थTrack)

> **A synchronized, role-based hospital workflow and OPD management platform aligned with the Ayushman Bharat Digital Mission (ABDM).**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite / PostgreSQL](https://img.shields.io/badge/Database-SQLite%20%7C%20Postgres-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 💡 Why SwasthaTrack?

In most mid-sized hospitals and community healthcare facilities, operations are handled through fragmented systems or paper slips:
- Receptionists handwrite OPD tokens without real-time queue visibility.
- Doctors handwrite prescriptions that pharmacists struggle to decipher or fulfill accurately.
- Diagnostic lab orders are passed around manually, causing delays in patient care.
- Patients must wait in physical lines just to collect printed test results.

**SwasthaTrack eliminates these silos.** It connects all 5 core hospital departments into a single synchronized digital workflow:

```
                  ┌────────────────────────────────────────┐
                  │      1. REGISTRATION & TRIAGE          │
                  │   Patient Check-in / ABHA ID Lookup    │
                  │      Token Assigned to Doctor Queue    │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │          2. DOCTOR CONSULTATION        │
                  │   Queue Popped -> Clinical Diagnosis   │
                  │    E-Prescription & Lab Test Orders    │
                  └─────────┬──────────────────┬───────────┘
                            │                  │
               Prescription │                  │ Lab Order
                  Dispatched│                  │ Dispatched
                            ▼                  ▼
     ┌────────────────────────────┐      ┌────────────────────────────┐
     │   3. PHARMACY & INVENTORY  │      │     4. DIAGNOSTIC LAB      │
     │ Instant Order Feed         │      │ Sample Collection          │
     │ Live Stock Auto-Deduction  │      │ Result Entry & PDF Upload  │
     └─────────────┬──────────────┘      └─────────────┬──────────────┘
                   │                                   │
                   └─────────────────┬─────────────────┘
                                     │ Reports & Prescriptions
                                     │ Available Instantly
                                     ▼
                  ┌────────────────────────────────────────┐
                  │            5. PATIENT PORTAL           │
                  │ Digital Prescription & Lab PDFs Online │
                  │      Zero Waiting for Paper Reports    │
                  └────────────────────────────────────────┘
```

---

## 🏥 Role-Based Dashboards

SwasthaTrack provides 5 dedicated interfaces tailored to each stakeholder's responsibilities:

| Dashboard | Target User | Key Capabilities |
|---|---|---|
| **Registration Desk** | Front Desk & Triage | Fast patient onboarding, ABHA ID verification, OPD queue generation, doctor allocation |
| **Doctor Station** | Physicians & Consultants | Live queue management, clinical notes, symptom entry, e-prescribing, direct lab order dispatch |
| **Pharmacy** | Pharmacists & Inventory Staff | Live order feed from doctors, 1-click dispensing, batch tracking, low-stock & expiry alerts |
| **Laboratory** | Lab Technicians & Pathologists | Pending test queue, sample status tracking, report uploading, verified result publishing |
| **Patient Portal** | Patients & Families | Self-service view of health timeline, download prescriptions, and access lab results remotely |

---

## 🛠️ Architecture & Tech Stack

### Backend (`/backend`)
- **FastAPI (Python)**: High-throughput async REST API with automatic OpenAPI documentation.
- **SQLAlchemy ORM**: Flexible schema management; runs on SQLite for zero-setup local dev and PostgreSQL for production.
- **Pydantic v2**: Strict request and response payload validation.
- **Security**: Stateless JWT tokens with expiration handling, bcrypt password hashing, and role-based authorization middleware (RBAC).

### Frontend (`/frontend-v2`)
- **Astro (MPA Architecture)**: Delivers near-zero JavaScript on public pages for optimal performance and SEO, with **React Islands** (`client:load`) for rich interactive clinical dashboards.
- **React 18 + TypeScript**: Type-safe component trees for complex clinical state management.
- **Tailwind CSS & shadcn/ui**: Clean clinical design system supporting both Light and Dark modes.

---

## 📂 Repository Structure

```text
SwasthaTrack/
├── backend/                 # FastAPI REST API, database models, routes, and test suites
│   ├── main.py              # Server entry point & route registration
│   ├── database.py          # SQLAlchemy connection & session handling
│   ├── models/              # DB schemas: User, Patient, Prescription, Medicine, Queue, etc.
│   ├── routes/              # Modular API endpoints (auth, queue, medicines, patients, etc.)
│   ├── schemas/             # Pydantic request/response models
│   ├── tests/               # Pytest automated test suites
│   └── requirements.txt     # Python dependencies
├── frontend-v2/             # Astro MPA + React Islands dashboards
│   ├── src/
│   │   ├── components/react # Hydrated React dashboard islands
│   │   ├── layouts/         # Base layout with theme toggle & navigation
│   │   ├── pages/           # Astro file-based routes & dynamic dashboard pages
│   │   └── lib/api.ts       # Type-safe API communication layer
│   └── package.json
├── docs/                    # Architecture diagrams, ABDM guides, reports, and design specs
│   ├── ABDM_INTEGRATION_GUIDE.md
│   ├── DASHBOARD_INTEGRATION_GUIDE.md
│   ├── DESIGN_SYSTEM.md
│   ├── PROJECT_STRUCTURE.md
│   ├── PROJECT_REPORT.md
│   └── Phase_II_Academic_Report.md
├── mobile/                  # Roadmap & specs for React Native / Expo companion app
├── .gitignore               # Clean multi-stack git exclusions
└── README.md                # Project documentation
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**
- **Git**

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
# Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy sample environment configuration
cp .env.example .env

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Alternative ReDoc**: `http://localhost:8000/redoc`

---

### 2. Frontend Setup (Astro + React Islands)

In a new terminal window:

```bash
# Navigate to frontend-v2
cd frontend-v2

# Install dependencies
npm install

# Start the development server
npm run dev
```

- **Frontend App**: `http://localhost:4321` (or indicated terminal port)

---

## 🧪 Testing Backend Endpoints

SwasthaTrack includes a Pytest suite covering authentication, queue transitions, and inventory endpoints:

```bash
cd backend
pytest -v
```

---

## 🔒 Security & Data Compliance

- **Role-Based Access Control (RBAC)**: Route-level protection prevents unauthorized cross-department data tampering (e.g., pharmacists cannot alter clinical diagnosis notes).
- **Stateless Tokens**: JWTs with configurable lifespans and bearer authentication headers.
- **Data Validation**: Strict Pydantic models shield the database against malformed payloads and injection attempts.
- **ABDM-Ready Architecture**: Data structures aligned with the National Health Authority (NHA) standards for ABHA linkage and consent artifacts.

---

## 🗺️ Roadmap

- [x] 5-Role specialized hospital dashboards (Registration, Doctor, Pharmacy, Lab, Patient)
- [x] Real-time OPD queue dispatching & token generation
- [x] Fast, decoupled FastAPI backend with SQLite/PostgreSQL portability
- [x] Migration to Astro MPA + React Islands architecture for maximum SEO and performance
- [ ] Direct sandbox integration with ABDM Gateway APIs (M1, M2, M3 milestones)
- [ ] React Native / Expo mobile companion for offline rural clinic triage (`mobile/`)
- [ ] Automated SMS/WhatsApp notifications for patient token and report readiness

---

## 📖 Additional Documentation

- [Project Directory & File Structure](docs/PROJECT_STRUCTURE.md)
- [Design System & UI Guidelines](docs/DESIGN_SYSTEM.md)
- [ABDM Integration Guide](docs/ABDM_INTEGRATION_GUIDE.md)
- [Dashboard Integration Technical Guide](docs/DASHBOARD_INTEGRATION_GUIDE.md)
- [Comprehensive Project Report](docs/PROJECT_REPORT.md)
- [Academic Capstone Report](docs/Phase_II_Academic_Report.md)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
