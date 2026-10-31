# 🏥 SwasthaTrack — Intelligent Healthcare Management & Clinical Workflow Engine

[![CI Pipeline](https://github.com/AkshayByte/swasthatrack/actions/workflows/ci.yml/badge.svg)](https://github.com/AkshayByte/swasthatrack/actions/workflows/ci.yml)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.147%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Astro](https://img.shields.io/badge/Frontend-Astro_7.4_%2B_React-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Container-Docker_Multi--Stage-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Render](https://img.shields.io/badge/Deploy-Render_Cloud-46E3B7?logo=render&logoColor=white)](https://render.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel_Edge-000000?logo=vercel&logoColor=white)](https://vercel.com)

SwasthaTrack is a Hospital Management Information System (HMIS) and clinical workflow engine designed to reduce departmental silos, streamline patient transitions, and support emergency triage with a combined AI and rule-based engine.

---

## 📑 Table of Contents

1. [System Architecture](#-system-architecture)
2. [End-to-End Clinical Workflow](#-end-to-end-clinical-workflow)
3. [AI Clinical Triage Engine & Quantification](#-ai-clinical-triage-engine--quantification)
4. [Security, Governance & Production Hardening](#-security-governance--production-hardening)
5. [Technology Stack & Architectural Rationale](#-technology-stack--architectural-rationale)
6. [Infrastructure, Containerization & CI/CD](#-infrastructure-containerization--cicd)
7. [Cloud Deployment Guide](#-cloud-deployment-guide)
8. [Comprehensive Technical Interview Guide & Q/A](#-comprehensive-technical-interview-guide--qa)
9. [Local Development & Testing](#-local-development--testing)
10. [Limitations & Roadmap](#-limitations--roadmap)

---

## 🏛 System Architecture

SwasthaTrack utilizes a modern decoupled architecture:
- **Frontend**: Astro MPA with React Islands deployed to **Vercel**, with static pages and small hydrated dashboard components.
- **Backend**: FastAPI service running in a multi-stage **Docker** container behind **Gunicorn (Uvicorn Workers)** on **Render**.
- **Database**: **PostgreSQL** in production and SQLite for local development, with connection pooling (`pool_pre_ping=True`) and **Alembic** schema migrations.
- **AI Intelligence**: **Google Gemini** (configurable via `GEMINI_MODEL` env var, recommended: `gemini-3.8-flash`) integrated asynchronously with a deterministic clinical heuristic fallback engine (Emergency Severity Index + Shock Index calculation + pediatric age bands).
- **Security & Rate Limiting**: Zero-trust RBAC with **SlowAPI** rate limiting, **Google Identity Services (OAuth 2.0)**, and SuperAdmin email elevation.

```mermaid
graph TD
    User["Clinical Staff / Patient Browser"] -->|"HTTPS / Edge CDN"| Vercel["Vercel Edge (Astro + React Islands)"]
    User -->|"REST API / Bearer JWT & Google OAuth"| Render["Render Web Service (FastAPI + Gunicorn ASGI)"]
    
    subgraph "Render Cloud Ecosystem"
        Render -->|"SQLAlchemy Connection Pool"| Postgres[("Managed PostgreSQL Database")]
        Render -->|"Async REST Call (timeout: 3s)"| Gemini["Google Gemini API (configurable model)"]
        Render -->|"Deterministic Fallback"| ESI["Heuristic ESI & Shock Index Engine"]
        Render -->|"SlowAPI Protection"| RateLimit["Rate Limiting & Threat Shield"]
    end

    subgraph "CI/CD Pipeline"
        GitHub["GitHub Repository (main)"] -->|"git push"| GHA["GitHub Actions CI"]
        GHA -->|"Lint & Pytest (117 Tests)"| TestPass["Automated Test Verification"]
        TestPass -->|"Webhook Auto-Deploy"| Render
        TestPass -->|"Edge Auto-Deploy (12 Pages)"| Vercel
    end
```

---

## 🔄 End-to-End Clinical Workflow

SwasthaTrack digitizes and synchronizes hospital operations across 5 dedicated role-based clinical consoles:

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    actor RegDesk as Registration & Triage
    actor Doctor as Doctor Station
    actor Pharmacy as Pharmacy Station
    actor Lab as Diagnostic Laboratory
    actor Admin as Hospital Admin

    Patient->>RegDesk: Presents with acute symptoms & vitals
    RegDesk->>RegDesk: Captures SpO2, BP, Pulse, Temp & History
    RegDesk->>RegDesk: Calls server triage API (Gemini + heuristic fallback)
    RegDesk->>Doctor: Generates digital OPD Token (High priority queued first)
    Doctor->>Doctor: Reviews Patient Timeline, EMR & AI Triage Score
    Doctor->>Doctor: Enters Diagnosis (SOAP) + Prescribes Rx + Orders Labs
    Doctor-->>Pharmacy: Dispatches e-Prescription to live dispensary queue
    Doctor-->>Lab: Dispatches diagnostic lab requisition order
    Pharmacy->>Pharmacy: Verifies stock, dispenses medication & updates inventory
    Lab->>Lab: Accessions specimen, enters diagnostic results & syncs to EMR
    Admin->>Admin: Monitors queue, prescription, lab and inventory metrics
```

### Role-Based Dashboard Capabilities

| Clinical Console | Primary Responsibilities | Key Technologies Used |
|---|---|---|
| **1. Registration & Triage** | Patient digital intake, registration number allocation, full vital capture, server-side triage scoring,<br>queue dispatch sorted by priority score (critical cases first). | React, FastAPI Triage API, Lucide Icons |
| **2. Doctor Station** | Live urgency-sorted queue, patient context, diagnosis notes, prescription creation, and lab order creation. | React, Axios, JWT RBAC |
| **3. Pharmacy Station** | Incoming prescription feed, stock tracking, low-stock alerts, and dispensing with server-side stock deduction. | React, 10-second polling, Tailwind CSS |
| **4. Diagnostic Lab** | Test order tracking, specimen status lifecycle (`pending` → `sample_collected` → `in_analysis` → `completed`), free-text result entry. | React, FastAPI lab endpoints |
| **5. Administration** | Live patient, queue, prescription, lab, and inventory metrics from the database. | React, FastAPI aggregate dashboard endpoint |

---

## 🧠 AI Clinical Triage Engine & Quantification

SwasthaTrack features a resilient dual-engine clinical triage engine in [`backend/utils/gemini_triage.py`](backend/utils/gemini_triage.py) with all clinical thresholds centralized in [`backend/utils/triage_thresholds.py`](backend/utils/triage_thresholds.py).

### 1. Dual-Engine Architecture (Heuristic-First)
1. **Deterministic Heuristic Engine (always runs first)**: Instantly evaluates patient vitals and symptoms using the Emergency Severity Index protocol, including:
   - Shock Index calculation (`HR / SBP`) for adults only (pediatric norms excluded per clinician review)
   - Pediatric age bands (neonatal/infant thresholds for bradycardia) with `# TODO(clinician-review)` markers
   - Word-boundary symptom matching with negation detection (e.g., "no chest pain" does not trigger emergency; "history of asthma" overrides asthma trigger)
   - Critical bradycardia (<50 BPM), hyperpyrexia, hypotensive shock, hypertensive crisis detection
2. **Primary AI Engine (Google Gemini)**: If `GEMINI_API_KEY` and `GEMINI_MODEL` are configured, calls Gemini asynchronously via the `x-goog-api-key` header (not URL parameter) with a 3-second timeout and 1 retry. Uses a shared `httpx.AsyncClient` for connection reuse.
3. **Winner Selection**: Returns the **higher urgency** of the two engines, with ties broken by higher `priority_score`.

**Failure modes (all fall back to heuristic)**: API key missing, model not set, network errors, HTTP 429, timeouts, invalid JSON, invalid urgency values.

### 2. Clinical Quantification Logic & Thresholds
All clinical threshold constants are centralized in [`backend/utils/triage_thresholds.py`](backend/utils/triage_thresholds.py) with `# TODO(clinician-review)` markers for values requiring clinical validation:

| Urgency | Priority score | Target wait | Vitals markers | Symptom triggers |
|---|---|---|---|---|
| **Emergency** | 90–100 | 0 min (immediate resuscitation) | SpO₂ < 90%; systolic BP < 90 mmHg; shock index ≥ 0.9 (adults only); temperature ≥ 103.5°F | Severe hemorrhage, chest pain, stroke, unconsciousness, vomiting blood |
| **High** | 70–89 | ~10 min | 90% ≤ SpO₂ < 93%; temperature 101.5–103.5°F; HR > 130 bpm; HR < 50 bpm (adults); pediatric bradycardia (neonate < 100, infant < 90); systolic BP ≥ 180 or diastolic BP ≥ 110 mmHg | Fractures, acute asthma, severe pain, seizures, burns |
| **Medium** | 40–69 | ~25 min | HR 100–130 bpm; stable vitals otherwise | Fever, vomiting, diarrhea, headache, sprains |
| **Low** | 1–39 | ~40 min | Normal vitals | Routine checkup, medication refill |

#### Hemorrhage & Shock Index Formula
To quantify bleeding and prevent hypovolemic collapse:
$$\text{Shock Index (SI)} = \frac{\text{Heart Rate (BPM)}}{\text{Systolic Blood Pressure (mmHg)}}$$
- **Normal SI**: $0.5 - 0.7$
- **High Risk / Impending Shock**: $\text{SI} \ge 0.9$ $\longrightarrow$ Escalates patient immediately to **EMERGENCY** (Priority: 96, Wait: 0 mins) regardless of patient complaints.

---

## 🛡️ Security, Governance & Production Hardening

SwasthaTrack adheres to enterprise-grade clinical data integrity and threat mitigation principles:

### 1. Zero-Trust Role-Based Access Control (RBAC)
- **Synchronized Role Typing**: `UserRole` enum (`admin`, `doctor`, `pharmacist`, `lab`, `registration`, `user`) used by the Pydantic auth schemas and route allow-lists; the database column stores the role string.
- **Privilege Escalation Guard**: Public self-registration (`POST /api/auth/register`) strictly hardcodes `role = user`. Any client-injected role payload is stripped.
- **Admin Provisioning**: Clinical staff accounts (`doctor`, `pharmacist`, `lab`) can only be provisioned through the protected `POST /api/auth/users` endpoint requiring an authenticated `admin` JWT.

### 2. Google OAuth 2.0 & SuperAdmin Automatic Elevation
- Built with **Google Identity Services (GSI)** SDK.
- Server-side token validation verifies Google's cryptographic RSA signatures against Google's public JWKS certificates.
- Configurable `SUPERADMIN_EMAILS` whitelist automatically provisions or upgrades authenticated owner accounts to SuperAdmin status without exposing static passwords.

### 3. Core Clinical Routers (Dual-Mounted)
- **Prescriptions Engine** (`/api/prescriptions/` & `/prescriptions/`):
  - `POST /`: Doctor issues structured digital prescription (drug, dosage, frequency, duration).
  - `PUT /{id}/status`: Pharmacist dispenses prescription and updates live inventory.
  - `GET /patient/{id}`: Longitudinal patient prescription history.
- **Lab Requisitions Engine** (`/api/lab-orders/` & `/lab-orders/`):
  - `POST /`: Doctor requests diagnostic lab tests.
  - `PUT /{id}/status`: Lab technician updates specimen collection status and publishes quantitative test results.

### 4. Audit Logging
- All critical clinical data operations (create, read, update, delete) are logged to the `audit_log` table via the [`backend/utils/audit.py`](backend/utils/audit.py) helper module.
- Logged endpoints include patients, prescriptions, and lab orders.
- The `AuditLog` model records: `user_id`, `role`, `action`, `resource_type`, `resource_id`, `timestamp`, and `detail`.

### 5. Queue Concurrency & Integrity Protection
- **Queue Concurrency & Integrity Protection**:
 - **Priority-Queued Tokens**: Queue entries are sorted by `priority_score DESC`, then `check_in_time ASC`, ensuring critical acuity cases are seen first. The `limit` parameter is capped at 200.
 - **Date-Prefixed Tokens**: Tokens are generated in `Q-YYYYMMDD-001` format, preventing token collision across consecutive hospital operating dates.
- **Concurrency Loop**: Uses database-level collision detection loops to resolve race conditions between concurrent triage reception desks.
- **Status Validation**: `PUT /api/queue/{id}/status` accepts the `QueueStatus(str, Enum)` values (`waiting`, `called`, `in-progress`, `completed`, `cancelled`, `no-show`); unknown values return HTTP 422. Transition ordering is not enforced.

### 5. SlowAPI Rate Limiting & Abuse Prevention
- Integrated **SlowAPI** middleware to safeguard against credential stuffing, brute force, and DDoS attacks.
- Configured limits:
  - `POST /api/auth/login`: **10 requests / minute**
  - `POST /api/auth/register`: **10 requests / minute**
  - `POST /api/auth/token`: **15 requests / minute**
  - `POST /api/auth/google`: **15 requests / minute**
- Exceeding thresholds returns a standardized `429 Too Many Requests` response.

### 6. Strict Origin CORS Whitelist
- Eliminated permissive regex wildcards (`https?://.*`).
- Defaults to trusted origins (`https://swasthatrack.vercel.app`, `http://localhost:4321`, `3000`, `5173`), with a restricted regex that only matches this project's Vercel preview URLs (`https://swasthatrack-*.vercel.app`).

### 7. Clinical Decision Support System (CDSS) Advisory Notice
- To comply with clinical software regulations and mitigate medico-legal liability, AI triage outputs and risk indicators are accompanied by explicit advisory disclaimers:
  > *"Clinical Decision Support Notice: AI Triage acuity scoring and diagnostic risk indicators are advisory recommendations designed to assist triage prioritizing. They do not constitute diagnostic determinations and must never supersede clinical judgment by licensed medical professionals."*

### 8. Production Database Safeguard
- In `production`, automated sample seeding is skipped unless explicitly enabled via `SEED_SAMPLE_DATA="true"`.
- Clinical testing credentials remain in an untracked, Git-ignored private file on the local machine (`backend/local_staff_credentials.md`).

---

## 🛠 Technology Stack & Architectural Rationale

### Why Render + PostgreSQL for Backend?
1. **Persistent Worker Architecture**: Unlike serverless functions (e.g. AWS Lambda / Vercel Functions) that suffer from cold starts and strict 10s execution timeouts, Render hosts persistent Docker containers with Gunicorn + Uvicorn workers that keep DB connection pools alive between requests.
2. **Infrastructure as Code (IaC)**: [`render.yaml`](render.yaml) defines the web service; `DATABASE_URL` is supplied manually for an external PostgreSQL provider.
3. **Database Security & ACID Compliance**: PostgreSQL provides transactional inventory updates and row-level locking for stock deduction.

### Why Vercel Edge for Frontend?
1. **Astro MPA + React Islands**: Delivers pre-rendered HTML, hydrating React components only where interactivity is needed (`/dashboard/*`, the homepage simulator).
2. **Global Edge CDN**: Static pages are served from Vercel's edge network; dashboard pages hydrate React islands.

### Alternatives Comparison Matrix

| Platform | Strengths | Drawbacks | Why SwasthaTrack Chose |
|---|---|---|---|
| **Render** | Docker native, managed PostgreSQL, free tier, IaC Blueprints | Free tier spins down after 15m inactivity | **Selected for Backend**: Real cloud container lifecycle, perfect for portfolio and system design interviews. |
| **AWS ECS/EC2** | Enterprise standard, infinite scalability | Complex IAM configuration, high maintenance overhead, no permanent free tier | Ideal for enterprise migration, but high operational overhead for single-developer prototypes. |
| **Railway** | Excellent DX, instant deploys | Strictly paid after $5 trial credits | Render chosen for long-term free availability. |
| **Vercel** | Industry standard for frontend, edge caching | Serverless Python backend has cold starts & no connection pooling | **Selected for Frontend**: Best-in-class static/SSR edge delivery. |

---

## 🐳 Infrastructure, Containerization & CI/CD

### Multi-Stage Docker Build Architecture
[`backend/Dockerfile`](backend/Dockerfile) utilizes a 2-stage build to minimize image size and eliminate build tool security vulnerabilities:

1. **Stage 1 (Builder)**: Compiles native C-extensions (`libpq-dev`, `gcc`) and installs dependencies inside an isolated `/opt/venv` virtual environment.
2. **Stage 2 (Runtime)**: Uses clean `python:3.12-slim`, copies pre-built `/opt/venv`, creates an unprivileged non-root system user (`swastha`), and runs Gunicorn. Render uses the `/health` endpoint as its health check.

### Continuous Integration Pipeline
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) triggers on every push and PR to `main`:
- **Backend CI Job**: Sets up Python 3.12, installs dependencies, runs **ruff lint**, executes the full pytest suite on in-memory SQLite (**116 tests**, with the PostgreSQL-only concurrency test skipped), and uploads backend coverage.
- **Backend PostgreSQL Job**: Runs the same suite against a **PostgreSQL 16** service container (**117 tests**, including a threaded stock-deduction concurrency test), so dialect-specific behaviour is covered in CI.
- **Frontend CI Job**: Sets up Node.js 22, runs `astro check`, and builds the Astro static output (12 pages).
- **Security Scanning**: `pip-audit` scans for known vulnerabilities in Python dependencies.

### Dependency Updates
GitHub Dependabot is configured in [`.github/dependabot.yml`](.github/dependabot.yml) to automatically scan and update:
- Backend Python dependencies (pip ecosystem)
- Frontend npm dependencies
- GitHub Actions workflows

---

## 🚀 Cloud Deployment Guide

### Continuous Deployment Workflow
> [!NOTE]
> **Do you need to deploy again and again manually?**  
> **No!** SwasthaTrack is configured with Git-driven Continuous Deployment (CD):
> - Pushing changes in `backend/`, `Dockerfile`, or `render.yaml` $\longrightarrow$ **Render automatically rebuilds and redeploys the backend container**.
> - Pushing changes in `frontend-v2/` $\longrightarrow$ **Vercel automatically rebuilds and deploys the frontend to edge nodes**.

### 1. Deploy Backend on Render (3 minutes)
1. Fork / push this repository to your GitHub account.
2. Log in to [Render](https://render.com).
3. Click **New +** $\longrightarrow$ **Blueprint**.
4. Select your `swasthatrack` repository.
5. Render detects [`render.yaml`](render.yaml) and creates the web service (`swasthatrack-api`). The blueprint does not provision a database.
6. In Render Dashboard $\longrightarrow$ `swasthatrack-api` $\longrightarrow$ **Environment**:
    - Add `DATABASE_URL` for your PostgreSQL provider (for example Neon)
    - Add `GEMINI_API_KEY` = `your_google_ai_studio_api_key`
    - Add `GEMINI_MODEL` = `gemini-3.8-flash` (recommended; must be set explicitly — no default model is provided)
7. Click **Apply**. Your API will be live at `https://swasthatrack-api.onrender.com`.

### 2. Deploy Frontend on Vercel (2 minutes)
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New Project** $\longrightarrow$ Select `swasthatrack`.
3. Set **Root Directory** to `frontend-v2`.
4. In **Environment Variables**, add:
   - `PUBLIC_API_BASE_URL` = `https://swasthatrack-api.onrender.com/api`
5. Click **Deploy**. Your frontend will be live at `https://swasthatrack.vercel.app`.

---

## 🎯 Comprehensive Technical Interview Guide & Q/A

When presenting SwasthaTrack in technical interviews, use these structured talking points:

### 1. System Design & Concurrency
**Q: "How did you design the system to handle concurrent hospital traffic and prevent race conditions?"**
> **Answer**:  
> *"SwasthaTrack uses a decoupled architecture: FastAPI served by Gunicorn/Uvicorn workers, SQLAlchemy for persistence, and PostgreSQL in production. To prevent duplicate queue tokens, queue numbers are unique and the insert retries on integrity errors. Patient registration numbers are also unique. Pharmacy dispensing uses transactional stock checks and atomic SQL updates, and the whole status change rolls back if any medicine is expired or short on stock."*

---

### 2. State Latency & Departmental Synchronization
**Q: "How do doctor prescriptions reach the pharmacy dispensary?"**
> **Answer**:  
> *"Static pages are pre-rendered by Astro, while each clinical workspace is a React island that calls the FastAPI API with a bearer token. When a doctor creates a prescription, it is stored with a pending status. The pharmacy screen polls the prescription and medicine endpoints every ten seconds while the tab is visible, and dispensing triggers a server-side status transition that deducts linked medicine stock transactionally. This is deliberate polling rather than websockets, which keeps the deployment simple; latency depends on the database and network, so I do not quote a fixed millisecond figure."*

---

### 3. Fault-Tolerant AI Design
**Q: "What happens if the Gemini LLM API goes down or exceeds its rate limit during an emergency?"**
> **Answer**:  
> *"The heuristic engine always runs first, so triage still returns a result if the AI provider is unavailable. It evaluates vitals and symptoms using the Emergency Severity Index protocol, including Shock Index for adults, critical bradycardia detection, and pediatric age bands marked for clinician review. When configured, the Gemini call runs asynchronously with a 3-second timeout and one retry through a shared `httpx.AsyncClient`, with the API key sent in the `x-goog-api-key` header. The API returns whichever engine assigns the higher urgency. Missing keys, timeouts, HTTP 429 responses, and invalid JSON all fall back to the heuristic result."*

---

### 4. Security & Role-Based Access Control
**Q: "How is patient health information protected across different roles?"**
> **Answer**:  
> *"We implemented JSON Web Tokens (JWT) with HMAC-SHA256 signature verification and bcrypt password hashing. Route dependencies load the current user from the database and check their role against an allow-list. For example, only pharmacists and administrators can dispense a prescription, and only doctors and administrators can create prescriptions or lab orders. Patient and queue endpoints also check object-level access for non-clinical users."*

---

### 5. DevOps & Containerization
**Q: "Why did you use a multi-stage Docker build instead of a standard single-stage image?"**
> **Answer**:  
> *"A single-stage Dockerfile includes compiler toolchains like `gcc` and `libpq-dev`, which bloats the container image to over 1GB and introduces unnecessary security vulnerabilities. By using a multi-stage build, we compile C-extensions inside a builder stage, copy only the clean virtual environment into a lightweight `python:3.12-slim` runtime image, and run the container under a dedicated unprivileged `swastha` user with built-in healthchecks."*

---

## 💻 Local Development & Testing

### 1. Prerequisites
- Python 3.11+
- Node.js 22.12+ (see `frontend-v2/package.json`)
- Git

---

### 🚀 Option A: 1-Click / 1-Command Startup (Recommended)

You can launch both the **FastAPI Backend (Port 8000)** and **Astro Frontend (Port 4321)** simultaneously in parallel with a single command:

#### On Windows:
Double-click [`start-dev.bat`](start-dev.bat) or run in terminal:
```cmd
start-dev.bat
```

#### On Linux / macOS:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

#### Via Root NPM:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:4321](http://localhost:4321)
- **Interactive API Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check Endpoint**: [http://localhost:8000/health](http://localhost:8000/health)

---

### ⚙️ Option B: Modular / Independent Startup

If you are working specifically on backend logic or frontend design in isolation, you can run either service independently:

#### Backend Only (FastAPI + SQLite/PostgreSQL)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python seed.py             # Seeds initial clinical staff accounts
uvicorn main:app --reload --port 8000
```

#### Clinical Staff Provisioning & Local Testing
> [!IMPORTANT]
> **Production vs. Development Authentication**:  
> - **Production**: Static passwords are never published or exposed. Administrator privileges are granted via Google OAuth to whitelisted emails (`SUPERADMIN_EMAILS`), and clinical staff accounts are provisioned dynamically via `POST /api/auth/users`.
> - **Local Development**: Running `python seed.py` populates baseline testing accounts for all 5 consoles. Passwords are generated from `SEED_*_PASSWORD` environment variables (e.g. `SEED_ADMIN_PASSWORD`), or if unset, a random password is generated and printed to the console once during seeding.

#### Frontend Only (Astro + React Islands)
```bash
cd frontend-v2
npm install
npm run dev
```

> [!TIP]
> **Why are Backend and Frontend structured as separate runtimes?**  
> SwasthaTrack follows a **Decoupled Production Architecture**:
> 1. **Independent Runtimes**: The backend uses Python's ASGI runtime for high-throughput I/O and AI orchestration, while the frontend runs on Node.js/Vite for static compilation and Edge delivery.
> 2. **Separate Scaling & Cloud Deployment**: In production, the backend scales independently inside Docker containers on **Render**, while the frontend is deployed to global Edge CDN servers on **Vercel**.
> 3. **Isolated Failures & Faster HMR**: Frontend UI changes hot-reload instantly via Vite without restarting the Python database connection pool.

---

### 🧪 Running Test Suites
```bash
# Run backend pytest suite (116 tests on SQLite; the PostgreSQL-only
# concurrency test is skipped unless TEST_DATABASE_URL is set)
cd backend
python -m pytest

# Run the same suite against PostgreSQL (creates/drops tables per test)
# PowerShell: $env:TEST_DATABASE_URL="postgresql://user:pass@localhost:5432/swastha_test"
# bash: export TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/swastha_test
python -m pytest

# Run ruff linting
ruff check .

# Run frontend production build verification (12 static pages)
cd frontend-v2
npm run build
```

---

## ⚠️ Limitations & Roadmap

### Current limitations
- Dashboard data refreshes by polling every 10–15 seconds while the tab is visible. There is no websocket or server-sent-event channel.
- Most request handlers use synchronous SQLAlchemy sessions inside FastAPI routes, and a few auth routes perform blocking bcrypt work.
- The PostgreSQL CI job creates and drops the schema per test. It does not run Alembic migrations against a pre-existing production-like schema.
- Prescription medicines are stored as JSON, with optional linked medicine rows. Dispensing deducts stock only when a medicine name matches a catalogue entry.
- AI triage is advisory. Clinical thresholds still carry `# TODO(clinician-review)` markers and need clinician sign-off.
- The UI covers OPD registration, doctor consultation, pharmacy, lab, and administration. Appointment scheduling, billing, and bed management screens are not implemented.
- Google sign-in requires a configured `GOOGLE_CLIENT_ID`; without it, only the local username/password flow is available.

### Roadmap
- Move blocking database and bcrypt work off the event loop, or migrate to async SQLAlchemy.
- Replace dashboard polling with websockets or server-sent events.
- Add batch-level inventory tracking and explicit medicine-link management.
- Complete clinician review of all triage thresholds and document the sources.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.
