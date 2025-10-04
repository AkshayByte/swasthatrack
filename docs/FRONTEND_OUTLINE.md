# SwasthaTrack Frontend Architecture Outline

> **Note**: This document has been moved to the `docs/` directory as part of project reorganization.

## Project Overview
**SwasthaTrack** is a pharmaceutical supply chain management system for the Ayushman Bharat Digital Mission (ABDM), built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui components.

## Tech Stack (Updated)
- **Framework**: React 18 + TypeScript + Vite 7.1.3 (latest)
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS 3.4 + Framer Motion
- **State**: React Query + Context API
- **Routing**: React Router DOM v6
- **Charts**: Recharts 2.15
- **Maps**: Leaflet + React-Leaflet
- **QR**: QRCode.react
- **Development Tools**: Enhanced build tools
- **Form Handling**: React Hook Form + @hookform/resolvers 5.2.1
- **Icons**: Lucide React 0.541.0 (latest)
- **Notifications**: Sonner 2.0.7 (latest)
- **Theme**: next-themes 0.4.6 (latest)

## Architecture

### Core Structure
```
├── layouts/
│   ├── AuthLayout.tsx          # Login/Register wrapper
│   └── DashboardLayout.tsx     # Main app layout (Sidebar + Navbar)
├── contexts/
│   ├── AuthContext.context.ts  # Context creation
│   ├── AuthContext.types.ts    # Type definitions
│   └── AuthContext.tsx         # ABDM authentication implementation
├── hooks/
│   ├── useAuth.ts              # Auth state management
│   └── use-toast.ts            # Toast notifications
└── components/
    ├── ui/                    # 40+ shadcn/ui components
    ├── ProtectedRoute.tsx     # Route protection
    ├── Navbar.tsx             # Top navigation with user dropdown
    ├── Sidebar.tsx            # Side navigation
    ├── StatCard.tsx           # Dashboard KPI cards
    ├── ChartCard.tsx          # Chart containers
    ├── Table.tsx              # Data tables
    ├── ABHACard.tsx           # ABDM health card
    └── FacilityQRCode.tsx     # QR code generator
```

## Pages & Functionality

### Public Pages
- **LandingPage** (`/`) - Marketing homepage with enhanced footer navigation
- **Home** (`/home`) - Public information page
- **About Us** (`/about-us`) - Organization information, mission, values, and team
- **Contact Us** (`/contact-us`) - Contact forms, support info, and FAQs
- **FAQ** (`/faq`) - Searchable questions with categories and interactive design
- **Privacy Policy** (`/privacy-policy`) - Comprehensive data protection information
- **Terms of Service** (`/terms-of-service`) - Platform usage terms and conditions

### Authentication (ABDM Integration)
- **Login** (`/login`) - Multi-step ABDM OTP-based login
- **Register** (`/register`) - ABHA health ID creation wizard

### Protected Dashboard Pages
All pages use DashboardLayout with sidebar navigation:

#### Core Management
- **Dashboard** (`/dashboard`) - KPI overview, charts, facility stats
- **Medicines** (`/medicines`) - Drug catalog management
- **Inventory** (`/inventory`) - Stock tracking & alerts
- **Shipments** (`/shipments`) - Logistics & delivery tracking
- **Facilities** (`/facilities`) - Hospital/warehouse management

#### User & System Management  
- **Users** (`/users`) - Staff management
- **Reports** (`/reports`) - Analytics & compliance reports
- **Settings** (`/settings`) - System configuration (fixed routing issue)
- **Profile** (`/profile`) - ABHA profile management with enhanced UI

#### ABDM Health Records
- **CheckIn** (`/check-in`) - Patient check-in system
- **Encounters** (`/encounters`) - Medical encounters list
- **NewEncounter** (`/encounters/new`) - Create new encounter
- **EncounterDetails** (`/encounters/:id`) - Detailed encounter view
- **ConsentRequests** (`/consent-requests`) - ABDM consent management
- **DiscoveryLogs** (`/discovery-logs`) - Health data discovery
- **Monitoring** (`/monitoring`) - System health monitoring

### Navigation Structure
#### Footer Navigation (LandingPage)
- **Quick Links**: Features, How It Works, Benefits, FAQ
- **Legal Section**: Privacy Policy, Terms of Service, Contact Us, About Us

#### Navbar Dropdown (Dashboard)
- **Profile**: User profile management (`/profile`)
- **Settings**: System settings (`/settings`) 
- **Log Out**: Authentication logout functionality

### Special Features
- **Responsive Design**: Mobile-first with collapsible sidebar
- **Real-time Updates**: React Query for data synchronization
- **Interactive Charts**: Medicine categories, delivery tracking, facility distribution
- **QR Code Generation**: For facility identification
- **Toast Notifications**: User feedback system
- **Search Functionality**: FAQ page with real-time search
- **Form Validation**: Enhanced with latest resolvers

### Key UI Components
- **StatCard**: Animated KPI cards with trend indicators
- **ChartCard**: Recharts integration for data visualization  
- **ABHACard**: ABDM health ID display component
- **Table**: Sortable data tables with pagination
- **Sidebar**: Collapsible navigation with role-based menu items
- **Navbar**: Top navigation with user dropdown menu
- **OTP Input**: Custom OTP input component for authentication

### Authentication Flow
1. ABDM login via mobile/ABHA ID
2. Multi-step OTP verification
3. JWT token management with auto-refresh
4. Protected route access based on authentication state

### Context Organization Pattern
Follows a three-file structure for complex contexts:
- **Context Creation**: `AuthContext.context.ts`
- **Type Definitions**: `AuthContext.types.ts`
- **Implementation**: `AuthContext.tsx`

This provides separation of concerns, better type safety, easier maintenance, and improved reusability.


### Recent Updates
#### Dependency Updates
- **Vite**: Upgraded to v7.1.3 for improved performance
- **Form Resolvers**: Updated to v5.2.1 for better validation
- **Icons**: Latest Lucide React with expanded icon set
- **UI Components**: Updated notification and drawer components
- **Development Tools**: Enhanced build tools

#### New Features
- **FAQ Page**: Comprehensive searchable FAQ system
- **Enhanced Navigation**: Complete footer and navbar routing
- **Information Pages**: About Us, Contact Us, Privacy Policy, Terms of Service
- **Improved UX**: Better form handling and user feedback

### Design System Consistency
All pages maintain consistent aesthetic using:
- **Color Scheme**: Healthcare blues and greens
- **Component Library**: Unified shadcn/ui components
- **Typography**: Consistent font hierarchy
- **Spacing**: Standardized margin and padding
- **Animations**: Smooth transitions with Framer Motion
- **Responsive Design**: Mobile-first approach

This system manages the complete pharmaceutical supply chain for Indian healthcare facilities under the ABDM framework, from inventory to patient encounters, with enhanced development tools and comprehensive information architecture.