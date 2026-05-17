import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDashboardAuth } from '../contexts/DashboardAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ProtectedDashboardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  allowedRoles?: string[];
  fallbackPath?: string;
}

export function ProtectedDashboard({ 
  children, 
  requiredRole, 
  requiredPermission, 
  allowedRoles = [],
  fallbackPath = '/simple-login' 
}: ProtectedDashboardProps) {
  const { user } = useDashboardAuth();
  const location = useLocation();

  // Since we don't have isLoading, isAuthenticated, hasRole, hasPermission in our context
  // We'll implement a simple check based on whether we have a user
  const isAuthenticated = !!user;
  const isLoading = false; // We're not implementing loading state in our context

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Allow all authenticated users to access all dashboards
  // Remove role-based restrictions completely
  return <>{children}</>;
}