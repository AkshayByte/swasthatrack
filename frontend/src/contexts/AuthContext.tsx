import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext.context';
import { AuthContextType, ABDMUser, ABDMAuthResponse, ABDMLoginRequest, ABDMRegistrationRequest, OTPRequest, OTPResponse, mockUser, mockAuthResponse, M1ABHACreationRequest, M1ABHAVerificationRequest, M1ABHASearchRequest, M1DemoAuthRequest } from './AuthContext.types';
import { abhaCreationService, abhaVerificationService } from '../services/abdm';
import { handleABDMError } from '../utils';

// Development mode flag - set to true when backend is not ready
// This is a comment change to trigger Fast Refresh
const DEVELOPMENT_MODE = true;

// AuthProvider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ABDMUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if token is expired
  const isTokenExpired = (): boolean => {
    if (!tokenExpiry) return true;
    return Date.now() > tokenExpiry;
  };

  // Refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (DEVELOPMENT_MODE) {
        // Mock refresh in development
        setTokenExpiry(Date.now() + (1200 * 1000));
        setIsAuthenticated(true);
        localStorage.setItem('tokenExpiry', (Date.now() + (1200 * 1000)).toString());
        return true;
      }

      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) return false;

      const response = await fetch('/api/abdm/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      setAccessToken(data.accessToken);
      setTokenExpiry(Date.now() + (data.expiresIn * 1000));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpiry', (Date.now() + (data.expiresIn * 1000)).toString());
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        
        if (DEVELOPMENT_MODE) {
          // In development mode, use mock data
          console.log('Loading user in development mode');
          setUser(mockUser);
          setAccessToken(mockAuthResponse.accessToken);
          setTokenExpiry(Date.now() + (mockAuthResponse.expiresIn * 1000));
          setIsAuthenticated(true);
          setIsLoading(false);
          console.log('User loaded successfully in development mode');
          return;
        }

        const storedToken = localStorage.getItem('accessToken');
        const storedExpiry = localStorage.getItem('tokenExpiry');
        const storedUserData = localStorage.getItem('userData');

        if (storedToken && storedExpiry && storedUserData) {
          const expiryTime = parseInt(storedExpiry, 10);
          
          if (Date.now() < expiryTime) {
            // Token is still valid
            setAccessToken(storedToken);
            setTokenExpiry(expiryTime);
            setUser(JSON.parse(storedUserData));
            setIsAuthenticated(true);
          } else {
            // Token expired, try to refresh
            const refreshed = await refreshToken();
            if (refreshed) {
              const userData = localStorage.getItem('userData');
              if (userData) {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // ABDM Login methods
  const initiateLogin = async (request: ABDMLoginRequest): Promise<{ success: boolean; message: string; requestId?: string; maskedMobile?: string }> => {
    try {
      if (DEVELOPMENT_MODE) {
        // Mock OTP initiation in development
        return {
          success: true,
          message: 'OTP sent successfully',
          requestId: 'mock-request-id',
          maskedMobile: 'XXXXXX1234'
        };
      }

      const response = await fetch('/api/abdm/auth/login/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to initiate login' };
      }

      return {
        success: true,
        message: data.message,
        requestId: data.requestId,
        maskedMobile: data.maskedMobile
      };
    } catch (error) {
      console.error('Login initiation error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const verifyOTP = async (requestId: string, otp: string): Promise<{ success: boolean; message: string; authData?: ABDMAuthResponse }> => {
    try {
      if (DEVELOPMENT_MODE) {
        // Mock OTP verification in development
        setUser(mockUser);
        setAccessToken(mockAuthResponse.accessToken);
        setTokenExpiry(Date.now() + (mockAuthResponse.expiresIn * 1000));
        setIsAuthenticated(true);
        
        localStorage.setItem('accessToken', mockAuthResponse.accessToken);
        localStorage.setItem('refreshToken', mockAuthResponse.refreshToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        localStorage.setItem('tokenExpiry', (Date.now() + (mockAuthResponse.expiresIn * 1000)).toString());
        
        return {
          success: true,
          message: 'Login successful',
          authData: mockAuthResponse
        };
      }

      const response = await fetch('/api/abdm/auth/login/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'OTP verification failed' };
      }

      setUser(data.user);
      setAccessToken(data.accessToken);
      setTokenExpiry(Date.now() + (data.expiresIn * 1000));
      setIsAuthenticated(true);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('tokenExpiry', (Date.now() + (data.expiresIn * 1000)).toString());
      
      return {
        success: true,
        message: 'Login successful',
        authData: data
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const loginWithPassword = async (abhaNumber: string, password: string): Promise<{ success: boolean; message: string; authData?: ABDMAuthResponse }> => {
    try {
      if (DEVELOPMENT_MODE) {
        // Mock password login in development
        setUser(mockUser);
        setAccessToken(mockAuthResponse.accessToken);
        setTokenExpiry(Date.now() + (mockAuthResponse.expiresIn * 1000));
        setIsAuthenticated(true);
        
        localStorage.setItem('accessToken', mockAuthResponse.accessToken);
        localStorage.setItem('refreshToken', mockAuthResponse.refreshToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        localStorage.setItem('tokenExpiry', (Date.now() + (mockAuthResponse.expiresIn * 1000)).toString());
        
        return {
          success: true,
          message: 'Login successful',
          authData: mockAuthResponse
        };
      }

      const response = await fetch('/api/abdm/auth/login/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ abhaNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Password login failed' };
      }

      setUser(data.user);
      setAccessToken(data.accessToken);
      setTokenExpiry(Date.now() + (data.expiresIn * 1000));
      setIsAuthenticated(true);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('tokenExpiry', (Date.now() + (data.expiresIn * 1000)).toString());
      
      return {
        success: true,
        message: 'Login successful',
        authData: data
      };
    } catch (error) {
      console.error('Password login error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  // ABDM Registration methods
  const initiateABHACreation = async (aadhaarNumber: string, consent: boolean): Promise<{ success: boolean; message: string; requestId?: string; abhaAddresses?: string[] }> => {
    try {
      if (DEVELOPMENT_MODE) {
        // Mock ABHA creation initiation in development
        return {
          success: true,
          message: 'ABHA creation initiated',
          requestId: 'mock-request-id',
          abhaAddresses: ['john.doe@abdm', 'johndoe@abdm', 'john.d@abdm']
        };
      }

      const response = await fetch('/api/abdm/registration/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aadhaarNumber, consent }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to initiate ABHA creation' };
      }

      return {
        success: true,
        message: data.message,
        requestId: data.requestId,
        abhaAddresses: data.abhaAddresses
      };
    } catch (error) {
      console.error('ABHA creation initiation error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const verifyAadhaarOTP = async (requestId: string, otp: string): Promise<{ success: boolean; message: string; abhaData?: any }> => {
    try {
      if (DEVELOPMENT_MODE) {
        // Mock Aadhaar OTP verification in development
        return {
          success: true,
          message: 'Aadhaar OTP verified',
          abhaData: {
            requestId: 'mock-request-id',
            abhaAddresses: ['john.doe@abdm', 'johndoe@abdm', 'john.d@abdm']
          }
        };
      }

      const response = await fetch('/api/abdm/registration/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Aadhaar OTP verification failed' };
      }

      return {
        success: true,
        message: data.message,
        abhaData: data
      };
    } catch (error) {
      console.error('Aadhaar OTP verification error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const selectABHAAddress = async (requestId: string, abhaAddress: string): Promise<{ success: boolean; message: string; authData?: ABDMAuthResponse }> => {
    try {
      if (DEVELOPMENT_MODE) {
        // Mock ABHA address selection in development
        const customUser = { ...mockUser, abhaAddress };
        const customAuthResponse = { ...mockAuthResponse, user: customUser };
        
        console.log('Setting authentication state in development mode');
        console.log('Before state update:', { isAuthenticated: false, user: null });
        
        // Update state synchronously to avoid race conditions
        setUser(customUser);
        setAccessToken(customAuthResponse.accessToken);
        setTokenExpiry(Date.now() + (customAuthResponse.expiresIn * 1000));
        setIsAuthenticated(true);
        
        localStorage.setItem('accessToken', customAuthResponse.accessToken);
        localStorage.setItem('refreshToken', customAuthResponse.refreshToken);
        localStorage.setItem('userData', JSON.stringify(customUser));
        localStorage.setItem('tokenExpiry', (Date.now() + (customAuthResponse.expiresIn * 1000)).toString());
        
        console.log('Authentication state set successfully');
        console.log('After state update:', { isAuthenticated: true, user: customUser });
        
        return {
          success: true,
          message: 'ABHA address selected successfully',
          authData: customAuthResponse
        };
      }

      const response = await fetch('/api/abdm/registration/select-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, abhaAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'ABHA address selection failed' };
      }

      setUser(data.user);
      setAccessToken(data.accessToken);
      setTokenExpiry(Date.now() + (data.expiresIn * 1000));
      setIsAuthenticated(true);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('tokenExpiry', (Date.now() + (data.expiresIn * 1000)).toString());
      
      return {
        success: true,
        message: 'ABHA address selected successfully',
        authData: data
      };
    } catch (error) {
      console.error('ABHA address selection error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  // M1 ABDM Integration Methods
  const m1CreateABHAByAadhaar = async (request: M1ABHACreationRequest): Promise<{ success: boolean; message: string; txnId?: string; abhaData?: any }> => {
    try {
      // Step 1: Generate Aadhaar OTP
      const otpResponse = await abhaCreationService.generateAadhaarOTP({
        aadhaarNumber: request.aadhaarNumber
      });
      
      // Step 2: Create ABHA with OTP (mock completion for demonstration)
      const abhaResponse = await abhaCreationService.createABHAByAadhaar({
        txnId: otpResponse.txnId,
        otp: '123456', // In real implementation, this would come from user input
        mobile: request.mobile
      });
      
      return {
        success: true,
        message: 'ABHA creation process initiated successfully',
        txnId: otpResponse.txnId,
        abhaData: abhaResponse
      };
    } catch (error: any) {
      const errorResponse = handleABDMError(error);
      return {
        success: false,
        message: errorResponse.userMessage
      };
    }
  };

  const m1CreateABHAByDemoAuth = async (request: M1DemoAuthRequest): Promise<{ success: boolean; message: string; abhaData?: any }> => {
    try {
      const response = await abhaCreationService.createABHAByDemoAuth(request);
      
      return {
        success: true,
        message: 'ABHA created successfully via Demo Auth',
        abhaData: response
      };
    } catch (error: any) {
      const errorResponse = handleABDMError(error);
      return {
        success: false,
        message: errorResponse.userMessage
      };
    }
  };

  const m1VerifyABHAByOTP = async (abhaNumber: string, method: 'aadhaar' | 'mobile'): Promise<{ success: boolean; message: string; txnId?: string }> => {
    try {
      const response = await abhaVerificationService.requestVerificationOTP({
        abhaNumber,
        method
      });
      
      return {
        success: true,
        message: response.message,
        txnId: response.txnId
      };
    } catch (error: any) {
      const errorResponse = handleABDMError(error);
      return {
        success: false,
        message: errorResponse.userMessage
      };
    }
  };

  const m1CompleteABHAVerification = async (txnId: string, otp: string): Promise<{ success: boolean; message: string; profileData?: any }> => {
    try {
      const response = await abhaVerificationService.verifyOTPAndGetProfile({
        txnId,
        otp
      });
      
      return {
        success: true,
        message: 'ABHA verified successfully',
        profileData: response
      };
    } catch (error: any) {
      const errorResponse = handleABDMError(error);
      return {
        success: false,
        message: errorResponse.userMessage
      };
    }
  };

  const m1SearchABHAByMobile = async (mobileNumber: string): Promise<{ success: boolean; message: string; accounts?: any[] }> => {
    try {
      const response = await abhaVerificationService.findABHAByMobile({
        mobileNumber
      });
      
      return {
        success: true,
        message: `Found ${response.accounts?.length || 0} ABHA account(s)`,
        accounts: response.accounts
      };
    } catch (error: any) {
      const errorResponse = handleABDMError(error);
      return {
        success: false,
        message: errorResponse.userMessage
      };
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setTokenExpiry(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiry');
  };
  
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    tokenExpiry,
    initiateLogin,
    verifyOTP,
    loginWithPassword,
    initiateABHACreation,
    verifyAadhaarOTP,
    selectABHAAddress,
    m1CreateABHAByAadhaar,
    m1CreateABHAByDemoAuth,
    m1VerifyABHAByOTP,
    m1CompleteABHAVerification,
    m1SearchABHAByMobile,
    logout,
    refreshToken,
    isTokenExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
