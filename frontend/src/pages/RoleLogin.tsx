import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Pill,
  Stethoscope,
  User,
  Users,
  Activity,
  ArrowLeft
} from 'lucide-react';

const RoleLogin = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  // Set default credentials for development/testing
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      switch (role) {
        case 'doctor':
          setCredentials({ username: 'doctor', password: 'doctor123' });
          break;
        case 'pharmacist':
          setCredentials({ username: 'pharmacist', password: 'pharmacist123' });
          break;
        case 'patient':
          setCredentials({ username: 'patient', password: 'patient123' });
          break;
        case 'registration-staff':
          setCredentials({ username: 'registration', password: 'registration123' });
          break;
        case 'lab-staff':
          setCredentials({ username: 'lab', password: 'lab123' });
          break;
        default:
          // For any other role, use a generic default
          setCredentials({ username: role || 'user', password: `${role || 'user'}123` });
          break;
      }
    }
  }, [role]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleInfo: Record<string, { title: string; description: string; icon: React.ElementType; color: string }> = {
    'pharmacist': {
      title: 'Pharmacist Login',
      description: 'Access the Medicine Dashboard',
      icon: Pill,
      color: 'bg-blue-500',
    },
    'doctor': {
      title: 'Doctor Login',
      description: 'Access the Doctor Dashboard',
      icon: Stethoscope,
      color: 'bg-green-500',
    },
    'patient': {
      title: 'Patient Login',
      description: 'Access the Patient Dashboard',
      icon: User,
      color: 'bg-purple-500',
    },
    'registration-staff': {
      title: 'Registration Staff Login',
      description: 'Access the Registration Desk Dashboard',
      icon: Users,
      color: 'bg-yellow-500',
    },
    'lab-staff': {
      title: 'Laboratory Staff Login',
      description: 'Access the Laboratory Dashboard',
      icon: Activity,
      color: 'bg-red-500',
    },
  };

  const currentRole = roleInfo[role || ''] || roleInfo['patient'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      // In a real app, you would validate credentials here
      // For demo purposes, let's make sure default credentials always work in development
      let isSuccess = false;

      if (import.meta.env.DEV) {
        // In development, default credentials should always work
        switch (role) {
          case 'doctor':
            isSuccess = credentials.username === 'doctor' && credentials.password === 'doctor123';
            break;
          case 'pharmacist':
            isSuccess = credentials.username === 'pharmacist' && credentials.password === 'pharmacist123';
            break;
          case 'patient':
            isSuccess = credentials.username === 'patient' && credentials.password === 'patient123';
            break;
          case 'registration-staff':
            isSuccess = credentials.username === 'registration' && credentials.password === 'registration123';
            break;
          case 'lab-staff':
            isSuccess = credentials.username === 'lab' && credentials.password === 'lab123';
            break;
          default:
            // For any other role, check if username matches the role and password follows the pattern
            isSuccess = credentials.username === (role || 'user') && credentials.password === `${role || 'user'}123`;
            break;
        }
      } else {
        // In production, simulate random success/failure
        isSuccess = Math.random() > 0.5;
      }

      if (isSuccess) {
        // Store the selected role in localStorage for development mode
        if (import.meta.env.DEV) {
          localStorage.setItem('dev_selected_role', role || 'patient');
        }

        // Navigate directly to primary task page based on role
        const roleRedirects: Record<string, string> = {
          'doctor': '/dashboard/doctor/patient-queue',
          'patient': '/dashboard/patient/records',
          'pharmacist': '/dashboard/pharmacist/pending',
          'lab-staff': '/dashboard/laboratory/pending',
          'registration-staff': '/dashboard/registration/register',
        };

        const redirectPath = roleRedirects[role || ''] || '/dashboard';
        navigate(redirectPath);
      } else {
        // Show error message
        setError('Invalid username or password. Please try again.');
      }
    }, 1000);
  };

  const IconComponent = currentRole.icon;

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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`${currentRole.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{currentRole.title}</CardTitle>
          <CardDescription>{currentRole.description}</CardDescription>
          {import.meta.env.DEV && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Development mode: Default credentials are pre-filled</p>
              <p>Username: {credentials.username || 'Enter username'}</p>
              <p>Password: {credentials.password ? '•'.repeat(credentials.password.length) : 'Enter password'}</p>
              <p className="mt-1 text-xs">Note: These default credentials will always work in development mode</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            variant="link"
            className="mt-4"
            onClick={() => navigate('/select-dashboard')}
          >
            Select a different dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoleLogin;