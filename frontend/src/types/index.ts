export interface User {
    id: string;
    email: string;
    fullName?: string;
    role: string;
    isActive: boolean;
}

export interface Patient {
    id: string | number;
    name: string;
    age: number;
    gender: string;
    phone: string;
    email?: string;
    address: string;
    emergencyContact: string;
    bloodGroup?: string;
    allergies?: string[]; // Changed to string array to match mock data
    medicalHistory?: string[]; // Changed to string array to match mock data
    registrationDate: string;
    registrationNumber: string;
    status: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorName: string;
    doctorSpecialty: string;
    appointmentDate: string;
    duration: number;
    status: string;
    reason: string;
    notes?: string;
    location: string;
    patient?: Patient;
}

export interface QueueEntry {
    id: string | number;
    patientId: string;
    queueNumber: string;
    serviceType: string;
    doctorId?: string;
    doctorName?: string;
    priority: string;
    status: string;
    estimatedWaitTime: number;
    checkInTime: string;
    calledAt?: string;
    completedAt?: string;
    notes?: string;
    patientName?: string;
    patientPhone?: string;
    patient?: Patient;
}

export interface DashboardStats {
    totalPatients?: number;
    todayRegistrations?: number;
    activeQueue?: number;
    recentRegistrations?: any[];
    pendingTests?: number;
    completedToday?: number;
    criticalResults?: number;
    recentReports?: any[];
    activePrescriptions?: number;
    upcomingAppointments?: number;
    pendingLabReports?: number;
    recentHistory?: any[];
    totalMedicines?: number;
    lowStockItems?: number;
    expiringSoon?: number;
    recentActivities?: any[];
}

export interface Prescription {
    id: string | number;
    patientId: string;
    prescribedBy: string;
    prescribedAt: string;
    medicines: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }[];
    validUntil: string;
    status: 'active' | 'completed' | 'pending' | 'dispensed';
    doctorName?: string; // For UI compatibility if needed
    date?: string; // For UI compatibility if needed
}

export interface LabReport {
    id: string | number;
    patientId: string;
    testName: string;
    testType?: string;
    orderedAt: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority?: string;
    orderedBy: string;
    patientName?: string;
    patientPhone?: string;
    testId?: string;
    results?: {
        parameter: string;
        value: string;
        unit: string;
        normalRange: string;
    }[];
}
