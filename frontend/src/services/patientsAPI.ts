import api from '../api/client';
import { Patient } from '../types';

class PatientsAPI {
    async getAllPatients(): Promise<Patient[]> {
        // GET /api/patients
        const response = await api.get('/patients/');
        return response.data;
    }

    async getPatientById(patientId: string): Promise<Patient> {
        // GET /api/patients/{id}
        const response = await api.get(`/patients/${patientId}`);
        return response.data;
    }

    async createPatient(patientData: Partial<Patient>): Promise<Patient> {
        // POST /api/patients/
        // Need to make sure patientData matches what the backend expects
        const response = await api.post('/patients/', patientData);
        return response.data;
    }

    async updatePatient(patientId: string, patientData: Partial<Patient>): Promise<Patient> {
        // PUT /api/patients/{id}
        const response = await api.put(`/patients/${patientId}`, patientData);
        return response.data;
    }

    async deletePatient(patientId: string): Promise<void> {
        // DELETE /api/patients/{id}
        await api.delete(`/patients/${patientId}`);
    }
}

export default new PatientsAPI();
