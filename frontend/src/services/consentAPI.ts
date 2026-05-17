import { Patient } from '../types';

export interface ConsentRequest {
    id: string;
    patientId: string;
    title: string;
    description: string;
    requestedBy: string;
    requestedDate: string;
    expiryDate: string;
    status: 'pending' | 'approved' | 'rejected';
    category: string;
    urgency: 'low' | 'medium' | 'high';
}

class ConsentAPI {
    private mockConsents: ConsentRequest[] = [
        {
            id: '1',
            patientId: '1',
            title: 'Surgical Procedure Consent',
            description: 'Consent for cardiac catheterization procedure scheduled for November 25, 2025',
            requestedBy: 'Dr. John Smith',
            requestedDate: '2025-11-18',
            expiryDate: '2025-11-24',
            status: 'pending',
            category: 'Surgery',
            urgency: 'high'
        },
        {
            id: '2',
            patientId: '1',
            title: 'Medical Records Release',
            description: 'Authorization to release medical records to insurance provider',
            requestedBy: 'Registration Desk',
            requestedDate: '2025-11-15',
            expiryDate: '2025-12-15',
            status: 'approved',
            category: 'Records',
            urgency: 'low'
        },
        {
            id: '3',
            patientId: '1',
            title: 'Blood Transfusion Consent',
            description: 'Consent for blood transfusion during upcoming surgery',
            requestedBy: 'Dr. Sarah Johnson',
            requestedDate: '2025-11-17',
            expiryDate: '2025-11-23',
            status: 'pending',
            category: 'Treatment',
            urgency: 'medium'
        },
        {
            id: '4',
            patientId: '1',
            title: 'Research Participation',
            description: 'Consent to participate in clinical trial for new diabetes medication',
            requestedBy: 'Research Department',
            requestedDate: '2025-11-10',
            expiryDate: '2025-11-30',
            status: 'rejected',
            category: 'Research',
            urgency: 'low'
        }
    ];

    async getConsentsByPatientId(patientId: string): Promise<ConsentRequest[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.mockConsents.filter(c => c.patientId === patientId);
    }

    async updateConsentStatus(id: string, status: 'approved' | 'rejected'): Promise<ConsentRequest> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockConsents.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Consent request not found');

        this.mockConsents[index] = { ...this.mockConsents[index], status };
        return this.mockConsents[index];
    }
}

export default new ConsentAPI();
