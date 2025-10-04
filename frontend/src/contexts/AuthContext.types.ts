import React from 'react';

// ABDM User Interface
export interface ABDMUser {
  id: string;
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  profilePhoto?: string;
  role: string;
  facility: string;
  isVerified: boolean;
}

// ABDM Authentication Response
export interface ABDMAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 1200 seconds
  tokenType: string;
  user: ABDMUser;
}

// ABDM Login Request
export interface ABDMLoginRequest {
  abhaNumber?: string;
  abhaAddress?: string;
  verificationMethod: 'aadhaar_otp' | 'mobile_otp' | 'password';
  otp?: string;
  password?: string;
}

// ABDM Registration Request
export interface ABDMRegistrationRequest {
  aadhaarNumber: string;
  consent: boolean;
  abhaAddress?: string;
  customAbhaAddress?: string;
}

// OTP Request/Response
export interface OTPRequest {
  abhaNumber?: string;
  abhaAddress?: string;
  verificationMethod: 'aadhaar_otp' | 'mobile_otp';
}

export interface OTPResponse {
  requestId: string;
  maskedMobile: string;
  maskedAadhaar: string;
  message: string;
}

// M1 ABDM Integration Interfaces
export interface M1ABHACreationRequest {
  aadhaarNumber: string;
  mobile: string;
  consent: boolean;
}

export interface M1ABHAVerificationRequest {
  abhaNumber: string;
  method: 'aadhaar' | 'mobile';
}

export interface M1ABHASearchRequest {
  mobileNumber: string;
}

export interface M1DemoAuthRequest {
  aadhaarNumber: string;
  name: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  mobile: string;
  stateCode: string;
  districtCode: string;
}

export interface AuthContextType {
  user: ABDMUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  tokenExpiry: number | null;
  
  // ABDM Login methods
  initiateLogin: (request: ABDMLoginRequest) => Promise<{ success: boolean; message: string; requestId?: string; maskedMobile?: string }>;
  verifyOTP: (requestId: string, otp: string) => Promise<{ success: boolean; message: string; authData?: ABDMAuthResponse }>;
  loginWithPassword: (abhaNumber: string, password: string) => Promise<{ success: boolean; message: string; authData?: ABDMAuthResponse }>;
  
  // ABDM Registration methods
  initiateABHACreation: (aadhaarNumber: string, consent: boolean) => Promise<{ success: boolean; message: string; requestId?: string; abhaAddresses?: string[] }>;
  verifyAadhaarOTP: (requestId: string, otp: string) => Promise<{ success: boolean; message: string; abhaData?: any }>;
  selectABHAAddress: (requestId: string, abhaAddress: string) => Promise<{ success: boolean; message: string; authData?: ABDMAuthResponse }>;
  
  // M1 ABDM Integration methods
  m1CreateABHAByAadhaar: (request: M1ABHACreationRequest) => Promise<{ success: boolean; message: string; txnId?: string; abhaData?: any }>;
  m1CreateABHAByDemoAuth: (request: M1DemoAuthRequest) => Promise<{ success: boolean; message: string; abhaData?: any }>;
  m1VerifyABHAByOTP: (abhaNumber: string, method: 'aadhaar' | 'mobile') => Promise<{ success: boolean; message: string; txnId?: string }>;
  m1CompleteABHAVerification: (txnId: string, otp: string) => Promise<{ success: boolean; message: string; profileData?: any }>;
  m1SearchABHAByMobile: (mobileNumber: string) => Promise<{ success: boolean; message: string; accounts?: any[] }>;
  
  // Utility methods
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isTokenExpired: () => boolean;
}

// Mock data for development
export const mockUser: ABDMUser = {
  id: '1',
  abhaNumber: '14-1234-5678-9012',
  abhaAddress: 'testuser@abdm',
  name: 'Test User',
  email: 'testuser@example.com',
  mobile: '+91 98765 43210',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  address: 'Test Address, Test City, Test State - 123456',
  profilePhoto: undefined,
  role: 'Patient',
  facility: 'Test Facility',
  isVerified: true,
};

export const mockAuthResponse: ABDMAuthResponse = {
  accessToken: 'mock-access-token-12345',
  refreshToken: 'mock-refresh-token-67890',
  expiresIn: 1200,
  tokenType: 'Bearer',
  user: mockUser,
};