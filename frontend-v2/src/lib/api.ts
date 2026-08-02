import axios from 'axios';

// FastAPI Base URL
const API_BASE_URL = typeof window !== 'undefined'
  ? (window as any).PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
  : 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
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
  status: 'waiting' | 'called' | 'in-progress' | 'completed' | 'cancelled';
  estimated_wait_time: number;
  notes?: string;
  check_in_time?: string;
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
    instructions: string;
  }[];
  status: 'pending' | 'dispensed' | 'partial';
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

// Local mock storage for offline/smooth demo resilience
const LOCAL_STORAGE_KEY_PATIENTS = 'swastha_patients';
const LOCAL_STORAGE_KEY_QUEUE = 'swastha_queue';
const LOCAL_STORAGE_KEY_PRESCRIPTIONS = 'swastha_prescriptions';
const LOCAL_STORAGE_KEY_LAB_ORDERS = 'swastha_lab_orders';

// Initial seeds
const defaultPatients: Patient[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    blood_group: 'O+',
    registration_number: 'REG20260801001',
    allergies: ['Penicillin'],
    medical_history: ['Hypertension', 'Type 2 Diabetes'],
    status: 'active'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    phone: '+91 91234 56789',
    email: 'priya.s@example.com',
    blood_group: 'B+',
    registration_number: 'REG20260801002',
    allergies: ['Sulfa drugs'],
    medical_history: ['Asthma'],
    status: 'active'
  },
  {
    id: 3,
    name: 'Amitabh Sen',
    age: 68,
    gender: 'Male',
    phone: '+91 98111 22334',
    email: 'amitabh.sen@example.com',
    blood_group: 'A+',
    registration_number: 'REG20260801003',
    allergies: [],
    medical_history: ['Coronary Artery Disease'],
    status: 'active'
  }
];

const defaultQueue: QueueEntry[] = [
  {
    id: 1,
    patient_id: 3,
    patient_name: 'Amitabh Sen',
    queue_number: 'Q001',
    service_type: 'Cardiology Triage',
    doctor_name: 'Dr. Vikram Sethi',
    priority: 'emergency',
    status: 'waiting',
    estimated_wait_time: 5,
    notes: 'Severe chest tightness radiating to left shoulder. AI Triage: High Urgency.',
    check_in_time: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 2,
    patient_id: 1,
    patient_name: 'Rajesh Kumar',
    queue_number: 'Q002',
    service_type: 'General Medicine',
    doctor_name: 'Dr. Vikram Sethi',
    priority: 'high',
    status: 'waiting',
    estimated_wait_time: 15,
    notes: 'Persistent high fever (102.5°F) with diabetic monitoring.',
    check_in_time: new Date(Date.now() - 25 * 60000).toISOString()
  },
  {
    id: 3,
    patient_id: 2,
    patient_name: 'Priya Sharma',
    queue_number: 'Q003',
    service_type: 'Pulmonology',
    doctor_name: 'Dr. Ananya Roy',
    priority: 'medium',
    status: 'in-progress',
    estimated_wait_time: 20,
    notes: 'Wheezing and mild shortness of breath after seasonal allergen exposure.',
    check_in_time: new Date(Date.now() - 40 * 60000).toISOString()
  }
];

const defaultPrescriptions: Prescription[] = [
  {
    id: 'RX-101',
    patient_id: 1,
    patient_name: 'Rajesh Kumar',
    doctor_name: 'Dr. Vikram Sethi',
    medicines: [
      { name: 'Paracetamol 650mg', dosage: '1 tablet', frequency: 'Thrice daily', duration: '5 days', instructions: 'After meals' },
      { name: 'Metformin 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '30 days', instructions: 'With breakfast & dinner' }
    ],
    status: 'pending',
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    notes: 'Monitor fasting blood glucose daily.'
  },
  {
    id: 'RX-102',
    patient_id: 3,
    patient_name: 'Amitabh Sen',
    doctor_name: 'Dr. Vikram Sethi',
    medicines: [
      { name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily (Night)', duration: '30 days', instructions: 'Before bed' },
      { name: 'Aspirin 75mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 days', instructions: 'Post breakfast' }
    ],
    status: 'dispensed',
    created_at: new Date(Date.now() - 60 * 60000).toISOString()
  }
];

const defaultLabOrders: LabOrder[] = [
  {
    id: 'LAB-201',
    patient_id: 3,
    patient_name: 'Amitabh Sen',
    doctor_name: 'Dr. Vikram Sethi',
    test_name: 'Troponin-T & ECG 12-Lead',
    category: 'Cardiology',
    priority: 'stat',
    status: 'in_analysis',
    created_at: new Date(Date.now() - 20 * 60000).toISOString()
  },
  {
    id: 'LAB-202',
    patient_id: 1,
    patient_name: 'Rajesh Kumar',
    doctor_name: 'Dr. Vikram Sethi',
    test_name: 'HbA1c & Complete Blood Count (CBC)',
    category: 'Biochemistry',
    priority: 'urgent',
    status: 'pending',
    created_at: new Date(Date.now() - 15 * 60000).toISOString()
  }
];

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

export const SwasthaAPI = {
  // PATIENT ENDPOINTS
  async getPatients(): Promise<Patient[]> {
    try {
      const res = await apiClient.get<Patient[]>('/patients/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStored(LOCAL_STORAGE_KEY_PATIENTS, res.data);
        return res.data;
      }
    } catch (e) {
      console.warn('FastAPI backend offline or empty, using cached/mock patients', e);
    }
    return getStored<Patient[]>(LOCAL_STORAGE_KEY_PATIENTS, defaultPatients);
  },

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    try {
      const res = await apiClient.post<Patient>('/patients/', data);
      if (res.data) return res.data;
    } catch (e) {
      console.warn('FastAPI backend create failed, updating local state', e);
    }
    const current = getStored<Patient[]>(LOCAL_STORAGE_KEY_PATIENTS, defaultPatients);
    const newPatient: Patient = {
      id: Date.now(),
      name: data.name || 'New Patient',
      age: Number(data.age) || 30,
      gender: data.gender || 'Other',
      phone: data.phone || '+91 00000 00000',
      email: data.email,
      blood_group: data.blood_group,
      allergies: data.allergies || [],
      medical_history: data.medical_history || [],
      registration_number: data.registration_number || `REG${Date.now().toString().slice(-6)}`,
      status: 'active',
      created_at: new Date().toISOString()
    };
    const updated = [newPatient, ...current];
    setStored(LOCAL_STORAGE_KEY_PATIENTS, updated);
    return newPatient;
  },

  // QUEUE ENDPOINTS
  async getQueue(): Promise<QueueEntry[]> {
    try {
      const res = await apiClient.get<QueueEntry[]>('/queue/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStored(LOCAL_STORAGE_KEY_QUEUE, res.data);
        return res.data;
      }
    } catch (e) {
      console.warn('FastAPI queue offline, using mock queue', e);
    }
    return getStored<QueueEntry[]>(LOCAL_STORAGE_KEY_QUEUE, defaultQueue);
  },

  async addToQueue(entry: Partial<QueueEntry>): Promise<QueueEntry> {
    try {
      const res = await apiClient.post<QueueEntry>('/queue/', entry);
      if (res.data) return res.data;
    } catch (e) {
      console.warn('FastAPI queue add failed, saving locally', e);
    }
    const current = getStored<QueueEntry[]>(LOCAL_STORAGE_KEY_QUEUE, defaultQueue);
    const newEntry: QueueEntry = {
      id: Date.now(),
      patient_id: entry.patient_id || 1,
      patient_name: entry.patient_name || 'Patient',
      queue_number: entry.queue_number || `Q00${current.length + 1}`,
      service_type: entry.service_type || 'General Consultation',
      doctor_name: entry.doctor_name || 'Dr. Vikram Sethi',
      priority: entry.priority || 'medium',
      status: 'waiting',
      estimated_wait_time: entry.estimated_wait_time || 15,
      notes: entry.notes || '',
      check_in_time: new Date().toISOString()
    };
    const updated = [...current, newEntry];
    setStored(LOCAL_STORAGE_KEY_QUEUE, updated);
    return newEntry;
  },

  async updateQueueStatus(id: number, status: QueueEntry['status']): Promise<void> {
    try {
      await apiClient.put(`/queue/${id}/status`, null, { params: { status } });
    } catch (e) {
      console.warn('FastAPI status update fallback', e);
    }
    const current = getStored<QueueEntry[]>(LOCAL_STORAGE_KEY_QUEUE, defaultQueue);
    const updated = current.map((q) => (q.id === id ? { ...q, status } : q));
    setStored(LOCAL_STORAGE_KEY_QUEUE, updated);
  },

  // PRESCRIPTIONS (Routing to Pharmacy)
  async getPrescriptions(): Promise<Prescription[]> {
    return getStored<Prescription[]>(LOCAL_STORAGE_KEY_PRESCRIPTIONS, defaultPrescriptions);
  },

  async createPrescription(rx: Partial<Prescription>): Promise<Prescription> {
    const current = getStored<Prescription[]>(LOCAL_STORAGE_KEY_PRESCRIPTIONS, defaultPrescriptions);
    const newRx: Prescription = {
      id: `RX-${Date.now().toString().slice(-4)}`,
      patient_id: rx.patient_id || 1,
      patient_name: rx.patient_name || 'Patient',
      doctor_name: rx.doctor_name || 'Consulting Physician',
      medicines: rx.medicines || [],
      status: 'pending',
      created_at: new Date().toISOString(),
      notes: rx.notes
    };
    const updated = [newRx, ...current];
    setStored(LOCAL_STORAGE_KEY_PRESCRIPTIONS, updated);
    return newRx;
  },

  async updatePrescriptionStatus(id: string | number, status: Prescription['status']): Promise<void> {
    const current = getStored<Prescription[]>(LOCAL_STORAGE_KEY_PRESCRIPTIONS, defaultPrescriptions);
    const updated = current.map((p) => (p.id === id ? { ...p, status } : p));
    setStored(LOCAL_STORAGE_KEY_PRESCRIPTIONS, updated);
  },

  // LAB ORDERS (Routing to Lab)
  async getLabOrders(): Promise<LabOrder[]> {
    return getStored<LabOrder[]>(LOCAL_STORAGE_KEY_LAB_ORDERS, defaultLabOrders);
  },

  async createLabOrder(order: Partial<LabOrder>): Promise<LabOrder> {
    const current = getStored<LabOrder[]>(LOCAL_STORAGE_KEY_LAB_ORDERS, defaultLabOrders);
    const newOrder: LabOrder = {
      id: `LAB-${Date.now().toString().slice(-4)}`,
      patient_id: order.patient_id || 1,
      patient_name: order.patient_name || 'Patient',
      doctor_name: order.doctor_name || 'Consulting Physician',
      test_name: order.test_name || 'Clinical Pathology Test',
      category: order.category || 'Diagnostics',
      priority: order.priority || 'routine',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    const updated = [newOrder, ...current];
    setStored(LOCAL_STORAGE_KEY_LAB_ORDERS, updated);
    return newOrder;
  },

  async updateLabOrderStatus(id: string | number, status: LabOrder['status'], results?: string): Promise<void> {
    const current = getStored<LabOrder[]>(LOCAL_STORAGE_KEY_LAB_ORDERS, defaultLabOrders);
    const updated = current.map((o) => (o.id === id ? { ...o, status, ...(results ? { results } : {}) } : o));
    setStored(LOCAL_STORAGE_KEY_LAB_ORDERS, updated);
  },

  // AI TRIAGE LOGIC
  calculateAITriage(symptoms: string, vitals?: { bp?: string; temp?: string; spo2?: string; hr?: string }): {
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    priorityScore: number;
    recommendedDepartment: string;
    estimatedWaitMinutes: number;
    reasoning: string;
  } {
    const lower = symptoms.toLowerCase();
    
    // Emergency conditions
    if (lower.includes('chest pain') || lower.includes('unconscious') || lower.includes('stroke') || lower.includes('heavy bleeding') || lower.includes('breathing difficulty')) {
      return {
        urgency: 'emergency',
        priorityScore: 95,
        recommendedDepartment: 'Emergency & Cardiology',
        estimatedWaitMinutes: 0,
        reasoning: 'Critical symptoms detected. Immediate triage bypass to Resuscitation/Cardiology.'
      };
    }
    
    // High urgency
    if (lower.includes('fracture') || lower.includes('high fever') || lower.includes('asthma') || lower.includes('severe abdominal') || (vitals?.temp && parseFloat(vitals.temp) > 102)) {
      return {
        urgency: 'high',
        priorityScore: 75,
        recommendedDepartment: 'Urgent Care / Internal Medicine',
        estimatedWaitMinutes: 10,
        reasoning: 'High-acuity clinical markers detected requiring expedited medical consultation.'
      };
    }

    // Medium urgency
    if (lower.includes('cough') || lower.includes('vomiting') || lower.includes('headache') || lower.includes('sprain') || lower.includes('infection')) {
      return {
        urgency: 'medium',
        priorityScore: 50,
        recommendedDepartment: 'General OPD',
        estimatedWaitMinutes: 25,
        reasoning: 'Moderate acute condition suitable for standard outpatient clinical examination.'
      };
    }

    // Low urgency
    return {
      urgency: 'low',
      priorityScore: 25,
      recommendedDepartment: 'Routine Health Check / Preventive OPD',
      estimatedWaitMinutes: 40,
      reasoning: 'Stable, non-urgent consultation; regular queue assigned.'
    };
  }
};
