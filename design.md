# SwasthaTrack Design System Specification (`design.md`)

## 🎨 Overview & Brand Identity
**SwasthaTrack** is a mission-critical, AI-powered healthcare management and ABDM-compliant hospital operations platform. The design system emphasizes clarity, trust, clinical precision, and modern accessibility across light and dark modes.

---

## 🌈 Color Palette

### Light Theme
- **Background (`--background`)**: `hsl(210, 40%, 98%)` (Clean clinical ice-white / light slate)
- **Foreground (`--foreground`)**: `hsl(222, 47%, 11%)` (Deep slate for high-contrast readability)
- **Primary / Brand (`--primary`)**: `hsl(199, 89%, 48%)` (Vibrant cyan/teal)
- **Primary Foreground**: `hsl(210, 40%, 98%)`
- **Secondary**: `hsl(210, 40%, 96.1%)`
- **Accent / Cyan Gradient**: `from-cyan-600 to-blue-600`
- **Card / Surface (`--card`)**: `hsl(0, 0%, 100%)` with subtle border `hsl(214.3, 31.8%, 91.4%)`
- **Muted Text (`--muted-foreground`)**: `hsl(215.4, 16.3%, 46.9%)`

### Dark Theme
- **Background (`--background`)**: `hsl(222, 47%, 11%)` (Deep Navy / Dark Slate Blue)
- **Foreground (`--foreground`)**: `hsl(210, 40%, 98%)` (Crisp off-white)
- **Primary / Brand (`--primary`)**: `hsl(199, 89%, 48%)`
- **Card / Surface (`--card`)**: `hsl(217, 33%, 17%)`
- **Border**: `hsl(217.2, 32.6%, 17.5%)`
- **Muted Text**: `hsl(215, 20.2%, 65.1%)`

### Status & Department Accents
- **Registration / Triage**: Cyan / Blue (`#0284c7` / `#06b6d4`)
- **Doctor Consultation**: Indigo / Violet (`#6366f1` / `#8b5cf6`)
- **Pharmacy**: Emerald / Green (`#059669` / `#10b981`)
- **Laboratory**: Amber / Orange (`#d97706` / `#f59e0b`)
- **Admin**: Slate / Rose (`#475569` / `#f43f5e`)

---

## 🔠 Typography
- **Primary Font**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`
- **Headings**:
  - `h1`: Bold / ExtraBold, tracking-tight (2.25rem - 3.75rem)
  - `h2`: Bold, tracking-tight (1.75rem - 2.25rem)
  - `h3`: SemiBold (1.25rem - 1.5rem)
  - `h4`: SemiBold, uppercase tracking-wider for section subtitles (0.75rem - 0.875rem)

---

## 📐 Spacing & Layout
- **Container Max Width**: `max-w-7xl` (1280px) with responsive horizontal padding (`px-4 sm:px-6 lg:px-8`)
- **Header Height**: `h-16` (64px) with sticky positioning and backdrop blur
- **Border Radius**:
  - Standard buttons/inputs: `rounded-xl` (0.75rem / 12px)
  - Cards / Modals: `rounded-2xl` (1rem / 16px)
  - Badges / Pills: `rounded-full`

---

## 🌟 Visual Effects & Glassmorphism
- **Glass Panel**: `backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80`
- **Glow Shadow**: `box-shadow: 0 0 20px rgba(6, 182, 212, 0.15)`
- **Hover Micro-interactions**: Smooth 200-300ms transitions (`transform hover:-translate-y-0.5 shadow-md`)
