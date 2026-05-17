
export const mockPatients = [
    {
        id: '1',
        name: 'Raj Patel',
        age: 35,
        gender: 'male',
        phone: '9876543210',
        email: 'raj.patel@example.com',
        address: '123 MG Road, Mumbai, Maharashtra 400001',
        emergencyContact: 'Meera Patel - 9876543211',
        medicalHistory: ['Hypertension', 'Diabetes Type 2'],
        allergies: ['Penicillin'],
        bloodGroup: 'O+',
        registrationDate: '2023-01-15',
        lastVisit: '2025-11-10'
    },
    {
        id: '2',
        name: 'Anjali Verma',
        age: 28,
        gender: 'female',
        phone: '9876543211',
        email: 'anjali.verma@example.com',
        address: '456 Linking Road, Bandra, Mumbai 400050',
        emergencyContact: 'Suresh Verma - 9876543210',
        medicalHistory: ['Asthma'],
        allergies: ['Shellfish'],
        bloodGroup: 'A-',
        registrationDate: '2023-03-22',
        lastVisit: '2025-11-12'
    }
];

export const mockDoctorDashboardData = {
    patients: mockPatients,
    recentDiagnoses: [
        {
            id: '1',
            patientId: '1',
            patientName: 'Raj Patel',
            diagnosis: 'Common Cold',
            symptoms: ['Fever', 'Cough', 'Sore Throat'],
            severity: 'mild',
            notes: 'Patient recovering well',
            diagnosedBy: 'Dr. Arjun Mehta',
            diagnosedAt: '2025-11-10T10:30:00Z',
            followUpRequired: false
        }
    ],
    activePrescriptions: [
        {
            id: '1',
            patientId: '1',
            patientName: 'Raj Patel',
            medicines: [
                {
                    medicineId: '1',
                    medicineName: 'Paracetamol',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    duration: '5 days',
                    quantity: 10,
                    instructions: 'Take with food'
                }
            ],
            instructions: 'Take with food',
            prescribedBy: 'Dr. Arjun Mehta',
            prescribedAt: '2025-11-10T10:30:00Z',
            validUntil: '2025-11-15T10:30:00Z',
            status: 'active'
        }
    ],
    labReports: [
        {
            id: '1',
            patientId: '1',
            patientName: 'Raj Patel',
            testName: 'Complete Blood Count',
            testType: 'Hematology',
            results: [
                {
                    parameter: 'Hemoglobin',
                    value: '14.2',
                    unit: 'g/dL',
                    normalRange: '13.5-17.5',
                    status: 'normal'
                }
            ],
            normalRange: 'Normal',
            status: 'completed',
            orderedBy: 'Dr. Arjun Mehta',
            orderedAt: '2025-11-10T09:00:00Z',
            completedAt: '2025-11-11T10:00:00Z'
        }
    ],
    stats: {
        totalPatients: 42,
        todayAppointments: 8,
        pendingReports: 2,
        activePrescriptions: 3
    }
};

export const mockMedicineDashboardData = {
    medicines: [
        {
            id: '1',
            name: 'Paracetamol 500mg',
            genericName: 'Acetaminophen',
            manufacturer: 'MediCo Pharma',
            batchNumber: 'PC500-202612',
            expiryDate: '2026-12-31',
            currentStock: 150,
            minimumStock: 100,
            maximumStock: 500,
            unitPrice: 2.5,
            category: 'Analgesic',
            isActive: true,
            createdAt: '2023-01-15T00:00:00Z',
            updatedAt: '2025-11-15T00:00:00Z'
        },
        {
            id: '2',
            name: 'Amoxicillin 250mg',
            genericName: 'Amoxicillin',
            manufacturer: 'PharmaCorp',
            batchNumber: 'AM250-202611',
            expiryDate: '2026-11-30',
            currentStock: 75,
            minimumStock: 100,
            maximumStock: 300,
            unitPrice: 3.0,
            category: 'Antibiotic',
            isActive: true,
            createdAt: '2023-03-22T00:00:00Z',
            updatedAt: '2025-11-15T00:00:00Z'
        }
    ],
    stockAlerts: [
        {
            id: '1',
            medicineId: '2',
            medicineName: 'Amoxicillin 250mg',
            currentStock: 75,
            minimumStock: 100,
            alertType: 'low_stock',
            severity: 'high',
            createdAt: '2025-11-15T09:00:00Z',
            isResolved: false
        }
    ],
    recentTransactions: [
        {
            id: '1',
            medicineId: '1',
            medicineName: 'Paracetamol 500mg',
            type: 'in',
            quantity: 100,
            previousStock: 50,
            newStock: 150,
            reason: 'Warehouse delivery',
            referenceNumber: 'INV-20251114-001',
            performedBy: 'Neha Kapoor',
            createdAt: '2025-11-14T10:00:00Z'
        }
    ],
    pendingOrders: [
        {
            id: '1',
            medicineId: '2',
            medicineName: 'Amoxicillin 250mg',
            quantity: 200,
            status: 'pending',
            orderDate: '2025-11-15T09:00:00Z',
            expectedDelivery: '2025-11-20T09:00:00Z',
            supplier: 'PharmaCorp',
            totalCost: 600.0
        }
    ],
    stats: {
        totalMedicines: 25,
        lowStockItems: 2,
        expiredItems: 0,
        totalValue: 12500,
        monthlyTransactions: 45
    }
};

export const mockPatientDashboardData = {
    profile: {
        id: 'P001',
        name: 'Raj Patel',
        age: 35,
        gender: 'Male',
        phone: '9876543210',
        email: 'raj.patel@example.com',
        address: '123 MG Road, Mumbai, Maharashtra 400001',
        emergencyContact: 'Meera Patel - 9876543211',
        bloodGroup: 'O+',
        allergies: ['Penicillin'],
        medicalHistory: ['Hypertension', 'Diabetes Type 2'],
        registrationDate: '2023-01-15'
    },
    diagnosis: 'Common Cold',
    symptoms: ['Fever', 'Cough', 'Sore Throat'],
    severity: 'mild',
    notes: 'Patient recovering well',
    diagnosedBy: 'Dr. Arjun Mehta',
    diagnosedAt: '2025-11-10T10:00:00Z',
    followUpRequired: false,
    labReports: [
        {
            id: '1',
            testName: 'Complete Blood Count',
            testType: 'Hematology',
            results: [
                {
                    parameter: 'Hemoglobin',
                    value: 14.2,
                    unit: 'g/dL',
                    normalRange: '13.5-17.5'
                }
            ],
            status: 'completed',
            orderedBy: 'Dr. Arjun Mehta',
            orderedAt: '2025-11-10T09:00:00Z',
            completedAt: '2025-11-11T10:00:00Z',
            notes: 'All parameters within normal range'
        }
    ],
    appointments: [
        {
            id: '1',
            doctorName: 'Dr. Arjun Mehta',
            doctorSpecialty: 'General Medicine',
            appointmentDate: '2025-11-20',
            appointmentTime: '10:00',
            status: 'scheduled',
            reason: 'Follow-up checkup',
            location: 'OPD Room 101'
        }
    ],
    stats: {
        totalPrescriptions: 5,
        activePrescriptions: 1,
        upcomingAppointments: 2,
        pendingReports: 1
    }
};

export const mockRegistrationDashboardData = {
    registeredPatients: [
        {
            id: '1',
            name: 'Raj Patel',
            age: 35,
            gender: 'Male',
            phone: '9876543210',
            email: 'raj.patel@example.com',
            address: '123 MG Road, Mumbai, Maharashtra 400001',
            emergencyContact: 'Meera Patel - 9876543211',
            bloodGroup: 'O+',
            registrationDate: '2023-01-15',
            registrationNumber: 'REG20230115001',
            status: 'active'
        },
        {
            id: '2',
            name: 'Anjali Verma',
            age: 28,
            gender: 'Female',
            phone: '9876543211',
            email: 'anjali.verma@example.com',
            address: '456 Linking Road, Bandra, Mumbai 400050',
            emergencyContact: 'Suresh Verma - 9876543210',
            bloodGroup: 'A-',
            registrationDate: '2023-03-22',
            registrationNumber: 'REG20230322002',
            status: 'active'
        },
        {
            id: '3',
            name: 'Vikram Singh',
            age: 42,
            gender: 'Male',
            phone: '9876543212',
            email: 'vikram.singh@example.com',
            address: '789 Park Street, Kolkata, West Bengal 700016',
            emergencyContact: 'Kavita Singh - 9876543213',
            bloodGroup: 'B+',
            registrationDate: '2023-05-10',
            registrationNumber: 'REG20230510003',
            status: 'active'
        }
    ],
    queueEntries: [
        {
            id: 'Q1001',
            patientId: '1',
            patientName: 'Raj Patel',
            patientPhone: '9876543210',
            queueNumber: 'Q001',
            serviceType: 'General Consultation',
            doctorId: 'D101',
            doctorName: 'Dr. Arjun Mehta',
            priority: 'normal',
            status: 'waiting',
            estimatedWaitTime: 15,
            checkInTime: '2025-11-15T09:00:00Z',
            notes: 'Regular checkup'
        },
        {
            id: 'Q1002',
            patientId: '2',
            patientName: 'Anjali Verma',
            patientPhone: '9876543211',
            queueNumber: 'Q002',
            serviceType: 'Cardiology',
            doctorId: 'D102',
            doctorName: 'Dr. Priya Sharma',
            priority: 'high',
            status: 'in-progress',
            estimatedWaitTime: 0,
            checkInTime: '2025-11-15T09:15:00Z',
            calledAt: '2025-11-15T09:30:00Z',
            notes: 'Follow-up for hypertension'
        },
        {
            id: 'Q1003',
            patientId: '3',
            patientName: 'Vikram Singh',
            patientPhone: '9876543212',
            queueNumber: 'Q003',
            serviceType: 'Orthopedics',
            doctorId: 'D103',
            doctorName: 'Dr. Rajesh Kumar',
            priority: 'normal',
            status: 'waiting',
            estimatedWaitTime: 30,
            checkInTime: '2025-11-15T09:30:00Z',
            notes: 'Knee pain consultation'
        }
    ],
    appointments: [],
    stats: {
        totalPatients: 1250,
        todayRegistrations: 25,
        currentQueueLength: 8,
        completedAppointments: 17,
        pendingAppointments: 3
    }
};

export const mockLaboratoryDashboardData = {
    labReports: [
        {
            id: '1',
            patientId: '1',
            patientName: 'Raj Patel',
            patientPhone: '9876543210',
            testId: '1',
            testName: 'Complete Blood Count',
            testType: 'Hematology',
            results: [
                {
                    parameter: 'Hemoglobin',
                    value: '14.2',
                    unit: 'g/dL',
                    normalRange: '13.5-17.5',
                    status: 'normal'
                },
                {
                    parameter: 'RBC Count',
                    value: '4.8',
                    unit: 'million/μL',
                    normalRange: '4.5-5.9',
                    status: 'normal'
                }
            ],
            normalRange: 'Normal',
            status: 'completed',
            orderedBy: 'Dr. Arjun Mehta',
            orderedAt: '2025-11-10T09:00:00Z',
            createdAt: '2025-11-10T09:00:00Z',
            completedAt: '2025-11-11T10:00:00Z',
            priority: 'normal'
        },
        {
            id: '2',
            patientId: '2',
            patientName: 'Anjali Verma',
            patientPhone: '9876543211',
            testId: '2',
            testName: 'Lipid Profile',
            testType: 'Biochemistry',
            results: [],
            normalRange: 'Normal',
            status: 'pending',
            orderedBy: 'Dr. Priya Sharma',
            orderedAt: '2025-11-12T11:00:00Z',
            createdAt: '2025-11-12T11:00:00Z',
            priority: 'high'
        },
        {
            id: '3',
            patientId: '3',
            patientName: 'Vikram Singh',
            patientPhone: '9876543212',
            testId: '3',
            testName: 'Liver Function Test',
            testType: 'Biochemistry',
            results: [],
            normalRange: 'Normal',
            status: 'in_progress',
            orderedBy: 'Dr. Rajesh Kumar',
            orderedAt: '2025-11-14T14:30:00Z',
            createdAt: '2025-11-14T14:30:00Z',
            priority: 'normal'
        }
    ],
    labTests: [
        {
            id: '1',
            testName: 'Complete Blood Count',
            testType: 'Hematology',
            category: 'Hematology',
            description: 'Complete blood count with differential',
            normalRange: 'Normal',
            unit: 'various',
            isActive: true,
            estimatedTime: 24,
            price: 150
        },
        {
            id: '2',
            testName: 'Lipid Profile',
            testType: 'Biochemistry',
            category: 'Biochemistry',
            description: 'Cholesterol and lipid measurements',
            normalRange: 'Normal',
            unit: 'mg/dL',
            isActive: true,
            estimatedTime: 48,
            price: 200
        },
        {
            id: '3',
            testName: 'Liver Function Test',
            testType: 'Biochemistry',
            category: 'Biochemistry',
            description: 'Liver enzyme and function tests',
            normalRange: 'Normal',
            unit: 'U/L',
            isActive: true,
            estimatedTime: 36,
            price: 180
        }
    ],
    stats: {
        totalTests: 125,
        pendingReports: 8,
        completedToday: 12,
        abnormalResults: 3,
        averageProcessingTime: 32
    }
};

// Aliases for compatibility with existing code
export const MOCK_PATIENTS = mockPatients;
export const MOCK_MEDICINES = mockMedicineDashboardData.medicines;

export const MOCK_USERS = [
    {
        id: '1',
        name: "Dr. Arjun Mehta",
        email: "doctor@swastha.com",
        password: "doctor123",
        role: "doctor",
        phone: "+91 98765 43210",
        department: "Cardiology",
        specialization: "Interventional Cardiology",
        licenseNumber: "MED-LIC-2024-12345"
    },
    {
        id: '2',
        name: "Priya Sharma",
        email: "patient@swastha.com",
        password: "patient123",
        role: "patient",
        phone: "+91 98765 43211"
    },
    {
        id: '3',
        name: "Rohit Verma",
        email: "pharmacist@swastha.com",
        password: "pharma123",
        role: "pharmacist",
        phone: "+91 98765 43212",
        department: "Pharmacy",
        specialization: "Clinical Pharmacy",
        licenseNumber: "PHAR-LIC-2024-67890"
    },
    {
        id: '4',
        name: "Neha Singh",
        email: "lab@swastha.com",
        password: "lab123",
        role: "lab",
        phone: "+91 98765 43213",
        department: "Laboratory",
        specialization: "Clinical Laboratory",
        licenseNumber: "LAB-LIC-2024-22222"
    },
    {
        id: '5',
        name: "Aman Gupta",
        email: "registration@swastha.com",
        password: "reg123",
        role: "registration",
        phone: "+91 98765 43214",
        department: "Registration Desk",
        specialization: "Patient Registration",
        licenseNumber: "REG-STAFF-2024-11111"
    },
    {
        id: '6',
        name: "Admin User",
        email: "admin@swastha.com",
        password: "admin123",
        role: "admin",
        phone: "+91 98765 43215",
        department: "Administration",
        specialization: "System Administration",
        licenseNumber: "ADMIN-2024-00001"
    }
];

export const MOCK_FACILITIES = [
    {
        id: 'F001',
        name: 'General Ward A',
        type: 'Ward',
        location: 'Building A, Floor 2',
        capacity: 50,
        occupied: 35,
        status: 'Active',
        equipment: ['Beds', 'Monitors', 'Oxygen Supply']
    },
    {
        id: 'F002',
        name: 'ICU Unit 1',
        type: 'ICU',
        location: 'Building B, Floor 3',
        capacity: 20,
        occupied: 18,
        status: 'Active',
        equipment: ['Ventilators', 'Cardiac Monitors', 'Defibrillators']
    },
    {
        id: 'F003',
        name: 'OPD Clinic 1',
        type: 'OPD',
        location: 'Building A, Floor 1',
        capacity: 10,
        occupied: 7,
        status: 'Active',
        equipment: ['Examination Tables', 'BP Monitors', 'Stethoscopes']
    },
    {
        id: 'F004',
        name: 'Emergency Room',
        type: 'Emergency',
        location: 'Building A, Ground Floor',
        capacity: 15,
        occupied: 12,
        status: 'Active',
        equipment: ['Trauma Beds', 'Defibrillators', 'Emergency Kits']
    }
];
