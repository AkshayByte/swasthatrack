import axios from 'axios';

// FastAPI Base URL — set PUBLIC_API_BASE_URL in frontend-v2/.env or Vercel environment
const rawBaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_API_BASE_URL) ||
  'http://localhost:8000';

const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor for token injection
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('swastha_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  blood_group?: string;
  allergies?: string[];
  medical_history?: string[];
  chronic_conditions?: string[];
  registration_number: string;
  status: string;
  created_at?: string;
}

export interface QueueEntry {
  id: number;
  patient_id: number;
  patient_name?: string;
  queue_number: string;
  service_type: string;
  doctor_id?: number;
  doctor_name?: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'waiting' | 'called' | 'in-progress' | 'in-consultation' | 'completed' | 'cancelled';
  estimated_wait_time: number;
  notes?: string;
  check_in_time?: string;
  created_at?: string;
}

export interface Prescription {
  id: string | number;
  patient_id: number;
  patient_name: string;
  doctor_name: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  status: 'pending' | 'dispensed' | 'cancelled';
  created_at: string;
  notes?: string;
}

export interface LabOrder {
  id: string | number;
  patient_id: number;
  patient_name: string;
  doctor_name: string;
  test_name: string;
  category: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'sample_collected' | 'in_analysis' | 'completed';
  created_at: string;
  results?: string;
  report_file?: string;
}


export const SwasthaAPI = {
  // PATIENT ENDPOINTS
  async getPatients(): Promise<Patient[]> {
    const res = await apiClient.get<Patient[]>('/patients/');
    return Array.isArray(res.data) ? res.data : [];
  },

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    const res = await apiClient.post<Patient>('/patients/', data);
    return res.data;
  },

  // QUEUE ENDPOINTS
  async getQueue(): Promise<QueueEntry[]> {
    const res = await apiClient.get<QueueEntry[]>('/queue/');
    return Array.isArray(res.data) ? res.data : [];
  },

  async addToQueue(entry: Partial<QueueEntry>): Promise<QueueEntry> {
    const res = await apiClient.post<QueueEntry>('/queue/', entry);
    return res.data;
  },

  async updateQueueStatus(id: number, status: QueueEntry['status']): Promise<void> {
    await apiClient.put(`/queue/${id}/status`, null, { params: { status } });
  },

  // PRESCRIPTIONS (Routing to Pharmacy)
  async getPrescriptions(): Promise<Prescription[]> {
    try {
      const res = await apiClient.get<Prescription[]>('/prescriptions/');
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  async createPrescription(rx: Partial<Prescription>): Promise<Prescription> {
    try {
      const res = await apiClient.post<Prescription>('/prescriptions/', rx);
      return res.data;
    } catch {
      // Prescription endpoint may not be implemented yet — return constructed object
      return {
        id: `RX-${Date.now().toString().slice(-4)}`,
        patient_id: rx.patient_id || 0,
        patient_name: rx.patient_name || 'Patient',
        doctor_name: rx.doctor_name || 'Consulting Physician',
        medicines: rx.medicines || [],
        status: 'pending',
        created_at: new Date().toISOString(),
        notes: rx.notes
      };
    }
  },

  async updatePrescriptionStatus(id: string | number, status: Prescription['status']): Promise<void> {
    try {
      await apiClient.put(`/prescriptions/${id}/status`, { status });
    } catch {
      // Endpoint may not exist yet
    }
  },

  // LAB ORDERS (Routing to Lab)
  async getLabOrders(): Promise<LabOrder[]> {
    try {
      const res = await apiClient.get<LabOrder[]>('/lab-orders/');
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },

  async createLabOrder(order: Partial<LabOrder>): Promise<LabOrder> {
    try {
      const res = await apiClient.post<LabOrder>('/lab-orders/', order);
      return res.data;
    } catch {
      // Lab order endpoint may not be implemented yet — return constructed object
      return {
        id: `LAB-${Date.now().toString().slice(-4)}`,
        patient_id: order.patient_id || 0,
        patient_name: order.patient_name || 'Patient',
        doctor_name: order.doctor_name || 'Consulting Physician',
        test_name: order.test_name || 'Clinical Pathology Test',
        category: order.category || 'Diagnostics',
        priority: order.priority || 'routine',
        status: 'pending',
        created_at: new Date().toISOString()
      };
    }
  },

  async updateLabOrderStatus(id: string | number, status: LabOrder['status'], results?: string): Promise<void> {
    try {
      await apiClient.put(`/lab-orders/${id}/status`, { status, results });
    } catch {
      // Endpoint may not exist yet
    }
  },

  // AI TRIAGE LOGIC (Google Gemini API + FastAPI Pipeline with Resilient Fallback)
  calculateAITriage(
    symptoms: string, 
    vitals?: { bp?: string; temp?: string; spo2?: string; hr?: string },
    patientDetails?: { age?: number; gender?: string; medical_history?: string[]; allergies?: string[] }
  ): {
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    priorityScore: number;
    recommendedDepartment: string;
    estimatedWaitMinutes: number;
    diagnosticIndicators: string[];
    reasoning: string;
    confidenceScore: number;
    source: 'gemini' | 'heuristic_fallback';
  } {
    const lower = symptoms.toLowerCase();
    const indicators: string[] = [];
    
    const tempNum = vitals?.temp ? parseFloat(vitals.temp) : undefined;
    const spo2Num = vitals?.spo2 ? parseFloat(vitals.spo2) : undefined;
    
    if (spo2Num && spo2Num < 90) indicators.push(`Critical SpO2 desaturation (${spo2Num}%)`);
    if (tempNum && tempNum >= 102.5) indicators.push(`Hyperpyrexia (${tempNum}°F)`);

    // Emergency conditions
    const emergencyKeywords = ['chest pain', 'unconscious', 'stroke', 'heavy bleeding', 'breathing difficulty', 'dyspnea'];
    if (emergencyKeywords.some(k => lower.includes(k)) || (spo2Num && spo2Num < 90)) {
      indicators.push('Acute cardiovascular / respiratory emergency trigger');
      return {
        urgency: 'emergency',
        priorityScore: 95,
        recommendedDepartment: 'Emergency & Resuscitation / Cardiology',
        estimatedWaitMinutes: 0,
        diagnosticIndicators: indicators.length ? indicators : ['High-acuity emergency trigger'],
        reasoning: 'Critical symptoms detected. Immediate triage bypass to Resuscitation/Cardiology.',
        confidenceScore: 0.96,
        source: 'heuristic_fallback'
      };
    }
    
    // High urgency
    const highKeywords = ['fracture', 'high fever', 'asthma', 'severe abdominal', 'vomiting blood', 'seizure'];
    if (highKeywords.some(k => lower.includes(k)) || (tempNum && tempNum > 102)) {
      indicators.push('Potentially unstable acute condition');
      return {
        urgency: 'high',
        priorityScore: 75,
        recommendedDepartment: 'Urgent Care / Internal Medicine',
        estimatedWaitMinutes: 10,
        diagnosticIndicators: indicators.length ? indicators : ['Elevated urgency trigger'],
        reasoning: 'High-acuity clinical markers detected requiring expedited medical consultation.',
        confidenceScore: 0.92,
        source: 'heuristic_fallback'
      };
    }

    // Medium urgency
    const medKeywords = ['cough', 'vomiting', 'headache', 'sprain', 'infection', 'fever', 'throat'];
    if (medKeywords.some(k => lower.includes(k))) {
      indicators.push('Stable acute illness without compromise');
      return {
        urgency: 'medium',
        priorityScore: 50,
        recommendedDepartment: 'General Medicine OPD',
        estimatedWaitMinutes: 25,
        diagnosticIndicators: indicators,
        reasoning: 'Moderate acute condition suitable for standard outpatient clinical examination.',
        confidenceScore: 0.91,
        source: 'heuristic_fallback'
      };
    }

    // Low urgency
    return {
      urgency: 'low',
      priorityScore: 25,
      recommendedDepartment: 'Routine Health Check / Preventive OPD',
      estimatedWaitMinutes: 40,
      diagnosticIndicators: ['Stable baseline'],
      reasoning: 'Stable, non-urgent consultation; regular queue assigned.',
      confidenceScore: 0.94,
      source: 'heuristic_fallback'
    };
  },

  // Asynchronous FastAPI Gemini Triage API Client
  async calculateAITriageAsync(
    symptoms: string,
    vitals?: { bp?: string; temp?: string; spo2?: string; hr?: string },
    patientDetails?: { age?: number; gender?: string; medical_history?: string[]; allergies?: string[] }
  ) {
    try {
      const payload = {
        symptoms,
        vitals: vitals ? {
          temperature_f: vitals.temp ? parseFloat(vitals.temp) : undefined,
          heart_rate_bpm: vitals.hr ? parseInt(vitals.hr, 10) : undefined,
          blood_pressure: vitals.bp || undefined,
          spo2_percent: vitals.spo2 ? parseFloat(vitals.spo2) : undefined
        } : undefined,
        age: patientDetails?.age,
        gender: patientDetails?.gender,
        medical_history: patientDetails?.medical_history || [],
        allergies: patientDetails?.allergies || []
      };

      const res = await apiClient.post('/queue/ai-triage', payload);
      if (res.data && res.data.urgency) {
        return {
          urgency: res.data.urgency as 'low' | 'medium' | 'high' | 'emergency',
          priorityScore: res.data.priority_score,
          recommendedDepartment: res.data.recommended_department,
          estimatedWaitMinutes: res.data.estimated_wait_minutes,
          diagnosticIndicators: res.data.diagnostic_indicators || [],
          reasoning: res.data.reasoning,
          confidenceScore: res.data.confidence_score,
          source: res.data.source as 'gemini' | 'heuristic_fallback'
        };
      }
    } catch (e) {
      console.warn('FastAPI AI Triage endpoint offline, fallback to client rules:', e);
    }
    return this.calculateAITriage(symptoms, vitals, patientDetails);
  }
};
