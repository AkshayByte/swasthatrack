import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      navigate('/login', { state: { from: location } });
      return;
    }

    // Check if role-based access control is needed
    if (allowedRoles && user) {
      // Get role from localStorage as backup
      const storedRole = localStorage.getItem('role');
      const currentUserRole = (user.role || storedRole)?.toLowerCase();
      const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

      // If user role is not in allowed roles, redirect to unauthorized
      if (currentUserRole && !normalizedAllowedRoles.includes(currentUserRole)) {
        navigate('/unauthorized');
      }
    }
  }, [isAuthenticated, user, allowedRoles, navigate, location]);

  // If authentication check is still running, show nothing
  if (!isAuthenticated) {
    return null;
  }

  // If role check is needed and fails, show nothing (navigation will redirect)
  if (allowedRoles && user) {
    const storedRole = localStorage.getItem('role');
    const currentUserRole = (user.role || storedRole)?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    if (currentUserRole && !normalizedAllowedRoles.includes(currentUserRole)) {
      return null;
    }
  }

  return <>{children}</>;
}