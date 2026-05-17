class DashboardService {
  // Mock data for dashboards
  mockMedicineDashboard = {
    totalMedicines: 125,
    lowStockItems: 8,
    recentOrders: 3,
    pendingApprovals: 2,
    stockValue: 125000,
    monthlyConsumption: 45000,
    inventoryStatus: [
      { name: 'Paracetamol 500mg', stock: 500, minStock: 100, status: 'good' },
      { name: 'Amoxicillin 250mg', stock: 75, minStock: 100, status: 'low' },
      { name: 'Ibuprofen 200mg', stock: 200, minStock: 150, status: 'good' }
    ]
  };

  mockDoctorDashboard = {
    totalPatients: 42,
    pendingDiagnoses: 5,
    pendingPrescriptions: 3,
    todayAppointments: 8,
    completedToday: 3,
    patientQueue: [
      { id: 1, name: 'John Doe', time: '09:00 AM', priority: 'normal' },
      { id: 2, name: 'Jane Smith', time: '09:30 AM', priority: 'high' },
      { id: 3, name: 'Robert Johnson', time: '10:00 AM', priority: 'normal' }
    ]
  };

  mockPatientDashboard = {
    nextAppointment: '2025-11-20 10:00 AM',
    pendingReports: 2,
    pendingPrescriptions: 1,
    recentVisits: 3,
    healthMetrics: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      weight: 70
    }
  };

  mockRegistrationDeskDashboard = {
    totalRegistrations: 1250,
    todayRegistrations: 25,
    pendingQueue: 8,
    completedToday: 17,
    queueStats: {
      general: 3,
      cardiology: 2,
      orthopedics: 1,
      pediatrics: 2
    }
  };

  mockLaboratoryDashboard = {
    pendingTests: 12,
    completedToday: 8,
    inProgress: 4,
    urgentTests: 3,
    equipmentStatus: [
      { name: 'CBC Analyzer', status: 'operational' },
      { name: 'Chemistry Analyzer', status: 'maintenance' },
      { name: 'Microscope', status: 'operational' }
    ]
  };

  // Medicine Dashboard Services
  async getMedicineDashboard() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.mockMedicineDashboard;
    } catch (error) {
      console.error('Failed to fetch medicine dashboard:', error);
      throw error;
    }
  }

  async updateMedicineStock(medicineId: string, quantity: number, reason: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Stock updated successfully', { medicineId, quantity, reason });
      return { success: true, message: 'Stock updated successfully' };
    } catch (error) {
      console.error('Failed to update medicine stock:', error);
      throw error;
    }
  }

  async createWarehouseOrder(medicineId: string, quantity: number, supplier: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Warehouse order created successfully', { medicineId, quantity, supplier });
      return { success: true, message: 'Warehouse order created successfully' };
    } catch (error) {
      console.error('Failed to create warehouse order:', error);
      throw error;
    }
  }

  // Doctor Dashboard Services
  async getDoctorDashboard() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.mockDoctorDashboard;
    } catch (error) {
      console.error('Failed to fetch doctor dashboard:', error);
      throw error;
    }
  }

  async createDiagnosis(patientId: string, diagnosis: string, symptoms: string[], severity: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Diagnosis created successfully', { patientId, diagnosis, symptoms, severity });
      return { success: true, message: 'Diagnosis created successfully' };
    } catch (error) {
      console.error('Failed to create diagnosis:', error);
      throw error;
    }
  }

  async createPrescription(patientId: string, medicines: any[], instructions: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Prescription created successfully', { patientId, medicines, instructions });
      return { success: true, message: 'Prescription created successfully' };
    } catch (error) {
      console.error('Failed to create prescription:', error);
      throw error;
    }
  }

  // Patient Dashboard Services
  async getPatientDashboard() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.mockPatientDashboard;
    } catch (error) {
      console.error('Failed to fetch patient dashboard:', error);
      throw error;
    }
  }

  async downloadReport(reportId: string, type: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Report downloaded successfully', { reportId, type });
      return { success: true, message: 'Report downloaded successfully' };
    } catch (error) {
      console.error('Failed to download report:', error);
      throw error;
    }
  }

  // Registration Desk Services
  async getRegistrationDeskDashboard() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.mockRegistrationDeskDashboard;
    } catch (error) {
      console.error('Failed to fetch registration desk dashboard:', error);
      throw error;
    }
  }

  async registerPatient(patientData: any) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Patient registered successfully', patientData);
      return { success: true, message: 'Patient registered successfully' };
    } catch (error) {
      console.error('Failed to register patient:', error);
      throw error;
    }
  }

  async updateQueueStatus(queueId: string, status: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Queue status updated successfully', { queueId, status });
      return { success: true, message: 'Queue status updated successfully' };
    } catch (error) {
      console.error('Failed to update queue status:', error);
      throw error;
    }
  }

  async scheduleAppointment(appointmentData: any) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Appointment scheduled successfully', appointmentData);
      return { success: true, message: 'Appointment scheduled successfully' };
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
      throw error;
    }
  }

  // Laboratory Services
  async getLaboratoryDashboard() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.mockLaboratoryDashboard;
    } catch (error) {
      console.error('Failed to fetch laboratory dashboard:', error);
      throw error;
    }
  }

  async uploadLabReport(reportId: string, file: File, description?: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Lab report uploaded successfully', { reportId, fileName: file.name, description });
      return { success: true, message: 'Lab report uploaded successfully' };
    } catch (error) {
      console.error('Failed to upload lab report:', error);
      throw error;
    }
  }

  async addLabResults(reportId: string, results: any[], status: string, notes?: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Lab results added successfully', { reportId, results, status, notes });
      return { success: true, message: 'Lab results added successfully' };
    } catch (error) {
      console.error('Failed to add lab results:', error);
      throw error;
    }
  }

  // Real-time updates
  subscribeToUpdates(dashboardType: string, callback: (data: any) => void) {
    // Mock real-time updates
    const mockData = {
      medicine: this.mockMedicineDashboard,
      doctor: this.mockDoctorDashboard,
      patient: this.mockPatientDashboard,
      'registration-desk': this.mockRegistrationDeskDashboard,
      laboratory: this.mockLaboratoryDashboard
    };
    
    // Simulate periodic updates
    const interval = setInterval(() => {
      const data = mockData[dashboardType] || {};
      callback(data);
    }, 10000); // Update every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }

  // Error handling
  handleError(error: any, context: string) {
    console.error(`Error in ${context}:`, error);
    
    // Mock error handling
    console.log('Mock error handling - no actual API call made');
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;

