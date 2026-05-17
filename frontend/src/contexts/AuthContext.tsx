import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext.context';
import { AuthContextType, User, AuthResponse, ABDMUser, ABDMAuthResponse, ABDMLoginRequest, ABDMRegistrationRequest, OTPRequest, OTPResponse, mockUser, mockAuthResponse, M1ABHACreationRequest, M1ABHAVerificationRequest, M1ABHASearchRequest, M1DemoAuthRequest } from './AuthContext.types';

// Development mode flag - set to true when backend is not ready
// This is a comment change to trigger Fast Refresh
const DEVELOPMENT_MODE = true;

// AuthProvider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);

        // Check if we have token and user data in localStorage
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');

        if (storedToken && storedRole && storedUserId && storedUserName) {
          setToken(storedToken);
          setUser({
            id: storedUserId,
            name: storedUserName,
            email: `${storedRole}@swastha.com`, // Mock email based on role
            role: storedRole
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // New login method for our system (mock data only)
  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt with:', { email, password });

      // Import mock users from centralized data
      const { MOCK_USERS } = await import('@/data/mockData');

      // Find user in mock data
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);

      console.log('Found user:', user);

      if (user) {
        // Create mock token
        const mockToken = `mock-token-${user.id}-${Date.now()}`;

        setToken(mockToken);
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
        setIsAuthenticated(true);

        // Store in localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('role', user.role);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);

        console.log('Login successful for user:', user);
        return { success: true, message: 'Login successful' };
      } else {
        console.log('Login failed - invalid credentials');
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };

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
        // Convert ABDMUser to User type
        const convertedUser: User = {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        };
        setUser(convertedUser);
        setToken(mockAuthResponse.accessToken);
        setIsAuthenticated(true);

        localStorage.setItem('token', mockAuthResponse.accessToken);
        localStorage.setItem('refreshToken', mockAuthResponse.refreshToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        // Add missing fields required by loadUser
        localStorage.setItem('role', mockUser.role);
        localStorage.setItem('userId', mockUser.id);
        localStorage.setItem('userName', mockUser.name);

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

      // Convert ABDMUser to User type
      const convertedUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };
      setUser(convertedUser);
      setToken(data.accessToken);
      setIsAuthenticated(true);

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(data.user));

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
        // Convert ABDMUser to User type
        const convertedUser: User = {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        };
        setUser(convertedUser);
        setToken(mockAuthResponse.accessToken);
        setIsAuthenticated(true);

        localStorage.setItem('token', mockAuthResponse.accessToken);
        localStorage.setItem('refreshToken', mockAuthResponse.refreshToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));

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

      // Convert ABDMUser to User type
      const convertedUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };
      setUser(convertedUser);
      setToken(data.accessToken);
      setIsAuthenticated(true);

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(data.user));

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

        // Convert ABDMUser to User type
        const convertedUser: User = {
          id: customUser.id,
          name: customUser.name,
          email: customUser.email,
          role: customUser.role
        };
        setUser(convertedUser);
        setToken(customAuthResponse.accessToken);
        setIsAuthenticated(true);

        localStorage.setItem('token', customAuthResponse.accessToken);
        localStorage.setItem('refreshToken', customAuthResponse.refreshToken);
        localStorage.setItem('userData', JSON.stringify(customUser));

        console.log('Authentication state set successfully');
        console.log('After state update:', { isAuthenticated: true, user: convertedUser });

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

      // Convert ABDMUser to User type
      const convertedUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };
      setUser(convertedUser);
      setToken(data.accessToken);
      setIsAuthenticated(true);

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(data.user));

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
    return {
      success: false,
      message: 'ABDM integration has been removed'
    };
  };

  const m1CreateABHAByDemoAuth = async (request: M1DemoAuthRequest): Promise<{ success: boolean; message: string; abhaData?: any }> => {
    return {
      success: false,
      message: 'ABDM integration has been removed'
    };
  };

  const m1VerifyABHAByOTP = async (abhaNumber: string, method: 'aadhaar' | 'mobile'): Promise<{ success: boolean; message: string; txnId?: string }> => {
    return {
      success: false,
      message: 'ABDM integration has been removed'
    };
  };

  const m1CompleteABHAVerification = async (txnId: string, otp: string): Promise<{ success: boolean; message: string; profileData?: any }> => {
    return {
      success: false,
      message: 'ABDM integration has been removed'
    };
  };

  const m1SearchABHAByMobile = async (mobileNumber: string): Promise<{ success: boolean; message: string; accounts?: any[] }> => {
    return {
      success: false,
      message: 'ABDM integration has been removed'
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login: login as (email: string, password: string) => Promise<{ success: boolean; message: string }>,
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
    refreshToken: async () => false,
    isTokenExpired: () => false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;