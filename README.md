# SwasthaTrack - Pharmaceutical Supply Chain Management

## Project Overview

**SwasthaTrack** is a comprehensive pharmaceutical supply chain management platform built for the Ayushman Bharat Digital Mission (ABDM). It provides real-time tracking, inventory management, and quality assurance for medicines across India's healthcare ecosystem.

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

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **Git**

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:8081`


## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLAlchemy (with PostgreSQL support)
- **Authentication**: JWT tokens
- **API Documentation**: Automatic OpenAPI/Swagger docs

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4 + shadcn/ui components
- **State Management**: React Query + Context API
- **Routing**: React Router DOM v6
- **Authentication**: ABDM-integrated auth system

### Key Features
- **ABDM Integration**: Complete Ayushman Bharat Digital Mission compliance
- **Real-time Tracking**: Medicine inventory and shipment tracking
- **Quality Assurance**: Expiry alerts and compliance monitoring
- **User Management**: Role-based access control
- **Responsive Design**: Mobile-first approach

## 📱 Application Features

### Core Management
- **Dashboard**: KPI overview with interactive charts
- **Medicines**: Drug catalog and inventory management
- **Shipments**: Logistics and delivery tracking
- **Facilities**: Hospital and warehouse management
- **Inventory**: Stock levels and expiry alerts

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
