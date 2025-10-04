# SwasthaTrack Frontend

## Project Overview

**SwasthaTrack Frontend** is the React TypeScript frontend application for the SwasthaTrack pharmaceutical supply chain management platform. It provides a modern, responsive interface for managing medicines, inventory, and ABDM-integrated healthcare services.

> **Note**: This is the frontend component of the SwasthaTrack project. See the main [README.md](../README.md) for complete project overview.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd SwasthaTrack/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8081/`


## 🛠 Tech Stack

### Core Technologies
- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7 (latest)
- **Styling**: Tailwind CSS 3.4 + shadcn/ui components
- **State Management**: React Query + Context API
- **Routing**: React Router DOM v6
- **Authentication**: ABDM-integrated auth system

### UI & Visualization
- **Component Library**: 40+ shadcn/ui components (Radix UI)
- **Icons**: Lucide React (latest)
- **Charts**: Recharts 2.15
- **Maps**: Leaflet + React-Leaflet
- **Animations**: Framer Motion
- **QR Codes**: QRCode.react
- **Notifications**: Sonner (latest)

### Development Tools
- **Code Quality**: ESLint + TypeScript ESLint
- **Development Inspector**: vite-plugin-inspect (latest)
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Theme Management**: next-themes

## 📱 Application Structure

### Public Pages
- **Landing Page** (`/`) - Marketing homepage with feature showcase
- **About Us** (`/about-us`) - Organization information and mission
- **Contact Us** (`/contact-us`) - Contact forms and support information
- **FAQ** (`/faq`) - Searchable frequently asked questions
- **Privacy Policy** (`/privacy-policy`) - Data protection information
- **Terms of Service** (`/terms-of-service`) - Platform usage terms

### Authentication System (ABDM Integrated)
- **Login** (`/login`) - Multi-step ABDM OTP-based authentication
- **Register** (`/register`) - ABHA ID creation wizard

### Protected Dashboard
All dashboard pages use unified layout with sidebar navigation:

#### Core Management
- **Dashboard** (`/dashboard`) - KPI overview with interactive charts
- **Medicines** (`/medicines`) - Drug catalog and inventory management
- **Shipments** (`/shipments`) - Logistics and delivery tracking
- **Facilities** (`/facilities`) - Hospital and warehouse management
- **Inventory** (`/inventory`) - Stock levels and expiry alerts

#### Administration
- **Users** (`/users`) - Staff and role management
- **Reports** (`/reports`) - Analytics and compliance reporting
- **Settings** (`/settings`) - System configuration
- **Profile** (`/profile`) - ABHA profile management

#### ABDM Health Records
- **Check-in** (`/check-in`) - Patient registration system
- **Encounters** (`/encounters`) - Medical encounter management
- **New Encounter** (`/encounters/new`) - Create patient encounters
- **Encounter Details** (`/encounters/:id`) - Detailed encounter view
- **Consent Requests** (`/consent-requests`) - ABDM consent management
- **Discovery Logs** (`/discovery-logs`) - Health data discovery
- **Monitoring** (`/monitoring`) - System health monitoring

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🏗 Architecture Highlights

### Context Organization
Follows a three-file pattern for complex contexts:
- `AuthContext.context.ts` - Context creation
- `AuthContext.types.ts` - Type definitions
- `AuthContext.tsx` - Implementation

### Component Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx       # Top navigation with user menu
│   ├── Sidebar.tsx      # Collapsible side navigation
│   ├── ABHACard.tsx     # ABDM health card component
│   └── ...
├── contexts/            # React contexts (auth, theme)
├── hooks/               # Custom React hooks
├── layouts/             # Page layouts
├── pages/               # Route components
└── lib/                 # Utilities and configurations
```

### Key Features
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: React Query for data synchronization
- **Interactive Charts**: Medicine tracking and analytics
- **QR Code Integration**: Facility identification
- **Development Mode**: Full offline development capability
- **Component Inspection**: Built-in development tools

## 🔐 ABDM Integration

### Authentication Flow
1. ABHA ID or mobile number input
2. OTP verification via ABDM
3. JWT token management with auto-refresh
4. Protected route access


## 🎨 Design System

### Color Scheme
- **Primary**: Healthcare blue (`#0ea5e9`)
- **Secondary**: Medical green (`#10b981`)
- **Accent**: Professional grays
- **System Colors**: Success, warning, danger, info

### Components
- **Cards**: Gradient backgrounds with soft shadows
- **Buttons**: Healthcare-themed with hover states
- **Forms**: Comprehensive validation and error handling
- **Tables**: Sortable with pagination
- **Charts**: Interactive data visualization

## 📊 Recent Updates

### Dependency Updates (Latest)
- **Vite**: Upgraded to v7.1.3 for improved performance
- **Lucide React**: Updated to v0.541.0 with new icons
- **Form Resolvers**: Updated to v5.2.1 for better validation
- **Development Tools**: Enhanced build tools
- **UI Components**: Updated Sonner, Vaul, and theme components

### New Features
- **FAQ Page**: Searchable questions with categories
- **Enhanced Navigation**: Footer links to all information pages
- **Component Optimization**: Better performance and maintainability

### Removed Dependencies

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create `.env.local` for environment-specific configuration:
```
VITE_ABDM_API_BASE_URL=https://your-backend-api.com
VITE_ENVIRONMENT=production
```

### Build Output
Optimized build outputs to `dist/` directory with:
- Code splitting
- Asset optimization
- Bundle analysis

## 🧪 Testing

### Recommended Testing Strategy
1. **Unit Tests**: Component logic and utilities
2. **Integration Tests**: Authentication flows and API integration
3. **E2E Tests**: Complete user workflows
4. **Accessibility Tests**: WCAG compliance

## 📋 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Submit a pull request

### Code Style
- Follow ESLint configuration
- Use TypeScript for type safety
- Follow component organization patterns
- Write meaningful commit messages

## 📞 Support

- **Technical Support**: support@swasthatrack.gov.in
- **Documentation**: Check the `docs/` directory in the project root
- **Development Issues**: Check browser console and network tab

## 📄 License

This project is part of the Ayushman Bharat Digital Mission initiative, Government of India.

---

**Built with ❤️ for Indian Healthcare** | **Powered by ABDM**
