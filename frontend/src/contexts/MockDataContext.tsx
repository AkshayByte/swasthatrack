import React, { createContext, useContext, useState } from 'react';
import {
    mockPatients,
    mockDoctorDashboardData,
    mockMedicineDashboardData,
    mockRegistrationDashboardData,
    mockLaboratoryDashboardData
} from '../data/mockData';
import { Patient, QueueEntry, Prescription, LabReport } from '../types';
import patientsAPI from '../services/patientsAPI';
import queueAPI from '../services/queueAPI';
import { useEffect } from 'react';

// Local interfaces not in global types
interface Medicine {
    id: string;
    name: string;
    currentStock: number;
    [key: string]: any;
}

interface MockDataContextType {
    patients: Patient[];
    queue: QueueEntry[];
    prescriptions: Prescription[];
    labReports: LabReport[];
    medicines: Medicine[];

    // Actions
    registerPatient: (patient: Patient) => Promise<Patient>;
    addToQueue: (patientId: string, doctorId: string, doctorName: string, reason: string, patientOverride?: Patient) => void;
    updateQueueStatus: (entryId: string, status: 'waiting' | 'in-progress' | 'completed') => void;
    createPrescription: (prescription: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>) => void;
    dispenseMedicine: (prescriptionId: string) => void;
    orderLabTest: (test: Omit<LabReport, 'id' | 'status' | 'orderedAt'>) => void;
    completeLabTest: (reportId: string, results: any[]) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize state with mock data
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await patientsAPI.getAllPatients();
                // Merge with mock patients if API is empty or just use API?
                // For now, let's use API data. If API fails (e.g. backend not running), fallback to mock?
                // Let's just set the data.
                if (data && data.length > 0) {
                    setPatients(data);
                } else {
                    setPatients(mockPatients as any[]); // Fallback to mock data if DB is empty
                }
            } catch (error) {
                console.error("Failed to fetch patients:", error);
                setPatients(mockPatients as any[]); // Fallback
            }
        };

        const fetchQueue = async () => {
            try {
                const data = await queueAPI.getAllQueueEntries();
                if (data && data.length > 0) {
                    setQueue(data);
                } else {
                    setQueue(mockRegistrationDashboardData.queueEntries as any[]);
                }
            } catch (error) {
                console.error("Failed to fetch queue:", error);
                setQueue(mockRegistrationDashboardData.queueEntries as any[]);
            }
        };

        fetchPatients();
        fetchQueue();
    }, []);
    const [queue, setQueue] = useState<QueueEntry[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockDoctorDashboardData.activePrescriptions as any[]);
    const [labReports, setLabReports] = useState<LabReport[]>(mockLaboratoryDashboardData.labReports as any[]);
    const [medicines, setMedicines] = useState<Medicine[]>(mockMedicineDashboardData.medicines);

    // --- Actions ---

    const registerPatient = async (newPatient: Patient) => {
        try {
            // Call API
            const createdPatient = await patientsAPI.createPatient(newPatient);
            setPatients(prev => [...prev, createdPatient]);
            console.log('Patient Registered:', createdPatient);
            return createdPatient;
        } catch (error) {
            console.error("Failed to register patient:", error);
            // Optimistic update or fallback?
            // Fallback to local state update for demo purposes if backend fails
            const patientWithId = { ...newPatient, id: (patients.length + 1).toString() };
            setPatients(prev => [...prev, patientWithId as Patient]);
            return patientWithId;
        }
    };

    const addToQueue = async (patientId: string, doctorId: string, doctorName: string, reason: string, patientOverride?: Patient) => {
        let patient = patientOverride;
        if (!patient) {
            patient = patients.find(p => p.id == patientId);
        }

        if (!patient) {
            // Try fetching from API as last resort
            try {
                patient = await patientsAPI.getPatientById(patientId);
            } catch (e) {
                console.error("Patient not found for queue:", patientId);
                return;
            }
        }

        if (!patient) return;

        try {
            const newEntry = {
                patientId: patientId,
                patientName: patient.name,
                patientPhone: patient.phone,
                queueNumber: `Q${Date.now()}`, // Temporary or let backend generate? Backend expects us to send it.
                serviceType: 'Consultation',
                doctorId: doctorId,
                doctorName: doctorName,
                priority: 'normal',
                status: 'waiting',
                estimatedWaitTime: 15,
                notes: reason
            };

            // Backend call
            const createdEntry = await queueAPI.addPatientToQueue(newEntry);
            setQueue(prev => [...prev, createdEntry]);
            console.log('Added to Queue (DB):', createdEntry);
        } catch (error) {
            console.error("Failed to add to queue:", error);
            // Fallback
            // ...
        }
    };

    const updateQueueStatus = async (entryId: string, status: 'waiting' | 'in-progress' | 'completed') => {
        try {
            await queueAPI.updateQueueEntry(entryId, { status });
            setQueue(prev => prev.map(entry =>
                entry.id == entryId ? { ...entry, status } : entry
            ));
        } catch (error) {
            console.error("Failed to update queue status:", error);
        }
    };

    const createPrescription = (prescriptionData: Omit<Prescription, 'id' | 'status' | 'prescribedAt'>) => {
        const newPrescription = {
            ...prescriptionData,
            id: `RX${Date.now()}`,
            status: 'active',
            prescribedAt: new Date().toISOString()
        } as Prescription;
        setPrescriptions(prev => [...prev, newPrescription]);
        console.log('Prescription Created:', newPrescription);
    };

    const dispenseMedicine = (prescriptionId: string) => {
        // 1. Mark prescription as dispensed
        setPrescriptions(prev => prev.map(p =>
            p.id === prescriptionId ? { ...p, status: 'dispensed' } : p
        ));

        // 2. Reduce stock for each medicine in the prescription
        const prescription = prescriptions.find(p => p.id === prescriptionId);
        if (prescription) {
            prescription.medicines.forEach((med: any) => {
                setMedicines(prevMeds => prevMeds.map(m => {
                    // Try to match by ID if available (dynamic cast) or name
                    const medId = med.medicineId || med.id;
                    const medName = med.medicineName || med.name;

                    if ((medId && m.id === medId) || (medName && m.name === medName)) {
                        return { ...m, currentStock: m.currentStock - (med.quantity || 1) };
                    }
                    return m;
                }));
            });
        }
        console.log('Medicine Dispensed for:', prescriptionId);
    };

    const orderLabTest = (testData: Omit<LabReport, 'id' | 'status' | 'orderedAt'>) => {
        const newReport = {
            ...testData,
            id: `LAB${Date.now()}`,
            status: 'pending',
            orderedAt: new Date().toISOString(),
            results: []
        } as LabReport;
        setLabReports(prev => [...prev, newReport]);
        console.log('Lab Test Ordered:', newReport);
    };

    const completeLabTest = (reportId: string, results: any[]) => {
        setLabReports(prev => prev.map(report =>
            report.id === reportId
                ? { ...report, status: 'completed', results, completedAt: new Date().toISOString() }
                : report
        ));
        console.log('Lab Test Completed:', reportId);
    };

    return (
        <MockDataContext.Provider value={{
            patients,
            queue,
            prescriptions,
            labReports,
            medicines,
            registerPatient,
            addToQueue,
            updateQueueStatus,
            createPrescription,
            dispenseMedicine,
            orderLabTest,
            completeLabTest
        }}>
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => {
    const context = useContext(MockDataContext);
    if (context === undefined) {
        throw new Error('useMockData must be used within a MockDataProvider');
    }
    return context;
};
