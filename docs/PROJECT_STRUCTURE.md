# SwasthaTrack Project Architecture & File Directory

A detailed map of the SwasthaTrack codebase, detailing folder responsibilities, key components, and service layers across backend, frontend, and documentation.

## High-Level Repository Layout

```text
SwasthaTrack/
├── backend/                 # FastAPI REST API server, SQLAlchemy models, & auth
├── frontend-v2/             # Astro MPA + React Islands clinical dashboards
├── docs/                    # Technical architecture, ABDM guides, design specs & reports
├── mobile/                  # Planned React Native / Expo mobile application architecture
├── .gitignore               # Global version control exclusions
├── LICENSE                  # MIT License
└── README.md                # Main repository documentation & setup guide
```

---

## 1. Backend (`backend/`)

| File / Folder | Role | Description |
|---|---|---|
| `main.py` | Entry point | FastAPI application bootstrap, CORS middleware, and API router assembly |
| `database.py` | Database config | SQLAlchemy engine, session management, and Base definition |
| `models/` | ORM entities | Relational tables (`User`, `Patient`, `Appointment`, `Prescription`, `Medicine`, `LabReport`, `QueueItem`) |
| `routes/` | API controllers | Endpoint implementations for auth, patient search, OPD queue, medicine inventory, and dashboard analytics |
| `schemas/` | Pydantic validation | Request/response DTOs for strict type checking and serialization |
| `utils/security.py` | Auth & cryptography | Bcrypt password hashing, JWT token creation, and verification utilities |
| `tests/` | Test suites | Pytest automation covering auth tokens, dashboard data integrity, and inventory |
| `requirements.txt` | Dependencies | Python library manifests (FastAPI, Uvicorn, SQLAlchemy, Pydantic, Passlib, etc.) |

---

## 2. Frontend (`frontend-v2/`) — Astro + React Islands

| File / Folder | Role | Description |
|---|---|---|
| `src/layouts/Layout.astro` | Layout shell | Global HTML template with header, footer, dark mode toggle, and meta tags |
| `src/pages/index.astro` | Landing page | High-performance static landing page with SEO schema and feature highlights |
| `src/pages/dashboard/` | Dynamic routes | Astro routes hosting client-hydrated departmental dashboards |
| `src/components/react/` | React Islands | Client-hydrated interactive dashboards (`DoctorDashboard.tsx`, `RegistrationDashboard.tsx`, `PharmacyDashboard.tsx`, `LabDashboard.tsx`, `AdminDashboard.tsx`) |
| `src/lib/api.ts` | API client | Type-safe API communication layer targeting FastAPI endpoints |
| `src/styles/global.css` | Design system | Tailwind tokens, HSL color palettes, and glassmorphism styling |

---

## 3. Documentation (`docs/`)

| Document | Purpose |
|---|---|
| `PROJECT_STRUCTURE.md` | This file: repository directory index and component map |
| `PROJECT_REPORT.md` | Comprehensive system design, problem statement, and performance overview |
| `Phase_II_Academic_Report.md` | Formal capstone / academic report with literature review and metrics |
| `DESIGN_SYSTEM.md` | Visual tokens, color schemes, typography, and UI guidelines |
| `ABDM_INTEGRATION_GUIDE.md` | Architecture guide for ABHA ID generation, HFR/HPR, and health data sharing |
| `DASHBOARD_INTEGRATION_GUIDE.md` | Technical guide for cross-dashboard data synchronization |
| `FRONTEND_OUTLINE.md` | Frontend component hierarchy and state flow analysis |

---

## 4. Mobile (`mobile/`)

Reserved for the upcoming **SwasthaTrack Companion App** (React Native / Expo) providing offline OPD triage and digital health records on mobile devices.
