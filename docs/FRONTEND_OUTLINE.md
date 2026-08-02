# SwasthaTrack Frontend Architecture Outline

## Platform Overview
**SwasthaTrack Frontend** is an ultra-fast, multi-page healthcare application built on **Astro** with **React Islands**, **Tailwind CSS**, and **TypeScript**, aligned with the Ayushman Bharat Digital Mission (ABDM).

## Architecture Highlights
- **Framework**: Astro (MPA Architecture) + React 18 (Client Islands)
- **Styling**: Tailwind CSS + Custom Design System Tokens (HSL Palettes)
- **Type Safety**: TypeScript 5.x
- **API Client**: Native `fetch` wrapper with typed responses (`src/lib/api.ts`) connecting to FastAPI

### Directory Breakdown (`frontend-v2/`)

```text
frontend-v2/
├── public/                 # Static assets (favicons, robots.txt, _headers)
├── src/
│   ├── components/
│   │   └── react/          # Hydrated interactive React Islands
│   │       ├── RegistrationDashboard.tsx # Patient check-in & token creation
│   │       ├── DoctorDashboard.tsx       # Live patient consultation & e-prescribing
│   │       ├── PharmacyDashboard.tsx     # Real-time dispensing & stock tracking
│   │       ├── LabDashboard.tsx          # Test processing & PDF uploads
│   │       ├── AdminDashboard.tsx        # Facility analytics & system logs
│   │       └── UnifiedDashboard.tsx      # Comprehensive management console
│   ├── layouts/
│   │   └── Layout.astro    # Universal layout, dark mode, meta tags & navigation
│   ├── lib/
│   │   └── api.ts          # Type-safe API communication layer
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── [department].astro  # Dynamic departmental dashboard routes
│   │   │   └── index.astro         # Role switcher / overview
│   │   ├── index.astro     # High-performance SEO landing page
│   │   ├── about.astro     # Platform mission & hospital workflows
│   │   ├── contact.astro   # Support & inquiries
│   │   ├── privacy.astro   # Health data privacy & ABDM compliance
│   │   └── terms.astro     # Terms of service
│   └── styles/
│       └── global.css      # CSS design tokens & glassmorphism utilities
├── astro.config.mjs        # Astro configuration with @astrojs/react
└── package.json
```

## Hydration Strategy (Astro Islands)
- **Public & Informational Pages**: Zero JavaScript footprint by default for instant First Contentful Paint (FCP) and optimal SEO indexing.
- **Clinical Dashboards**: Hydrated on client load (`client:load`) to provide live reactive state updates (OPD queues, medicine dispensing, lab results) without shipping monolithic SPA bundles.