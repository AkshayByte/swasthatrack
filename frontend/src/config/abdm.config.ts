// ABDM M1 Integration Configuration
// Environment-based configuration for ABDM API endpoints and credentials

export interface ABDMConfig {
  baseUrls: {
    session: string;
    abha: string;
    phrWeb: string;
  };
  headers: {
    'X-CM-ID': string;
    'Content-Type': string;
  };
  clientCredentials: {
    clientId: string;
    clientSecret: string;
  };
  developmentMode: boolean;
}

// ABDM API Configuration
export const abdmConfig: ABDMConfig = {
  baseUrls: {
    session: import.meta.env.VITE_ABDM_BASE_URL_SESSION || 'https://dev.abdm.gov.in/api',
    abha: import.meta.env.VITE_ABDM_BASE_URL_ABHA || 'https://abhasbx.abdm.gov.in/abha/api',
    phrWeb: import.meta.env.VITE_ABDM_BASE_URL_PHR_WEB || 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/web'
  },
  headers: {
    'X-CM-ID': import.meta.env.VITE_ABDM_X_CM_ID || 'sbx',
    'Content-Type': 'application/json'
  },
  clientCredentials: {
    clientId: import.meta.env.VITE_ABDM_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_ABDM_CLIENT_SECRET || ''
  },
  developmentMode: import.meta.env.VITE_DEVELOPMENT_MODE === 'true'
};

// Utility Functions
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// ABDM API Response Interfaces
export interface ABDMResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface SessionResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
}

// M1 ABHA Creation Interfaces
export interface AadhaarOTPRequest {
  aadhaarNumber: string;
}

export interface AadhaarOTPResponse {
  txnId: string;
  message: string;
}

export interface ABHACreationRequest {
  txnId: string;
  otp: string;
  mobile: string;
}

export interface ABHACreationResponse {
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  profilePhoto?: string;
  authData: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface DemoAuthRequest {
  aadhaarNumber: string;
  name: string;
  dob: string; // YYYY-MM-DD format
  gender: 'M' | 'F' | 'O';
  mobile: string;
  stateCode: string;
  districtCode: string;
}

// M1 ABHA Verification Interfaces
export interface ABHAVerificationRequest {
  abhaNumber: string;
  method: 'aadhaar' | 'mobile';
}

export interface ABHAVerificationOTPResponse {
  txnId: string;
  message: string;
  maskedMobile?: string;
}

export interface ABHAOTPVerificationRequest {
  txnId: string;
  otp: string;
}

export interface ABHAProfileResponse {
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  email?: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  profilePhoto?: string;
  authData: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface ABHASearchRequest {
  mobileNumber: string;
}

export interface ABHASearchResponse {
  accounts: Array<{
    abhaNumber: string;
    abhaAddress: string;
    name: string;
  }>;
}

// Error Code Mappings
export const ABDM_ERROR_CODES: Record<string, string> = {
  'ABDM-1001': 'No data found',
  'ABDM-1013': 'Invalid ABHA Number',
  'ABDM-1014': 'Invalid Mobile/Email',
  'ABDM-1015': 'Invalid Response',
  'ABDM-1016': 'Invalid TimeStamp',
  'ABDM-1100': 'Too many OTP attempts. Please try again in 30 minutes.',
  'ABDM-1101': 'This ABHA Address already exists. Please create with unique ABHA Address',
  'ABDM-1102': 'Invalid OTP',
  'ABDM-1103': 'OTP Expired',
  'ABDM-1104': 'Invalid Transaction ID',
  'ABDM-1105': 'Aadhaar Number not found',
  'ABDM-1106': 'Mobile number not linked with Aadhaar',
  'ABDM-1107': 'Invalid consent',
  'ABDM-1108': 'ABHA creation failed',
  'ABDM-1109': 'Invalid demographic details'
};

// Development Mode Mock Data
export const MOCK_RESPONSES = {
  sessionToken: {
    accessToken: 'mock-session-token-' + Date.now(),
    expiresIn: 1800,
    refreshToken: 'mock-refresh-token',
    tokenType: 'Bearer'
  },
  aadhaarOTP: {
    txnId: 'mock-txn-id-' + Date.now(),
    message: 'OTP sent to registered mobile number'
  },
  abhaCreation: {
    abhaNumber: '14-1234-5678-9012',
    abhaAddress: 'user@abdm',
    name: 'Test User',
    profilePhoto: undefined,
    authData: {
      accessToken: 'mock-user-access-token',
      refreshToken: 'mock-user-refresh-token',
      expiresIn: 1800
    }
  },
  abhaVerification: {
    txnId: 'mock-verification-txn-' + Date.now(),
    message: 'OTP sent successfully',
    maskedMobile: 'XXXXXX1234'
  },
  abhaProfile: {
    abhaNumber: '14-1234-5678-9012',
    abhaAddress: 'verified@abdm',
    name: 'Test User',
    email: 'testuser@example.com',
    mobile: '9876543210',
    dateOfBirth: '1990-01-01',
    gender: 'M',
    address: 'Test Address, Test City',
    profilePhoto: undefined,
    authData: {
      accessToken: 'mock-verified-access-token',
      refreshToken: 'mock-verified-refresh-token',
      expiresIn: 1800
    }
  },
  abhaSearch: {
    accounts: [
      {
        abhaNumber: '14-1234-5678-9012',
        abhaAddress: 'user1@abdm',
        name: 'Test User 1'
      },
      {
        abhaNumber: '14-1234-5678-9013',
        abhaAddress: 'user2@abdm',
        name: 'Test User 2'
      }
    ]
  }
};

// Validation Utilities
export const validateAadhaarNumber = (aadhaar: string): boolean => {
  return /^\d{12}$/.test(aadhaar);
};

export const validateABHANumber = (abha: string): boolean => {
  return /^\d{2}-\d{4}-\d{4}-\d{4}$/.test(abha);
};

export const validateMobileNumber = (mobile: string): boolean => {
  return /^\d{10}$/.test(mobile);
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const formatABHANumber = (abha: string): string => {
  // Remove any existing formatting
  const cleanAbha = abha.replace(/\D/g, '');
  
  // Format as XX-XXXX-XXXX-XXXX
  if (cleanAbha.length === 14) {
    return `${cleanAbha.slice(0, 2)}-${cleanAbha.slice(2, 6)}-${cleanAbha.slice(6, 10)}-${cleanAbha.slice(10, 14)}`;
  }
  
  return abha;
};

export default abdmConfig;