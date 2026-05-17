import { useAuth } from '@/contexts/AuthContext';

export const useRoleHome = () => {
    const { user } = useAuth();
    // Normalize role to lowercase to match keys
    const normalizedRole = user?.role?.toLowerCase();

    const rolePaths: Record<string, string> = {
        'doctor': '/dashboard/doctor/patient-queue',
        'patient': '/dashboard/patient/records',
        'pharmacist': '/dashboard/pharmacist/pending',
        'lab-staff': '/dashboard/laboratory/pending',
        'registration-staff': '/dashboard/registration/register',
        'admin': '/dashboard',
    };

    // Default to unified dashboard if role not found or is admin
    return rolePaths[normalizedRole || ''] || '/dashboard';
};
