# EHR Integration Guide for SwasthaTrack

## Overview

This document outlines the standard Electronic Health Record (EHR / EMR) integration implemented in the SwasthaTrack clinical management platform. The integration provides a seamless, secure, and clinical-grade data architecture that complies with international digital health standards.

---

## Key Clinical Features Implemented

### 1. Unified Patient Onboarding & MRN Generation
- **Medical Record Number (MRN)**: Standardized, collision-resistant identifier for patient lifelong history tracking.
- **Demographics & Contact Information**: Structured storage for full name, age, gender, phone, and emergency contacts.
- **Vitals Ingestion**: Point-of-care vital sign capture (Blood Pressure, Heart Rate, Respiratory Rate, Body Temperature, SpO2).

### 2. Asynchronous AI Clinical Triage
- **Acuity Scoring**: Evaluates incoming complaints and vitals using Google Gemini 1.5 Flash against Emergency Severity Index (ESI) standards.
- **Urgency Classification**: Categorizes encounters into Emergency (STAT), Urgent, Priority, or Routine.
- **Queue Automation**: High-acuity encounters automatically bypass routine waitlists for immediate physician evaluation.

### 3. Role-Based Access Control (RBAC)
- **Granular Clearance**: Distinct security contexts for Registration Staff, Physicians, Pharmacists, Laboratory Technicians, and Hospital Administrators.
- **Stateless Tokens**: JWT authenticated sessions signed cryptographically with configurable expiration.
- **Audit Logging**: Immutable, timestamped clinical audit trails tracking patient record access and modifications.

### 4. Inter-Departmental Synchronization
- **Physician Consultation**: Real-time entry of SOAP clinical notes, ICD-10 compatible diagnoses, and electronic prescriptions.
- **Central Pharmacy Dispatch**: Doctor prescriptions stream directly to the pharmacy dispensing queue with sub-150ms state updates.
- **Pathology & Diagnostic Orders**: Laboratory requisitions dispatch automatically to technician specimen processing queues.

---

## API Architecture

### Authentication Endpoints
- `POST /api/auth/register`: Create user account with clinical role clearance
- `POST /api/auth/token`: OAuth2 password flow returning signed JWT access token

### Queue & Triage Endpoints
- `GET /api/queue/`: Fetch active hospital department queues organized by priority score
- `POST /api/queue/ai-triage`: Asynchronous clinical urgency classification via Google Gemini
- `POST /api/queue/`: Enqueue new patient with triage acuity score
- `PUT /api/queue/{id}/status`: Transition patient state (`waiting` -> `in_consultation` -> `completed`)

### Clinical Workflow Endpoints
- `GET /api/patients/`: Patient directory and EMR lookup by MRN or phone
- `POST /api/patients/`: Register new patient profile
- `GET /api/prescriptions/`: Active pharmacy prescription queue
- `POST /api/prescriptions/`: Issue electronic prescription
- `GET /api/lab-orders/`: Pathology specimen orders
- `POST /api/lab-orders/`: Order diagnostic pathology test
- `GET /api/medicines/`: Live pharmacy stock and batch inventory tracking

---

## Security & Compliance

- **Data at Rest**: AES-256 encrypted storage.
- **Data in Transit**: Enforced TLS 1.3 encryption.
- **Sanitization**: Strict Pydantic v2 schemas preventing schema poisoning, SQL injection, and buffer overflows.
