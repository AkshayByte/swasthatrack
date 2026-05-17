import { Patient } from '../types';

export interface Encounter {
    id: string;
    patientId: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Routine';
    chiefComplaint: string;
    diagnosis?: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    duration?: number;
    notes?: string;
}

class EncountersAPI {
    private mockEncounters: Encounter[] = [
        {
            id: 'ENC-001',
            patientId: '1',
            patientName: 'Raj Patel',
            doctorName: 'Dr. Arjun Mehta',
            date: '2025-11-20',
            time: '10:00 AM',
            type: 'Consultation',
            chiefComplaint: 'Chest pain and shortness of breath',
            diagnosis: 'Angina Pectoris',
            status: 'completed',
            duration: 45
        },
        {
            id: 'ENC-002',
            patientId: '2',
            patientName: 'Anjali Verma',
            doctorName: 'Dr. Priya Sharma',
            date: '2025-11-20',
            time: '11:30 AM',
            type: 'Follow-up',
            chiefComplaint: 'Post-surgery checkup',
            status: 'in-progress'
        },
        {
            id: 'ENC-003',
            patientId: '3',
            patientName: 'Vikram Singh',
            doctorName: 'Dr. Rajesh Kumar',
            date: '2025-11-20',
            time: '02:00 PM',
            type: 'Consultation',
            chiefComplaint: 'Persistent headache',
            status: 'scheduled'
        },
        {
            id: 'ENC-004',
            patientId: '4',
            patientName: 'Priya Sharma',
            doctorName: 'Dr. Arjun Mehta',
            date: '2025-11-19',
            time: '03:30 PM',
            type: 'Emergency',
            chiefComplaint: 'Severe abdominal pain',
            diagnosis: 'Acute Appendicitis',
            status: 'completed',
            duration: 60
        }
    ];

    async getAllEncounters(): Promise<Encounter[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.mockEncounters;
    }

    async getEncounterById(id: string): Promise<Encounter> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const encounter = this.mockEncounters.find(e => e.id === id);
        if (!encounter) throw new Error('Encounter not found');
        return encounter;
    }

    async getEncountersByPatientId(patientId: string): Promise<Encounter[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.mockEncounters.filter(e => e.patientId === patientId);
    }

    async createEncounter(data: Omit<Encounter, 'id'>): Promise<Encounter> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newEncounter: Encounter = {
            id: `ENC-${String(this.mockEncounters.length + 1).padStart(3, '0')}`,
            ...data
        };
        this.mockEncounters.push(newEncounter);
        return newEncounter;
    }

    async updateEncounter(id: string, data: Partial<Encounter>): Promise<Encounter> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockEncounters.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Encounter not found');

        this.mockEncounters[index] = { ...this.mockEncounters[index], ...data };
        return this.mockEncounters[index];
    }
}

export default new EncountersAPI();
