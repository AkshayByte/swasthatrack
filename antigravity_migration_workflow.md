# SwasthaTrack v2.0 - AI Agent Migration Master Plan

## 🤖 System Context (For Antigravity)
You are an expert Principal Full-Stack Engineer. Your objective is to migrate the "SwasthaTrack" healthcare management platform from a React SPA to an AstroJS Multi-Page Application (MPA) for maximum SEO and performance. 

**The Existing Architecture to Preserve:**
*   **Backend:** Python, FastAPI, PostgreSQL[cite: 1].
*   **AI Logic:** Gemini API integrated with FastAPI to automate symptom-based triage and queue-priority suggestions[cite: 1].
*   **Legacy Frontend:** React dashboards for 5 departments (registration, doctor, pharmacy, lab, admin)[cite: 1].
*   **API Logic:** REST APIs routing prescriptions and lab orders between departments[cite: 1].

**The New Architecture to Build:**
*   **Frontend Framework:** AstroJS (Strictly MPA for public routes).
*   **Styling:** Tailwind CSS v4.
*   **Interactive Components:** React (Imported as Astro Islands using `client:load`).
*   **Deployment Target:** Cloudflare Pages.

## ⚠️ Strict Global Directives
1.  **DO NOT touch or overwrite the FastAPI backend, PostgreSQL database, or Gemini AI triage logic**[cite: 1]. You are only rebuilding the frontend presentation layer.
2.  **Adhere to `design.md`:** You must consult the local `design.md` file for all UI/UX styling, spacing, and typography decisions. 
3.  **Astro Islands Only:** Never build a full React SPA router. Use Astro for file-based routing. Wrap the legacy 5 department dashboards[cite: 1] in Astro pages.
4.  **Commit Frequently:** After every successful step, commit the changes to Git with clear conventional commits to maintain an active commit history[cite: 1].

---

## 🛠️ Execution Phases

### Phase 1: Environment Scaffolding
*Agent Instructions: Wait for the user to confirm completion of this phase before moving to Phase 2.*
1. Initialize a new Astro project in a folder named `frontend-v2` using the standard Astro template.
2. Configure Astro to support React (`@astrojs/react`) and Tailwind CSS v4 (`@astrojs/tailwind`).
3. Set up the `src/layouts/Layout.astro` file as the global shell. Ensure it includes a dark mode toggle logic natively (using standard `localStorage` and `html class="dark"` methodology).
4. **Git Commit:** `chore: scaffold Astro v2 frontend with React and Tailwind integrations`

### Phase 2: React Dashboard Hydration (Astro Islands)
*Agent Instructions: Migrate the interactive UI layer without breaking the existing FastAPI connections.*
1. Create a directory at `src/components/react/`.
2. Move the legacy React components for the 5 dashboards (registration, doctor, pharmacy, lab, admin)[cite: 1] into this folder.
3. Create Astro pages for each dashboard at `src/pages/dashboard/[department].astro`.
4. Import the React components into these Astro pages using the `<Component client:load />` directive so they hydrate properly on the client side.
5. Ensure the REST APIs routing prescriptions and lab orders[cite: 1] still point to the correct local FastAPI endpoints.
6. **Git Commit:** `feat: migrate 5 department dashboards to Astro Islands architecture`

### Phase 3: Public Landing Page & SEO Generation
*Agent Instructions: Focus on Lighthouse scores, SEO structure, and Vercel design guidelines.*
1. Rebuild the `src/pages/index.astro` landing page as a pure HTML/Astro component. 
2. **Hero Section:** Highlight the core value proposition (AI-powered triage and queue-priority suggestions)[cite: 1].
3. **FAQ Section:** Generate an SEO-optimized FAQ section regarding healthcare data management and AI triage. Use standard JSON-LD Schema Markup (`application/ld+json`) in the `<head>` for rich Google Search indexing.
4. **Legal Pages:** Generate basic static Astro pages for `/privacy`, `/terms`, `/about`, and `/contact`. Add them to a global footer component.
5. **Git Commit:** `feat: build SEO-optimized landing page and legal pages`

### Phase 4: Production & Analytics Prep
*Agent Instructions: Finalize the build for Cloudflare deployment.*
1. Create a `public/robots.txt` file allowing all crawlers.
2. Generate an Astro integration or script to build a `sitemap.xml`.
3. Add a placeholder script block in the global `<head>` for Google Analytics.
4. Create a `public/_headers` file with the exact rule to apply `X-Robots-Tag: noindex` to any `*.pages.dev` subdomains to prevent duplicate content indexing.
5. Test the build command (`npm run build`).
6. **Git Commit:** `chore: finalize SEO metadata, sitemap, and Cloudflare headers`

**End of Workflow.**