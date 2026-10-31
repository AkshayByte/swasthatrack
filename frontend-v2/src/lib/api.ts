import axios from 'axios';

// FastAPI Base URL — set PUBLIC_API_BASE_URL in frontend-v2/.env or Vercel environment
const rawBaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_API_BASE_URL) ||
  'http://localhost:8000';

const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

export function formatApiError(err: any, fallback = 'Something went wrong.'): string {
  const detail = err?.response?.data?.detail;

  if (Array.isArray(detail)) {
    const messages = detail.map((item: any) => {
      const field = Array.isArray(item?.loc)
        ? item.loc.filter((part: string | number) => part !== 'body').join('.')
        : '';
      const message = typeof item?.msg === 'string' ? item.msg : String(item);
      return field ? `${field}: ${message}` : message;
    });
    if (messages.length > 0) return messages.join('; ');
  }

  if (typeof detail === 'string' && detail.trim()) return detail;
  if (detail && typeof detail === 'object') return JSON.stringify(detail);
  if (typeof err?.message === 'string' && err.message.trim()) return err.message;
  return fallback;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout to accommodate cloud container cold starts (Render/Fly)
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

// Mirror of backend/schemas/queue.py QueueStatus enum
export type QueueStatus = 'waiting' | 'called' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

export interface QueueEntry {
  id: number;
  patient_id: number;
  patient?: Patient;
  patient_name?: string;
  queue_number: string;
  service_type: string;
  doctor_id?: number;
  doctor_name?: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  priority_score: number;
  status: QueueStatus;
  estimated_wait_time?: number;
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

export interface Medicine {
  id: number;
  name: string;
  generic_name?: string;
  category?: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock?: number;
  expiry_date?: string;
  is_active?: boolean;
}

export interface DashboardSummary {
  total_patients: number;
  today_registrations: number;
  active_queue: number;
  pending_prescriptions: number;
  pending_lab_orders: number;
  low_stock_medicines: number;
  total_medicines: number;
  queue_by_department: { department: string; count: number }[];
}

export type TriageUrgency = 'low' | 'medium' | 'high' | 'emergency';

export interface TriageResult {
  urgency: TriageUrgency;
  priorityScore: number;
  recommendedDepartment: string;
  estimatedWaitMinutes: number;
  diagnosticIndicators: string[];
  reasoning: string;
  source: 'gemini' | 'heuristic_fallback';
}

export interface TriageVitals {
  bp?: string;
  temp?: string;
  spo2?: string;
  hr?: string;
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

   async updateQueueStatus(id: number, status: QueueStatus): Promise<void> {
    await apiClient.put(`/queue/${id}/status`, null, { params: { status } });
  },

  // MEDICINES / INVENTORY
  async getMedicines(limit = 500): Promise<Medicine[]> {
    const res = await apiClient.get<Medicine[]>('/medicine/', { params: { limit } });
    return Array.isArray(res.data) ? res.data : [];
  },

  // DASHBOARD
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await apiClient.get<DashboardSummary>('/dashboard/');
    return res.data;
  },

  // PRESCRIPTIONS (Routing to Pharmacy)
  async getPrescriptions(): Promise<Prescription[]> {
    const res = await apiClient.get<Prescription[]>('/prescriptions/');
    return Array.isArray(res.data) ? res.data : [];
  },

  async createPrescription(rx: Partial<Prescription>): Promise<Prescription> {
    const res = await apiClient.post<Prescription>('/prescriptions/', rx);
    return res.data;
  },

  async updatePrescriptionStatus(id: string | number, status: Prescription['status']): Promise<void> {
    await apiClient.put(`/prescriptions/${id}/status`, { status });
  },

  // LAB ORDERS (Routing to Lab)
  async getLabOrders(): Promise<LabOrder[]> {
    const res = await apiClient.get<LabOrder[]>('/lab-orders/');
    return Array.isArray(res.data) ? res.data : [];
  },

  async createLabOrder(order: Partial<LabOrder>): Promise<LabOrder> {
    const res = await apiClient.post<LabOrder>('/lab-orders/', order);
    return res.data;
  },

  async updateLabOrderStatus(id: string | number, status: LabOrder['status'], results?: string): Promise<void> {
    await apiClient.put(`/lab-orders/${id}/status`, { status, results });
  },

  // AI TRIAGE (FastAPI + Gemini, with server-side heuristic fallback)
  async calculateAITriage(
    symptoms: string,
    vitals?: TriageVitals,
    patientDetails?: { age?: number; gender?: string; medical_history?: string[]; allergies?: string[] }
  ): Promise<TriageResult> {
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
    return {
      urgency: res.data.urgency as TriageUrgency,
      priorityScore: res.data.priority_score,
      recommendedDepartment: res.data.recommended_department,
      estimatedWaitMinutes: res.data.estimated_wait_minutes,
      diagnosticIndicators: res.data.diagnostic_indicators || [],
      reasoning: res.data.reasoning,
      source: res.data.source as TriageResult['source']
    };
  }
};