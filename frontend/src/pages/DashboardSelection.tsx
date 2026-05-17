import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pill,
  Stethoscope,
  User,
  Users,
  Activity,
  ArrowLeft
} from 'lucide-react';

const DashboardSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const dashboardOptions = [
    {
      id: 'pharmacist',
      title: 'Medicine Dashboard',
      description: 'Manage medicines, inventory, and pharmaceutical supplies',
      icon: Pill,
      color: 'bg-blue-500',
    },
    {
      id: 'doctor',
      title: 'Doctor Dashboard',
      description: 'Access patient records, diagnoses, and prescriptions',
      icon: Stethoscope,
      color: 'bg-green-500',
    },
    {
      id: 'patient',
      title: 'Patient Dashboard',
      description: 'View your health records, prescriptions, and appointments',
      icon: User,
      color: 'bg-purple-500',
    },
    {
      id: 'registration_staff',
      title: 'Registration Desk',
      description: 'Manage patient registrations, appointments, and queues',
      icon: Users,
      color: 'bg-yellow-500',
    },
    {
      id: 'lab_staff',
      title: 'Laboratory Dashboard',
      description: 'Handle lab tests, reports, and results',
      icon: Activity,
      color: 'bg-red-500',
    },
  ];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    // Redirect to role-specific login page
    navigate(`/login/${role.replace('_', '-')}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      <div className="fixed top-6 left-6 z-[100]">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 shadow-sm hover:shadow-md hover:bg-white/90 dark:hover:bg-slate-900/90 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Select Your Dashboard</h1>
          <p className="text-lg text-gray-600">
            Choose the dashboard that matches your role in the healthcare system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedRole === option.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                onClick={() => handleRoleSelect(option.id)}
              >
                <CardHeader>
                  <div className={`${option.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant={selectedRole === option.id ? "default" : "outline"}
                  >
                    {selectedRole === option.id ? "Selected" : "Select Dashboard"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedRole && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              You've selected the {dashboardOptions.find(opt => opt.id === selectedRole)?.title}
            </p>
            <Button
              onClick={() => navigate(`/login/${selectedRole.replace('_', '-')}`)}
              size="lg"
            >
              Proceed to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSelection;