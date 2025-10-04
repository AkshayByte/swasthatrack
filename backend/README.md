# SwasthaTrack Backend

## Project Overview

**SwasthaTrack Backend** is the FastAPI-based backend server for the SwasthaTrack pharmaceutical supply chain management platform. It provides RESTful APIs for medicine management, user authentication, and ABDM integration.

> **Note**: This is the backend component of the SwasthaTrack project. See the main [README.md](../README.md) for complete project overview.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🛠 Tech Stack

### Core Technologies
- **Framework**: FastAPI 0.104.1
- **ASGI Server**: Uvicorn 0.24.0
- **Database ORM**: SQLAlchemy 2.0.23
- **Database Migration**: Alembic 1.12.1
- **Database Driver**: psycopg2-binary 2.9.9
- **Validation**: Pydantic 2.5.0
- **Authentication**: python-jose + passlib

### Key Features
- **RESTful API**: Complete CRUD operations
- **Automatic Documentation**: OpenAPI/Swagger integration
- **Database Integration**: SQLAlchemy ORM with PostgreSQL support
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Type Safety**: Full Pydantic validation
- **Extensible Architecture**: Easy to add new models and routes

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── models/              # SQLAlchemy database models
│   └── medicine.py      # Medicine entity model
├── routes/              # API route handlers
│   └── medicine.py      # Medicine CRUD operations
├── schemas/             # Pydantic validation models
│   └── medicine.py      # Medicine request/response schemas
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## 🔧 API Endpoints

### Medicine Management
- `GET /medicines` - List all medicines
- `POST /medicines` - Create new medicine
- `GET /medicines/{id}` - Get medicine by ID
- `PUT /medicines/{id}` - Update medicine
- `DELETE /medicines/{id}` - Delete medicine

### Root
- `GET /` - Health check endpoint

## 🗄️ Database Models

### Medicine Model
```python
class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    quantity = Column(Integer, default=0)
    expiry_date = Column(Date)
```

## 📊 Available Scripts

```bash
# Development server with auto-reload
uvicorn main:app --reload

# Production server
uvicorn main:app --host 0.0.0.0 --port 8000

# Run with specific workers
uvicorn main:app --workers 4
```

## 🧪 Testing

### Setup Test Environment
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 📋 Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key-here
ABDM_API_URL=https://api.abdm.gov.in
ENVIRONMENT=development
```

## 🚀 Deployment

### Production Build
```bash
# Install production dependencies
pip install -r requirements.txt

# Start production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker Support
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔐 Security Considerations

- **CORS Configuration**: Currently allows all origins (configure for production)
- **Input Validation**: Pydantic models validate all request data
- **Database Security**: Use environment variables for sensitive data
- **Authentication**: JWT token integration

## 📚 Documentation

- [Main Project README](../README.md)
- [Project Structure](../docs/PROJECT_STRUCTURE.md)
- [Frontend Integration](../frontend/README.md)

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Use type hints throughout the code
3. Write comprehensive docstrings
4. Include tests for new features
5. Update API documentation

### Code Style
```bash
# Format code with black
black .

# Sort imports with isort
isort .

# Lint with flake8
flake8 .
```

## 📞 Support

- **Technical Support**: support@swasthatrack.gov.in
- **Documentation**: Check the `docs/` directory in the project root
- **API Issues**: Use the interactive API documentation at `/docs`

## 📄 License

This project is part of the Ayushman Bharat Digital Mission initiative, Government of India.

---

**Built with ❤️ for Indian Healthcare** | **Powered by ABDM**
