# SwasthaTrack Mobile (React Native / Expo)

> **🚧 Roadmap Item — Not Yet Implemented**

This directory is a **placeholder** for the future React Native / Expo companion app.

## Planned Features

- Offline-capable patient intake for rural clinic settings
- React Native (Expo) architecture targeting iOS and Android
- Syncs with the SwasthaTrack FastAPI backend when connectivity is restored
- Lightweight AI triage support for field health workers
- Automated SMS/WhatsApp push notifications for token readiness and lab results

## Status

This feature is planned but **not yet developed**. All active project code lives in:

- [`/backend`](../backend/) — FastAPI REST API
- [`/frontend-v2`](../frontend-v2/) — Astro + React Islands web dashboards

## Overview

The `mobile/` directory is reserved for the upcoming cross-platform **SwasthaTrack Companion App** built with **React Native / Expo**.

### Key Modules in Roadmap
- **Patient Health Locker**: Instant view of digital EMR records, digital prescriptions, appointment QR codes, and PDF lab reports.
- **Doctor / Field Staff Companion**: Quick scan of patient QR codes for OPD triage in remote health camps and community clinics.
- **Offline Sync**: Local SQLite caching for offline data capture in network-constrained rural healthcare centers.

### Planned Tech Stack
- **Framework**: React Native with Expo SDK
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Local Storage**: WatermelonDB / SQLite
- **Security & Auth**: OAuth 2.0 / JWT cryptographic mobile session authentication
