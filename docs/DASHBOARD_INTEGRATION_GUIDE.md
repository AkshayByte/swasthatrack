# Dashboard Integration Guide

This guide provides comprehensive information about the five specialized dashboards integrated into the SwasthaTrack healthcare management platform.

## Overview

The SwasthaTrack platform now includes five role-based dashboards designed to streamline healthcare operations:

1. **Medicine Dashboard** - For pharmacists and pharmacy staff
2. **Doctor Dashboard** - For healthcare providers and doctors
3. **Patient Dashboard** - For patients to access their health information
4. **Registration Desk Dashboard** - For front desk and registration staff
5. **Laboratory Dashboard** - For lab technicians and staff

## Architecture

### Frontend Structure
```
frontend/src/dashboards/
├── medicine/                 # Medicine Dashboard
│   ├── MedicineDashboard.tsx
│   ├── types.ts
│   └── components/
├── doctor/                   # Doctor Dashboard
│   ├── DoctorDashboard.tsx
│   ├── types.ts
│   └── components/
├── patient/                  # Patient Dashboard
│   ├── PatientDashboard.tsx
│   ├── types.ts
│   └── components/
├── registration-desk/        # Registration Desk Dashboard
│   ├── RegistrationDeskDashboard.tsx
│   ├── types.ts
│   └── components/
├── laboratory/               # Laboratory Dashboard
│   ├── LaboratoryDashboard.tsx
│   ├── types.ts
│   └── components/
└── shared/                   # Shared Services
    ├── services/
    ├── hooks/
    ├── contexts/
    └── components/
```

### Backend Structure
```
backend/
├── models/                   # Database Models
│   ├── patient.py
│   ├── diagnosis.py
│   ├── prescription.py
│   ├── lab_report.py
│   ├── appointment.py
│   └── queue.py
├── routes/
│   └── dashboard.py          # Dashboard API endpoints
└── database.py              # Database configuration
```

## Dashboard Features

### 1. Medicine Dashboard

**Target Users**: Pharmacists, Pharmacy Staff

**Key Features**:
- **Real-time Stock Tracking**: Monitor medicine inventory levels
- **Automated Alerts**: Low stock, expired medicines, reorder notifications
- **Warehouse Integration**: Automated ordering system for restocking
- **Transaction Management**: Complete audit trail of stock movements
- **Order Management**: Track warehouse orders and deliveries

**Components**:
- `MedicineStats`: Overview statistics and KPIs
- `StockAlertsList`: Critical stock alerts and notifications
- `RecentTransactions`: Latest stock movements and updates
- `PendingOrders`: Warehouse orders and delivery tracking
- `StockUpdateModal`: Manual stock adjustment interface
- `WarehouseOrderModal`: New order creation interface

**API Endpoints**:
- `GET /api/dashboard/medicine` - Dashboard data
- `POST /api/medicine/stock/update` - Update stock levels
- `POST /api/medicine/warehouse/order` - Create warehouse orders

### 2. Doctor Dashboard

**Target Users**: Healthcare Providers, Doctors

**Key Features**:
- **Patient Management**: Search and access patient records
- **Diagnosis System**: Structured diagnosis entry with symptoms
- **Prescription Management**: Digital prescription creation
- **Lab Report Access**: View patient lab results
- **Patient History**: Comprehensive medical history tracking

**Components**:
- `DoctorStats`: Patient and appointment statistics
- `PatientSearch`: Advanced patient lookup
- `PatientHistory`: Complete patient medical history
- `DiagnosisForm`: Diagnosis entry and management
- `PrescriptionForm`: Prescription creation interface
- `LabReportsView`: Lab results and reports
- `RecentDiagnoses`: Latest diagnoses and conditions
- `ActivePrescriptions`: Current patient prescriptions

**API Endpoints**:
- `GET /api/dashboard/doctor` - Dashboard data
- `POST /api/doctor/diagnosis` - Create diagnosis
- `POST /api/doctor/prescription` - Create prescription

### 3. Patient Dashboard

**Target Users**: Patients

**Key Features**:
- **Health Overview**: Personal health summary and statistics
- **Prescription Access**: View and download prescriptions
- **Appointment Management**: Schedule and track appointments
- **Lab Results**: Access personal lab reports
- **Report Downloads**: Downloadable health documents

**Components**:
- `PatientStats`: Personal health statistics
- `PatientProfile`: Personal information and medical details
- `PatientPrescriptions`: Prescription history and current medications
- `PatientDiagnoses`: Medical diagnoses and conditions
- `PatientLabReports`: Lab test results and reports
- `PatientAppointments`: Appointment scheduling and management
- `AppointmentReminders`: Upcoming appointment notifications
- `DownloadableReports`: Health document downloads

**API Endpoints**:
- `GET /api/dashboard/patient` - Dashboard data
- `GET /api/patient/reports/{id}/download` - Download reports

### 4. Registration Desk Dashboard

**Target Users**: Front Desk Staff, Registration Personnel

**Key Features**:
- **Patient Registration**: Complete patient onboarding
- **Queue Management**: Real-time queue tracking and management
- **Appointment Scheduling**: Doctor and lab appointment coordination
- **Patient Search**: Advanced patient lookup and management
- **Daily Reports**: Registration and appointment statistics

**Components**:
- `RegistrationDeskStats`: Daily statistics and KPIs
- `QueueStatus`: Current queue status and priority alerts
- `QueueManagement`: Queue entry management and updates
- `PatientRegistrationForm`: New patient registration
- `RecentRegistrations`: Latest patient registrations
- `AppointmentScheduling`: Appointment management interface

**API Endpoints**:
- `GET /api/dashboard/registration-desk` - Dashboard data
- `POST /api/registration/patient` - Register new patient
- `PUT /api/registration/queue` - Update queue status
- `POST /api/registration/appointment` - Schedule appointment

### 5. Laboratory Dashboard

**Target Users**: Lab Technicians, Laboratory Staff

**Key Features**:
- **Test Management**: Lab test catalog and specifications
- **Report Processing**: Lab report creation and result entry
- **File Uploads**: Secure lab report file management
- **Result Analysis**: Abnormal result detection and flagging
- **Priority Management**: Urgent test prioritization

**Components**:
- `LaboratoryStats`: Lab statistics and performance metrics
- `LabReportsList`: All lab reports and status tracking
- `LabTestsList`: Available lab tests and specifications
- `PendingReports`: Reports requiring attention
- `ReportHistory`: Completed reports and results
- `ReportUploadForm`: Lab report file upload interface
- `LabResultForm`: Test result entry and analysis

**API Endpoints**:
- `GET /api/dashboard/laboratory` - Dashboard data
- `POST /api/laboratory/upload` - Upload lab report files
- `POST /api/laboratory/result` - Add lab results

## Authentication & Authorization

### Role-Based Access Control

Each dashboard is protected by role-based access control:

- **Medicine Dashboard**: `pharmacist` role
- **Doctor Dashboard**: `doctor` role
- **Patient Dashboard**: `patient` role
- **Registration Desk Dashboard**: `registration_staff` role
- **Laboratory Dashboard**: `lab_staff` role

### Permission System

The system includes granular permissions for fine-grained access control:

```typescript
interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: 'pharmacist' | 'doctor' | 'patient' | 'registration_staff' | 'lab_staff' | 'admin';
  permissions: string[];
}
```

### Protected Routes

Dashboards are protected using the `ProtectedDashboard` component:

```tsx
<ProtectedDashboard requiredRole="pharmacist">
  <MedicineDashboard />
</ProtectedDashboard>
```

## Shared Services

### API Service

Centralized API communication with error handling and authentication:

```typescript
import { apiService } from './dashboards/shared/services/api';

// GET request
const data = await apiService.get('/api/dashboard/medicine');

// POST request
const result = await apiService.post('/api/medicine/stock/update', data);

// File upload
const upload = await apiService.uploadFile('/api/laboratory/upload', file);
```

### Notification Service

Toast notifications for user feedback:

```typescript
import { notificationService } from './dashboards/shared/services/notificationService';

notificationService.success('Operation completed successfully');
notificationService.error('Operation failed', 'Please try again');
```

### Dashboard Hooks

Custom hooks for data management:

```typescript
import { useDashboardData, useDashboardMutation } from './dashboards/shared/hooks/useDashboardData';

// Data fetching
const { data, isLoading, error } = useDashboardData({
  endpoint: '/api/dashboard/medicine',
  refetchInterval: 30000
});

// Mutations
const mutation = useDashboardMutation({
  endpoint: '/api/medicine/stock/update',
  method: 'POST'
});
```

## Real-time Updates

The system supports real-time updates through WebSocket connections:

```typescript
import { useRealTimeUpdates } from './dashboards/shared/hooks/useDashboardData';

useRealTimeUpdates('/api/dashboard/medicine/stream', (data) => {
  // Handle real-time updates
}, true);
```

## Error Handling

Comprehensive error handling with user-friendly messages:

- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Automatic redirect to login
- **Permission Errors**: Clear access denied messages
- **Validation Errors**: Field-specific error messages
- **Server Errors**: Graceful degradation with fallback UI

## Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Data Caching**: React Query for efficient data management
- **Bundle Splitting**: Dashboard-specific code splitting
- **Image Optimization**: Optimized images and assets
- **Code Splitting**: Route-based code splitting

## Accessibility

All dashboards are built with accessibility in mind:

- **WCAG 2.1 Compliance**: AA level accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: High contrast ratios for readability
- **Focus Management**: Proper focus handling and indicators

## Testing

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Service testing with mock implementations

### Integration Testing
- API integration testing
- Dashboard workflow testing
- Cross-dashboard data consistency testing

### End-to-End Testing
- Complete user journey testing
- Role-based access testing
- Real-time update testing

## Deployment

### Frontend Deployment
```bash
# Build the application
npm run build

# Deploy to production
npm run deploy
```

### Backend Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Monitoring & Analytics

### Performance Monitoring
- Dashboard load times
- API response times
- User interaction tracking
- Error rate monitoring

### Business Analytics
- Dashboard usage statistics
- User engagement metrics
- Feature adoption rates
- Performance benchmarks

## Security Considerations

### Data Protection
- **Encryption**: All sensitive data encrypted in transit and at rest
- **Access Control**: Role-based access with principle of least privilege
- **Audit Logging**: Complete audit trail of all user actions
- **Data Anonymization**: Patient data anonymization for analytics

### API Security
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS Configuration**: Proper CORS setup for cross-origin requests

## Future Enhancements

### Planned Features
- **AI-Powered Insights**: Machine learning for health predictions
- **Telemedicine Integration**: Video consultation capabilities
- **Mobile Applications**: Native mobile apps for all user types
- **Advanced Analytics**: Predictive analytics and reporting
- **Integration APIs**: Third-party system integrations

### Scalability Improvements
- **Microservices Architecture**: Service decomposition for better scalability
- **Caching Layer**: Redis caching for improved performance
- **Load Balancing**: Horizontal scaling capabilities
- **Database Optimization**: Query optimization and indexing

This comprehensive dashboard system provides a complete healthcare management solution with specialized interfaces for different user roles, ensuring efficient operations and improved patient care.

