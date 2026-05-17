import api from '../api/client';
import { QueueEntry } from '../types';

class QueueAPI {
    // Helper to transform backend queue entry to frontend format
    private transformEntry(entry: any): QueueEntry {
        return {
            id: entry.id,
            patientId: entry.patient_id,
            queueNumber: entry.queue_number,
            serviceType: entry.service_type,
            doctorId: entry.doctor_id,
            doctorName: entry.doctor_name,
            priority: entry.priority,
            status: entry.status,
            checkInTime: entry.check_in_time,
            estimatedWaitTime: entry.estimated_wait_time,
            notes: entry.notes,
            // Map nested patient details if available
            patientName: entry.patient ? entry.patient.name : 'Unknown',
            patientPhone: entry.patient ? entry.patient.phone : '',
            patient: entry.patient
        } as QueueEntry;
    }

    async getAllQueueEntries(): Promise<QueueEntry[]> {
        // GET /api/queue/?status=waiting (or all)
        // Let's fetch all for now, or filter by status if needed
        const response = await api.get('/queue/');
        return response.data.map((entry: any) => this.transformEntry(entry));
    }

    async getQueueEntryById(queueId: string | number): Promise<QueueEntry> {
        const response = await api.get(`/queue/${queueId}`);
        return this.transformEntry(response.data);
    }

    async addPatientToQueue(queueData: Partial<QueueEntry>): Promise<QueueEntry> {
        // Prepare data for backend
        // Backend expects snake_case: patient_id, queue_number, etc.
        const payload = {
            patient_id: queueData.patientId,
            queue_number: queueData.queueNumber,
            service_type: queueData.serviceType,
            doctor_id: queueData.doctorId,
            doctor_name: queueData.doctorName,
            priority: queueData.priority || 'normal',
            status: 'waiting',
            estimated_wait_time: queueData.estimatedWaitTime || 0,
            notes: queueData.notes
        };

        const response = await api.post('/queue/', payload);
        return this.transformEntry(response.data);
    }

    async updateQueueEntry(queueId: string | number, queueData: Partial<QueueEntry>): Promise<QueueEntry> {
        // Backend currently only has update status endpoint: PUT /queue/{id}/status?status=...
        // But if we need full update, we need to add that endpoint.
        // For now, let's assume we handle status update primarily.
        if (queueData.status) {
            const response = await api.put(`/queue/${queueId}/status?status=${queueData.status}`);
            return this.transformEntry(response.data);
        }
        // If other updates are needed, we need to implement full update endpoint
        throw new Error("Full queue entry update not implemented in backend yet");
    }

    async removePatientFromQueue(queueId: string | number): Promise<void> {
        // DELETE /api/queue/{id} - need to implement in backend if needed
        // For now, maybe just mark as completed or cancelled?
        // Let's assume we implement DELETE endpoint or just ignore for now as mock did array splice.
        throw new Error("Delete queue entry not implemented in backend");
    }

    async getQueueStats(): Promise<any> {
        // We can fetch stats from /api/dashboard/registration or just calculate from fetching all
        // Let's calculate from fetch all for simplicity, or use specific endpoint
        const entries = await this.getAllQueueEntries();
        const total = entries.length;
        const waiting = entries.filter(q => q.status === 'waiting').length;
        const inProgress = entries.filter(q => q.status === 'in-progress').length;
        const completed = entries.filter(q => q.status === 'completed').length;

        return {
            total,
            waiting,
            inProgress,
            completed
        };
    }
}

export default new QueueAPI();
