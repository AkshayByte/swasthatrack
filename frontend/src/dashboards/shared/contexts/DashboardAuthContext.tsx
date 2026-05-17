import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PatientFlowProvider } from './PatientFlowContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardAuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | undefined>(undefined);

export const DashboardAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { user: mainUser, isAuthenticated } = useAuth();

  // Sync with main auth context
  useEffect(() => {
    if (isAuthenticated && mainUser) {
      setUser({
        id: mainUser.id.toString(),
        name: mainUser.name,
        email: mainUser.email,
        role: mainUser.role
      });
    } else {
      setUser(null);
    }
  }, [mainUser, isAuthenticated]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <DashboardAuthContext.Provider value={{ user, login, logout }}>
      <PatientFlowProvider>
        {children}
      </PatientFlowProvider>
    </DashboardAuthContext.Provider>
  );
};

export const useDashboardAuth = () => {
  const context = useContext(DashboardAuthContext);
  if (context === undefined) {
    throw new Error('useDashboardAuth must be used within a DashboardAuthProvider');
  }
  return context;
};