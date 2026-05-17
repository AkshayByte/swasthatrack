# SwasthaTrack - Healthcare Management Platform

## Project Overview

**SwasthaTrack** is a comprehensive healthcare management platform with five specialized dashboards for different user roles, built for the Ayushman Bharat Digital Mission (ABDM). It provides real-time healthcare operations management, patient care coordination, and quality assurance across India's healthcare ecosystem.

## 🏥 Dashboard System

SwasthaTrack now includes five role-based dashboards designed to streamline healthcare operations:

### 📊 Medicine Dashboard
- **For**: Pharmacists and pharmacy staff
- **Features**: Real-time stock tracking, automated alerts, warehouse integration, transaction management
- **Access**: `/dashboards/medicine`

### 👨‍⚕️ Doctor Dashboard  
- **For**: Healthcare providers and doctors
- **Features**: Patient management, diagnosis system, prescription management, lab report access
- **Access**: `/dashboards/doctor`

### 👤 Patient Dashboard
- **For**: Patients
- **Features**: Health overview, prescription access, appointment management, lab results, report downloads
- **Access**: `/dashboards/patient`

### 🏢 Registration Desk Dashboard
- **For**: Front desk and registration staff
- **Features**: Patient registration, queue management, appointment scheduling, patient search
- **Access**: `/dashboards/registration-desk`

### 🧪 Laboratory Dashboard
- **For**: Lab technicians and staff
- **Features**: Test management, report processing, file uploads, result analysis, priority management
- **Access**: `/dashboards/laboratory`

## 🏗 Project Structure

```
SwasthaTrack/
├── backend/                 # FastAPI backend server
│   ├── main.py             # Application entry point
│   ├── models/             # SQLAlchemy database models
│   ├── routes/             # API route handlers
│   ├── schemas/            # Pydantic models for validation
│   └── .gitignore          # Python-specific gitignore
├── frontend/               # React TypeScript frontend
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies and scripts
│   └── README.md           # Frontend-specific documentation
├── docs/                   # Project documentation
│   ├── FRONTEND_OUTLINE.md # Frontend architecture overview
│   ├── ABDM_INTEGRATION_GUIDE.md # ABDM integration details
│   └── DEVELOPMENT_MODE_GUIDE.md # Development setup guide
├── mobile/                 # Mobile application (future)
└── README.md              # This file
```

## SwasthaTrack - Healthcare Management Platform

SwasthaTrack is a comprehensive healthcare management platform designed to streamline operations for hospitals and clinics. It features role-based dashboards for Doctors, Patients, Pharmacists, Lab Technicians, and Registration Desk staff, integrated with the Ayushman Bharat Digital Mission (ABDM).

## 🚀 Features

- **Role-Based Access Control**: Secure dashboards for different user roles.
- **Patient Management**: Registration, medical history, and appointment scheduling.
- **Medicine Inventory**: Track stock, expiry dates, and manage prescriptions.
- **Lab Management**: Order tests, upload results, and track status.
- **Queue Management**: Real-time OPD queue tracking.
- **ABDM Integration**: ABHA ID creation and linking (Mock implementation).

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (Dev) / PostgreSQL (Prod)
- **ORM**: SQLAlchemy
- **Authentication**: JWT with OAuth2
- **Testing**: Pytest

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context API

## 🏁 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment Setup
cp .env.example .env
# Edit .env with your configuration (defaults work for dev)

# Run Server
uvicorn main:app --reload
```
Backend will run at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Environment Setup
cp .env.example .env
# Edit .env if needed

# Run Development Server
npm run dev
```
Frontend will run at `http://localhost:8081`.

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

## 🔒 Security Features
- Password hashing with Bcrypt
- JWT Authentication
- Role-based authorization
- CORS configuration
- Input validation with Pydantic v2

## 📄 License
MIT
### ABDM Health Records
- **Patient Check-in**: Facility QR code system
- **Medical Encounters**: Encounter management
- **Consent Management**: ABDM consent handling
- **Health Data Discovery**: Patient data access

### Administration
- **Users**: Staff and role management
- **Reports**: Analytics and compliance reporting
- **Settings**: System configuration
- **Profile**: ABHA profile management

## 🔐 ABDM Integration

### Authentication Flow
1. ABHA ID or mobile number input
2. OTP verification via ABDM
3. JWT token management with auto-refresh
4. Protected route access


## 📊 Available Scripts

### Backend
```bash
uvicorn main:app --reload    # Start development server
uvicorn main:app --host 0.0.0.0 --port 8000  # Production server
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📋 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key
ABDM_API_URL=https://api.abdm.gov.in
```

### Frontend (.env.local)
```
VITE_ABDM_API_BASE_URL=http://localhost:8000
VITE_ENVIRONMENT=production
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker Support
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📚 Documentation

- [Frontend Architecture Overview](./docs/FRONTEND_OUTLINE.md)
- [ABDM Integration Guide](./docs/ABDM_INTEGRATION_GUIDE.md)
- [Dashboard Integration Guide](./docs/DASHBOARD_INTEGRATION_GUIDE.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Frontend README](./frontend/README.md)

### Code Style
- Follow ESLint configuration for frontend
- Use Black formatter for Python backend
- Write meaningful commit messages
- Include tests for new features

## 📞 Support

- **Technical Support**: support@swasthatrack.gov.in
- **Documentation**: Check the `docs/` directory
- **Issues**: Use GitHub Issues for bug reports and feature requests

## 📄 License

This project is part of the Ayushman Bharat Digital Mission initiative, Government of India.

---

**Built with ❤️ for Indian Healthcare** | **Powered by ABDM**
