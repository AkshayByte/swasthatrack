import { Prescription } from '../types';

class PrescriptionsAPI {
    // Mock prescription data
    private mockPrescriptions: Prescription[] = [
        {
            id: '1',
            patientId: '1',
            prescribedBy: 'Dr. Arjun Mehta',
            prescribedAt: '2025-11-10',
            medicines: [
                { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '5 days' }
            ],
            validUntil: '2025-12-10',
            status: 'pending'
        },
        {
            id: '2',
            patientId: '2',
            prescribedBy: 'Dr. Arjun Mehta',
            prescribedAt: '2025-11-12',
            medicines: [
                { name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times daily', duration: '7 days' }
            ],
            validUntil: '2025-12-12',
            status: 'dispensed'
        },
        {
            id: '3',
            patientId: '3',
            prescribedBy: 'Dr. Arjun Mehta',
            prescribedAt: '2025-11-14',
            medicines: [
                { name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed', duration: '3 days' }
            ],
            validUntil: '2025-12-14',
            status: 'pending'
        },
        {
            id: '4',
            patientId: '1',
            prescribedBy: 'Dr. Arjun Mehta',
            prescribedAt: '2025-11-15',
            medicines: [
                { name: 'Cetirizine', dosage: '10mg', frequency: 'At night', duration: '10 days' }
            ],
            validUntil: '2025-12-15',
            status: 'pending'
        }
    ];

    async getAllPrescriptions(): Promise<Prescription[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.mockPrescriptions;
    }

    async getPrescriptionById(prescriptionId: string): Promise<Prescription> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const prescription = this.mockPrescriptions.find(p => p.id === prescriptionId);
        if (!prescription) throw new Error('Prescription not found');
        return prescription;
    }

    async getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.mockPrescriptions.filter(p => p.patientId === patientId);
    }

    async createPrescription(prescriptionData: Partial<Prescription>): Promise<Prescription> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newPrescription: Prescription = {
            id: String(this.mockPrescriptions.length + 1),
            patientId: prescriptionData.patientId || '0',
            prescribedBy: prescriptionData.prescribedBy || 'Unknown',
            prescribedAt: new Date().toISOString().split('T')[0],
            medicines: prescriptionData.medicines || [],
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            ...prescriptionData
        } as Prescription;
        this.mockPrescriptions.push(newPrescription);
        return newPrescription;
    }

    async updatePrescription(prescriptionId: string, prescriptionData: Partial<Prescription>): Promise<Prescription> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockPrescriptions.findIndex(p => p.id === prescriptionId);
        if (index === -1) throw new Error('Prescription not found');

        this.mockPrescriptions[index] = { ...this.mockPrescriptions[index], ...prescriptionData };
        return this.mockPrescriptions[index];
    }

    async deletePrescription(prescriptionId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockPrescriptions.findIndex(p => p.id === prescriptionId);
        if (index !== -1) {
            this.mockPrescriptions.splice(index, 1);
        }
    }

    async markAsDispensed(prescriptionId: string): Promise<Prescription> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockPrescriptions.findIndex(p => p.id === prescriptionId);
        if (index === -1) throw new Error('Prescription not found');

        this.mockPrescriptions[index].status = 'dispensed';
        return this.mockPrescriptions[index];
    }
}

export default new PrescriptionsAPI();
