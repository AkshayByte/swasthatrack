import { LabReport } from '../types';

class LabAPI {
    // Mock lab test data
    private mockLabTests: LabReport[] = [
        {
            id: '1',
            patientId: '1',
            testName: 'Complete Blood Count',
            testType: 'Hematology',
            orderedAt: '2025-11-10',
            status: 'completed',
            priority: 'normal',
            orderedBy: 'Dr. Arjun Mehta',
            patientName: 'Raj Patel',
            patientPhone: '9876543210',
            testId: '1'
        },
        {
            id: '2',
            patientId: '2',
            testName: 'Lipid Profile',
            testType: 'Biochemistry',
            orderedAt: '2025-11-12',
            status: 'pending',
            priority: 'high',
            orderedBy: 'Dr. Arjun Mehta',
            patientName: 'Anjali Verma',
            patientPhone: '9876543211',
            testId: '2'
        },
        {
            id: '3',
            patientId: '3',
            testName: 'Liver Function Test',
            testType: 'Biochemistry',
            orderedAt: '2025-11-14',
            status: 'in_progress',
            priority: 'normal',
            orderedBy: 'Dr. Arjun Mehta',
            patientName: 'Vikram Singh',
            patientPhone: '9876543212',
            testId: '3'
        }
    ];

    // Mock lab report data
    private mockLabReports: LabReport[] = [
        {
            id: '1',
            patientId: '1',
            testName: 'Complete Blood Count',
            testType: 'Hematology',
            orderedAt: '2025-11-10',
            completedAt: '2025-11-11',
            results: [
                { parameter: 'WBC', value: '7000', unit: '/uL', normalRange: '4000-11000', status: 'normal' },
                { parameter: 'RBC', value: '4.5', unit: 'M/uL', normalRange: '4.5-5.5', status: 'normal' },
                { parameter: 'Hemoglobin', value: '14', unit: 'g/dL', normalRange: '13.5-17.5', status: 'normal' }
            ],
            status: 'completed',
            priority: 'normal',
            orderedBy: 'Dr. Arjun Mehta',
            patientName: 'Raj Patel',
            patientPhone: '9876543210',
            testId: '1',
            createdAt: '2025-11-10T09:00:00Z'
        },
        {
            id: '2',
            patientId: '2',
            testName: 'Lipid Profile',
            testType: 'Biochemistry',
            orderedAt: '2025-11-12',
            results: [],
            status: 'pending',
            priority: 'high',
            orderedBy: 'Dr. Arjun Mehta',
            patientName: 'Anjali Verma',
            patientPhone: '9876543211',
            testId: '2',
            createdAt: '2025-11-12T11:00:00Z'
        },
        {
            id: '3',
            patientId: '3',
            testName: 'Liver Function Test',
            testType: 'Biochemistry',
            orderedAt: '2025-11-14',
            results: [],
            status: 'in_progress',
            priority: 'normal',
            orderedBy: 'Dr. Arjun Mehta',
            patientName: 'Vikram Singh',
            patientPhone: '9876543212',
            testId: '3',
            createdAt: '2025-11-14T14:30:00Z'
        }
    ];

    async getAllLabTests(): Promise<LabReport[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.mockLabTests;
    }

    async getLabTestById(testId: string): Promise<LabReport> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const test = this.mockLabTests.find(t => t.id === testId);
        if (!test) throw new Error('Lab test not found');
        return test;
    }

    async getAllLabReports(): Promise<LabReport[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.mockLabReports;
    }

    async getLabReportById(reportId: string): Promise<LabReport> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const report = this.mockLabReports.find(r => r.id === reportId);
        if (!report) throw new Error('Lab report not found');
        return report;
    }

    async getLabReportsByPatientId(patientId: string): Promise<LabReport[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.mockLabReports.filter(r => r.patientId === patientId);
    }

    async createLabTestRequest(testData: Partial<LabReport>): Promise<LabReport> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newTest: LabReport = {
            id: String(this.mockLabTests.length + 1),
            patientId: testData.patientId || '0',
            testName: testData.testName || '',
            testType: testData.testType || 'General',
            status: 'pending',
            priority: testData.priority || 'normal',
            orderedBy: testData.orderedBy || 'Unknown',
            orderedAt: new Date().toISOString().split('T')[0],
            patientName: testData.patientName || 'Unknown',
            patientPhone: testData.patientPhone || '',
            testId: testData.testId || '',
            createdAt: new Date().toISOString(),
            results: [],
            ...testData
        } as LabReport;
        this.mockLabTests.push(newTest);
        return newTest;
    }

    async updateLabReport(reportId: string, reportData: Partial<LabReport>): Promise<LabReport> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockLabReports.findIndex(r => r.id === reportId);
        if (index === -1) throw new Error('Lab report not found');

        this.mockLabReports[index] = { ...this.mockLabReports[index], ...reportData };
        return this.mockLabReports[index];
    }

    async uploadTestResults(reportId: string, resultsData: any): Promise<LabReport> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockLabReports.findIndex(r => r.id === reportId);
        if (index === -1) throw new Error('Lab report not found');

        this.mockLabReports[index] = {
            ...this.mockLabReports[index],
            results: Array.isArray(resultsData) ? resultsData : [],
            status: 'completed',
            completedAt: new Date().toISOString().split('T')[0]
        };
        return this.mockLabReports[index];
    }

    async markTestAsCompleted(reportId: string): Promise<LabReport> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockLabReports.findIndex(r => r.id === reportId);
        if (index === -1) throw new Error('Lab report not found');

        this.mockLabReports[index].status = 'completed';
        this.mockLabReports[index].completedAt = new Date().toISOString().split('T')[0];
        return this.mockLabReports[index];
    }

    async deleteLabReport(reportId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockLabReports.findIndex(r => r.id === reportId);
        if (index !== -1) {
            this.mockLabReports.splice(index, 1);
        }
    }
}

export default new LabAPI();
