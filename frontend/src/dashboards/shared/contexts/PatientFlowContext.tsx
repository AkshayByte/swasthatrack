import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the patient flow data structure
export interface PatientFlowData {
  // Registration Desk Data
  patientInfo?: {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    email?: string;
    address: string;
    emergencyContact: string;
    bloodGroup?: string;
    registrationDate: string;
    registrationNumber: string;
  };

  // Doctor Dashboard Data
  diagnosisInfo?: {
    diagnosis: string;
    symptoms: string[];
    severity: string;
    notes?: string;
    diagnosedBy: string;
    diagnosedAt: string;
    followUpRequired: boolean;
    followUpDate?: string;
  };

  // Laboratory Dashboard Data
  labTestInfo?: {
    testName: string;
    testType: string;
    orderedBy: string;
    orderedAt: string;
    status: string;
    priority: string;
    results?: Array<{
      parameter: string;
      value: string | number;
      unit: string;
      normalRange: string;
    }>;
  };

  // Pharmacy Dashboard Data
  prescriptionInfo?: {
    medicines: Array<{
      medicineId: string;
      medicineName: string;
      quantity: number;
      instructions: string;
    }>;
    instructions: string;
    prescribedBy: string;
    prescribedAt: string;
    validUntil: string;
    status: string;
  };
}

interface PatientFlowContextType {
  flowData: PatientFlowData;
  updateFlowData: (data: Partial<PatientFlowData>) => void;
  resetFlowData: () => void;
}

const PatientFlowContext = createContext<PatientFlowContextType | undefined>(undefined);

export const PatientFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flowData, setFlowData] = useState<PatientFlowData>({});

  const updateFlowData = (data: Partial<PatientFlowData>) => {
    setFlowData(prev => ({ ...prev, ...data }));
  };

  const resetFlowData = () => {
    setFlowData({});
  };

  return (
    <PatientFlowContext.Provider value={{ flowData, updateFlowData, resetFlowData }}>
      {children}
    </PatientFlowContext.Provider>
  );
};

export const usePatientFlow = () => {
  const context = useContext(PatientFlowContext);
  if (context === undefined) {
    throw new Error('usePatientFlow must be used within a PatientFlowProvider');
  }
  return context;
};