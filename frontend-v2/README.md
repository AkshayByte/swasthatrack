# SwasthaTrack Frontend v2 (Astro + React Islands)

Modern, high-performance web frontend for SwasthaTrack built with **Astro** (Multi-Page Application architecture) and **React Islands** for interactive clinical dashboards.

## Architecture

This frontend is designed around the **Islands Architecture**:
- **Static Pages (Zero JavaScript by default)**: Marketing landing page (`/`), About, Contact, Privacy, and Terms are pre-rendered statically with minimal payload for lightning-fast First Contentful Paint (FCP) and SEO indexing.
- **Interactive Dashboards (React Islands)**: The 5 specialized clinical dashboards are mounted as hydrated client-side islands (`client:load`), preserving state and reactivity only where needed without shipping a heavy monolithic SPA bundle to static pages.

## Project Structure

```text
frontend-v2/
├── public/                 # Static assets (favicons, robots.txt, _headers)
├── src/
│   ├── components/
│   │   └── react/          # React Island components for clinical dashboards
│   │       ├── AdminDashboard.tsx
│   │       ├── DoctorDashboard.tsx
│   │       ├── LabDashboard.tsx
│   │       ├── PharmacyDashboard.tsx
│   │       ├── RegistrationDashboard.tsx
│   │       └── UnifiedDashboard.tsx
│   ├── layouts/
│   │   └── Layout.astro    # Global HTML shell with theme toggle & nav
│   ├── lib/
│   │   └── api.ts          # Type-safe API client connected to FastAPI
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── [department].astro  # Dynamic departmental dashboard routes
│   │   │   └── index.astro         # Role switcher / main dashboard
│   │   ├── index.astro     # Landing page with SEO & JSON-LD schema
│   │   ├── about.astro     # Platform mission & hospital workflows
│   │   ├── contact.astro   # Support & inquiries
│   │   ├── privacy.astro   # Health data privacy & ABDM guidelines
│   │   └── terms.astro     # Terms of service
│   └── styles/
│       └── global.css      # Design tokens, color palette & utilities
├── astro.config.mjs        # Astro configuration with React integration
└── package.json
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application runs locally at `http://localhost:4321` (or next available port).

### 3. Production Build
```bash
npm run build
npm run preview
```

## Integration with Backend

API calls in `src/lib/api.ts` connect to the FastAPI backend running at `http://localhost:8000`. Set `PUBLIC_API_URL` or standard Vite environment variables if deploying against a remote backend.
