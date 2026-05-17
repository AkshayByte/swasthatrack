import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';
import { useRoleHome } from '@/hooks/useRoleHome';

export default function Unauthorized() {
  const navigate = useNavigate();
  const roleHome = useRoleHome();

  const handleGoToDashboard = () => {
    navigate(roleHome);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-lg text-gray-600">
            You are not authorized to view this page.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="mt-8">
          <Button onClick={handleGoToDashboard} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}