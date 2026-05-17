# SWASTHATRACK - COMPREHENSIVE PROJECT REPORT

**Project Name:** SwasthaTrack  
**Project Type:** Healthcare Management System with ABDM Integration  
**Version:** 2.0 (Live Prototype)  
**Developed By:** [Your Name/Team Name]  
**Tech Stack:** React (Vite), Python (FastAPI), Tailwind CSS, PostgreSQL/SQLite

---

## 1. Executive Summary

**SwasthaTrack** is a state-of-the-art Hospital Management Information System (HMIS) designed to digitize and streamline healthcare operations in compliance with the **Ayushman Bharat Digital Mission (ABDM)**. 

Legacy hospital systems often suffer from fragmented data—where pharmacy, lab, and doctor records exist in silos. SwasthaTrack unifies these departments into a single, cohesive platform. By implementing role-based dashboards for every stakeholder (Registration, Doctor, Patient, Lab, Pharmacy), the system ensures seamless data flow, reduces administrative burden, and eliminates paperwork errors.

The core innovation lies in its **ABDM-first approach**, enabling the creation and linking of **ABHA (Ayushman Bharat Health Account)** IDs, ensuring that patient health records are portable, secure, and accessible nationwide.

---

## 2. Problem Statement & Solution

### The Problem
*   **Manual Paperwork:** Prescriptions and lab reports are often handwritten, leading to errors and loss of history.
*   **Siloed Departments:** The pharmacy doesn't know what the doctor prescribed until the patient physically presents a slip.
*   **Lack of Standardization:** Patient history is scattered across different hospitals with no unified ID.
*   **Queue Congestion:** Physical queues at registration desks cause delays and patient dissatisfaction.

### The Solution: SwasthaTrack
*   **Unified Digital Workflow:** A patient registered at the desk is instantly visible to the doctor; prescribed meds appear instantly on the pharmacist's ongoing orders.
*   **Role-Based Dashboards:** specialized interfaces for 5 distinct user roles ensure security and focus.
*   **Digital Health Records:** All history is stored digitally and linked to the patient's unique ABHA ID.
*   **Real-time Analytics:** Hospital administration can view live stats on OPD queues, inventory levels, and bed availability.

---

## 3. System Architecture

SwasthaTrack follows a modern **Client-Server Architecture** with a RESTful API communication layer.

### 3.1 Frontend (Client Side)
*   **Framework:** React 18 with TypeScript for type safety and component-based architecture.
*   **Build Tool:** Vite for lightning-fast development server and optimized production builds.
*   **Styling:** Tailwind CSS for responsive design + **shadcn/ui** for accessible, high-quality components.
*   **State Management:** React Query (TanStack Query) for server state management and caching.
*   **Routing:** React Router DOM (v6) for client-side navigation.
*   **Animations:** Framer Motion for smooth transitions and interactive UI elements.

### 3.2 Backend (Server Side)
*   **Framework:** FastAPI (Python) - chosen for its high performance and automatic Swagger documentation.
*   **Database ORM:** SQLAlchemy for oblivious database interactions.
*   **Data Validation:** Pydantic models ensure strict data integrity for API requests/responses.
*   **Authentication:** OAuth2 with Password Flow + JWT (JSON Web Tokens) for secure, stateless authentication.

### 3.3 Database
*   **Development:** SQLite (for ease of setup and portability).
*   **Production:** PostgreSQL (for robustness, concurrency, and reliability).

---

## 4. Key Features & Modules

### 4.1 🏥 Registration Desk Dashboard
The entry point of the hospital ecosystem.
*   **ABHA Integration:** Create new ABHA IDs or link existing ones via mobile OTP.
*   **Queue Management:** Generate OPD tokens and assign patients to specific doctors.
*   **Patient Search:** Quickly retrieve patient details using name, phone, or ABHA ID.
*   **Appointment Scheduling:** Book, reschedule, or cancel appointments.

### 4.2 👨‍⚕️ Doctor Dashboard
The clinical command center.
*   **Patient Queue:** View the list of waiting patients live.
*   **Digital Diagnosis:** Record symptoms, diagnosis, and vitals.
*   **E-Prescription:** Prescribe medicines from a standardized drug database. The prescription is digitally signed and instantly sent to the pharmacy.
*   **Lab Orders:** Request lab tests directly from the consultation screen.
*   **Patient History:** View a chronological timeline of past visits, medications, and reports.

### 4.3 💊 Pharmacist (Medicine) Dashboard
Inventory and dispensing management.
*   **Live Prescription Feed:** Incoming prescriptions appear instantly.
*   **Inventory Tracking:** Real-time stock levels, batch tracking, and expiry alerts.
*   **One-Click Billing:** Generate invoices based on fulfilled prescriptions.
*   **Stock Alerts:** Automated notifications for low-stock medicines.

### 4.4 🧪 Laboratory Dashboard
Diagnostic workflow management.
*   **Test Requests:** View pending test requests from doctors.
*   **Sample Management:** Track sample collection status.
*   **Report Upload:** Upload PDF reports or enter values manually.
*   **Verification:** Digital verification of results before release to the patient/doctor.

### 4.5 👤 Patient Dashboard
Empowering patients with their own data.
*   **Health Timeline:** View comprehensive medical history.
*   **Downloads:** Download prescriptions and lab reports as PDFs.
*   **Appointments:** Book new appointments and view upcoming visits.
*   **ABHA Profile:** Manage ABHA profile and consent for data sharing.

---

## 5. ABDM Integration (Ayushman Bharat Digital Mission)

SwasthaTrack is built to be **ABDM Compliant** (Sandbox Environment).

1.  **Health ID (ABHA) Generation:**
    *   Uses Aadhaar/Mobile based verification (Mocked for prototype).
    *   Generates a unique 14-digit ABHA ID.
2.  **Health Facility Registry (HFR):**
    *   The hospital is registered as a verified facility.
3.  **Health Professional Registry (HPR):**
    *   Doctors are verified and linked to the system.
4.  **Health Information Provider (HIP):**
    *   SwasthaTrack acts as a HIP, storing health records and allowing them to be shared with user consent.

---

## 6. How It Works (Workflow Example)

**Scenario:** A patient visits for a fever.

1.  **Registration:** The receptionist logs in to the **Registration Dashboard**, enters the patient's mobile number. If the patient has an ABHA ID, their details (Name, Age, Gender) are auto-fetched. A token (#101) is generated for Dr. Sharma.
2.  **Consultation:** Dr. Sharma sees token #101 in the **Doctor Dashboard**. He opens the digital file, sees "Fever" as the complaint. He prescribes "Paracetamol 500mg" and orders a "CBC Blood Test".
3.  **Pharmacy:** The pharmacist sees a new order for Token #101. He packs the Paracetamol. Inventory is auto-deducted.
4.  **Laboratory:** The lab technician sees a request for "CBC Test" for Token #101. He collects the sample. Once done, he uploads the report directly to the system.
5.  **Patient:** The patient logs into their **Patient Dashboard** (or receives an SMS link). They can see the Doctor's prescription and download the Lab Report without visiting the hospital again.

---

## 7. Performance & Optimization

*   **Lazy Loading:** React components (dashboards) are lazy-loaded to ensure the initial load time is under 1 second.
*   **Optimistic UI:** The interface updates instantly (e.g., when adding a medicine) before waiting for the server response, making the app feel "instant".
*   **Cached Queries:** React Query caches API responses. If a doctor visits a patient's profile twice, the second load is instant (0ms).
*   **Debounced Search:** Patient search fields use debouncing to reduce API server load.

---

## 8. Security Measures

*   **JWT Authentication:** Stateless, secure token-based access. Access tokens expire in 30 minutes; Refresh tokens last 7 days.
*   **Role-Based Access Control (RBAC):** Middleware ensures a Pharmacist cannot access Doctor routes, and vice-versa.
*   **Password Hashing:** All passwords are hashed using **Bcrypt** before storage.
*   **CORS Protection:** The backend only accepts requests from the trusted frontend domain.
*   **Input Sanitization:** Pydantic models prevent SQL Injection and XSS attacks by validating all incoming data types.

---

## 9. Future Roadmap

1.  **Mobile Application (React Native):** A dedicated app for patients.
2.  **AI-Assisted Diagnosis:** Integration of ML models to suggest potential diagnoses based on symptoms.
3.  **Telemedicine Module:** Built-in video conferencing for remote consultations.
4.  **Blockchain Health Records:** Using blockchain for immutable audit trails of health record access.
5.  **Insurance Integration:** Direct claim processing with insurance providers via API.

---

## 10. Conclusion

SwasthaTrack represents the future of Indian healthcare—digitized, interconnected, and patient-centric. By leveraging modern web technologies and aligning with national standards (ABDM), it solves the critical problem of fragmented health data, ultimately leading to better patient outcomes and more efficient hospital administration.
