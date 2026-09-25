import { apiClient } from './api';

export type ClinicalRole = 'doctor' | 'pharmacist' | 'lab' | 'registration' | 'admin';

export interface ClinicalUser {
  id: number;
  name: string;
  email: string;
  role: ClinicalRole;
  staffId: string;
  department: string;
  avatarInitials: string;
  token: string;
  loginTime: string;
}

export interface RoleProfile {
  role: ClinicalRole;
  name: string;
  email: string;
  staffId: string;
  title: string;
  department: string;
  departmentKey: string;
  avatarInitials: string;
  allowedDepartments: string[];
  description: string;
}

// UI lookup table — maps role to display metadata. Does NOT grant access.
export const CLINICAL_STAFF_PROFILES: Record<ClinicalRole, RoleProfile> = {
  doctor: {
    role: 'doctor',
    name: 'Dr. Vikram Sethi, MD',
    email: 'doctor@swasthatrack.org',
    staffId: 'DOC-8821',
    title: 'Senior Consulting Physician',
    department: 'Cardiology & Clinical OPD',
    departmentKey: 'doctor',
    avatarInitials: 'VS',
    allowedDepartments: ['doctor', 'registration'],
    description: 'Direct access to AI consultation queues, patient vitals, diagnostics, and e-prescriptions.'
  },
  pharmacist: {
    role: 'pharmacist',
    name: 'Sunil Verma, B.Pharm',
    email: 'pharmacy@swasthatrack.org',
    staffId: 'PHARM-4402',
    title: 'Chief Dispensing Pharmacist',
    department: 'Central Pharmacy & Stock',
    departmentKey: 'pharmacy',
    avatarInitials: 'SV',
    allowedDepartments: ['pharmacy'],
    description: 'Authorization for prescription fulfillment, medication dispensation, and batch stock control.'
  },
  lab: {
    role: 'lab',
    name: 'Dr. Meenakshi Iyer, MD (Path)',
    email: 'lab@swasthatrack.org',
    staffId: 'LAB-9120',
    title: 'Head of Clinical Pathology',
    department: 'Diagnostic Pathology & Lab',
    departmentKey: 'lab',
    avatarInitials: 'MI',
    allowedDepartments: ['lab'],
    description: 'Pathology sample tracking, diagnostic analyzer telemetry, and automated lab report generation.'
  },
  registration: {
    role: 'registration',
    name: 'Pooja Deshmukh',
    email: 'reception@swasthatrack.org',
    staffId: 'REG-1049',
    title: 'Patient Intake & Triage Officer',
    department: 'Patient Check-in & Triage',
    departmentKey: 'registration',
    avatarInitials: 'PD',
    allowedDepartments: ['registration'],
    description: 'Patient check-in, electronic medical record lookup, and real-time AI emergency triage queue routing.'
  },
  admin: {
    role: 'admin',
    name: 'Dr. Alok Verma',
    email: 'admin@swasthatrack.org',
    staffId: 'ADM-0001',
    title: 'Medical Superintendent & Administrator',
    department: 'Hospital Administration & Governance',
    departmentKey: 'admin',
    avatarInitials: 'AV',
    allowedDepartments: ['admin', 'doctor', 'pharmacy', 'lab', 'registration'],
    description: 'Master administrative clearance across all clinical systems, security logs, and care operations.'
  }
};

const AUTH_STORAGE_KEY = 'swastha_clinical_user';
const TOKEN_STORAGE_KEY = 'swastha_token';

// Event listeners for multi-component reactivity
type AuthListener = (user: ClinicalUser | null) => void;
const listeners: Set<AuthListener> = new Set();

export function subscribeAuth(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners(user: ClinicalUser | null) {
  listeners.forEach((fn) => {
    try {
      fn(user);
    } catch (e) {
      console.error('Auth listener error', e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('swastha-auth-changed', { detail: user }));
  }
}

export function getCurrentUser(): ClinicalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ClinicalUser;
  } catch {
    return null;
  }
}

export async function loginWithCredentials(email: string, password: string): Promise<ClinicalUser> {
  if (!email.trim() || !password.trim()) {
    throw new Error('Email and password are required.');
  }

  const response = await apiClient.post('/auth/login', { email, password });

  if (!response.data || !response.data.access_token) {
    throw new Error('Login failed. Invalid server response.');
  }

  const role = (response.data.role as ClinicalRole) || 'doctor';
  const profile = CLINICAL_STAFF_PROFILES[role] || CLINICAL_STAFF_PROFILES.doctor;

  const user: ClinicalUser = {
    id: response.data.user_id || 1,
    name: response.data.name || profile.name,
    email: email,
    role: role,
    staffId: profile.staffId,
    department: profile.department,
    avatarInitials: profile.avatarInitials,
    token: response.data.access_token,
    loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, user.token);
  }
  notifyListeners(user);
  return user;
}

export async function loginWithGoogle(credential: string): Promise<ClinicalUser> {
  if (!credential) {
    throw new Error('Google credential token is missing.');
  }

  const response = await apiClient.post('/auth/google', { credential });

  if (!response.data || !response.data.access_token) {
    throw new Error('Google authentication failed on server.');
  }

  const role = (response.data.role as ClinicalRole) || 'registration';
  const profile = CLINICAL_STAFF_PROFILES[role] || CLINICAL_STAFF_PROFILES.registration;

  const userName = response.data.name || 'Google User';
  const avatarInitials = userName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'GU';

  const user: ClinicalUser = {
    id: response.data.user_id || 1,
    name: userName,
    email: '',
    role: role,
    staffId: profile.staffId || `ST-GGL-${response.data.user_id || '01'}`,
    department: profile.department || 'Clinical Services',
    avatarInitials: avatarInitials,
    token: response.data.access_token,
    loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, user.token);
  }
  notifyListeners(user);
  return user;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  notifyListeners(null);
}

export function canAccessDepartment(role: ClinicalRole | undefined, department?: string): boolean {
  if (!role) return false;
  if (role === 'admin') return true;
  if (!department) return true; // general dashboard overview accessible if logged in
  
  const profile = CLINICAL_STAFF_PROFILES[role];
  if (!profile) return false;
  return profile.allowedDepartments.includes(department);
}
