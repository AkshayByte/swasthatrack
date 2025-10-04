# SwasthaTrack Project Structure

This document provides a comprehensive overview of the SwasthaTrack project structure, including all folders and files with their purposes and contributions to the project.

## Root Directory

| File/Folder | Purpose | Description |
|-------------|---------|-------------|
| `README.md` | Project documentation | Main project overview, setup instructions, and usage guide |
| `.gitignore` | Version control | Git ignore rules for the entire project |
| `backend/` | Backend application | FastAPI server with database models and API routes |
| `frontend/` | Frontend application | React TypeScript application with Vite build system |
| `docs/` | Documentation | Project documentation and guides |
| `mobile/` | Mobile application | Future mobile app directory (currently empty) |

## Backend (`backend/`)

| File/Folder | Purpose | Description |
|-------------|---------|-------------|
| `main.py` | Application entry point | FastAPI application initialization with CORS middleware and root endpoint |
| `models/` | Database models | SQLAlchemy ORM models for database entities |
| `models/medicine.py` | Medicine model | Medicine entity with fields: id, name, description, quantity, expiry_date |
| `routes/` | API routes | FastAPI route handlers for different API endpoints |
| `routes/medicine.py` | Medicine API | CRUD operations for medicine management (GET, POST, PUT, DELETE) |
| `schemas/` | Data validation | Pydantic models for request/response validation |
| `schemas/medicine.py` | Medicine schemas | Pydantic models for medicine data validation and serialization |
| `.gitignore` | Python-specific ignore | Git ignore rules for Python projects (cache, virtual envs, etc.) |

### Backend Architecture

The backend follows a clean architecture pattern:
- **Models**: SQLAlchemy ORM models define database structure
- **Schemas**: Pydantic models handle data validation and serialization
- **Routes**: FastAPI route handlers process HTTP requests and responses
- **Main**: Application entry point with middleware configuration

## Frontend (`frontend/`)

| File/Folder | Purpose | Description |
|-------------|---------|-------------|
| `src/` | Source code | Main application source code directory |
| `public/` | Static assets | Public static files (favicon, robots.txt, etc.) |
| `package.json` | Dependencies | NPM package configuration with dependencies and scripts |
| `package-lock.json` | Dependency lock | NPM dependency version lock file |
| `README.md` | Frontend documentation | Frontend-specific setup and usage instructions |
| `vite.config.ts` | Build configuration | Vite build tool configuration |
| `tsconfig.json` | TypeScript config | TypeScript compiler configuration |
| `tailwind.config.ts` | Styling config | Tailwind CSS configuration |
| `eslint.config.js` | Code quality | ESLint configuration for code linting |
| `postcss.config.js` | CSS processing | PostCSS configuration for CSS processing |

### Frontend Source Structure (`src/`)

| Directory | Purpose | Description |
|-----------|---------|-------------|
| `components/` | React components | Reusable UI components and business logic components |
| `components/ui/` | UI components | shadcn/ui component library (40+ components) |
| `components/abdm/` | ABDM components | ABDM-specific components (ABHACard, verification, creation) |
| `pages/` | Page components | Route-level React components for different application pages |
| `layouts/` | Layout components | Layout wrapper components (AuthLayout, DashboardLayout) |
| `contexts/` | React contexts | Global state management contexts (AuthContext) |
| `hooks/` | Custom hooks | Reusable React hooks for common functionality |
| `services/` | API services | API service functions for backend communication |
| `utils/` | Utilities | Helper functions and utility modules |
| `lib/` | Library code | Third-party library configurations and utilities |
| `config/` | Configuration | Application configuration files |
| `main.tsx` | Frontend entry point | React application entry point with routing |
| `App.tsx` | Root component | Main React application component |
| `index.css` | Global styles | Global CSS styles and Tailwind imports |

### Key Frontend Components

#### ABDM Integration Components
- `ABHACard.tsx`: Displays ABHA health card information
- `M1ABHACreation.tsx`: ABHA creation wizard component
- `M1ABHAVerification.tsx`: ABHA verification component

#### Core UI Components
- `Navbar.tsx`: Top navigation bar with user dropdown
- `Sidebar.tsx`: Collapsible side navigation menu
- `ProtectedRoute.tsx`: Route protection component for authenticated users
- `StatCard.tsx`: Dashboard KPI display cards
- `ChartCard.tsx`: Chart container components
- `Table.tsx`: Data table components
- `FacilityQRCode.tsx`: QR code generation for facilities

#### Page Components
- `Dashboard.tsx`: Main dashboard with KPIs and charts
- `Medicines.tsx`: Medicine management interface
- `Inventory.tsx`: Inventory tracking and alerts
- `Shipments.tsx`: Shipment tracking interface
- `Facilities.tsx`: Facility management
- `Users.tsx`: User management interface
- `Profile.tsx`: User profile management
- `Settings.tsx`: System settings interface
- `Login.tsx`: Authentication login page
- `Register.tsx`: User registration page

#### Information Pages
- `LandingPage.tsx`: Marketing homepage
- `AboutUs.tsx`: Organization information
- `ContactUs.tsx`: Contact forms and support
- `FAQ.tsx`: Frequently asked questions
- `PrivacyPolicy.tsx`: Privacy policy information
- `TermsOfService.tsx`: Terms of service

### Frontend Architecture

The frontend follows modern React patterns:
- **Component-based**: Modular, reusable components
- **TypeScript**: Full type safety throughout the application
- **Context API**: Global state management for authentication
- **React Router**: Client-side routing
- **React Query**: Server state management and caching
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Documentation (`docs/`)

| File | Purpose | Description |
|------|---------|-------------|
| `FRONTEND_OUTLINE.md` | Frontend architecture | Comprehensive frontend architecture overview and tech stack details |
| `ABDM_INTEGRATION_GUIDE.md` | ABDM integration | Complete guide for ABDM (Ayushman Bharat Digital Mission) integration |
| `PROJECT_STRUCTURE.md` | This file | Complete project structure documentation |

## Mobile (`mobile/`)

| Status | Purpose | Description |
|--------|---------|-------------|
| Empty | Future mobile app | Directory reserved for future mobile application development |

## Configuration Files

### Root Level
- `.gitignore`: Git ignore rules for the entire project (node_modules, Python cache, build outputs, etc.)

### Backend Level
- `backend/.gitignore`: Python-specific ignore rules (cache files, virtual environments, database files, etc.)

### Frontend Level
- `frontend/.gitignore`: Frontend-specific ignore rules (node_modules, build outputs, environment files, etc.)

## Development Workflow

### Backend Development
1. Navigate to `backend/` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Start server: `uvicorn main:app --reload`
4. Access API docs: `http://localhost:8000/docs`

### Frontend Development
1. Navigate to `frontend/` directory
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Access application: `http://localhost:8081`


## Build and Deployment

### Frontend Build
```bash
cd frontend
npm run build
```
Outputs optimized build to `dist/` directory.

### Backend Deployment
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Key Features by Directory

### Backend Features
- FastAPI REST API with automatic OpenAPI documentation
- SQLAlchemy ORM for database operations
- CORS middleware for frontend integration
- Medicine management CRUD operations
- Extensible architecture for additional entities

### Frontend Features
- React 18 with TypeScript for type safety
- Vite 7 for fast development and building
- Tailwind CSS + shadcn/ui for modern UI
- ABDM integration for healthcare authentication
- Responsive design for all device sizes
- Development mode for offline development
- Comprehensive information pages
- Real-time data with React Query

### Documentation Features
- Comprehensive architecture overview
- ABDM integration guide
- Development setup instructions
- Project structure documentation

## Future Enhancements

### Planned Additions
- Mobile application in `mobile/` directory
- Additional backend entities (users, facilities, shipments)
- Enhanced ABDM integration features
- Real-time notifications with WebSocket
- Advanced analytics and reporting
- Multi-language support
- Enhanced security features

### Scalability Considerations
- Modular architecture for easy extension
- Clear separation of concerns
- Type-safe development with TypeScript
- Comprehensive documentation for team collaboration
- Standard development workflows and tooling

This structure provides a solid foundation for a healthcare supply chain management platform with room for growth and enhancement.
