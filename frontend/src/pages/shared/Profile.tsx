import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoleHome } from '@/hooks/useRoleHome';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Bell,
    Lock,
    Camera,
    Save,
    ArrowLeft
} from 'lucide-react';

// Role-specific data mapping
const getRoleSpecificData = (role: string, name: string) => {
    const roleData: Record<string, any> = {
        doctor: {
            department: 'Cardiology',
            specialization: 'Interventional Cardiology',
            licenseNumber: 'MED-LIC-2024-12345'
        },
        pharmacist: {
            department: 'Pharmacy',
            specialization: 'Clinical Pharmacy',
            licenseNumber: 'PHAR-LIC-2024-67890'
        },
        registration: {
            department: 'Registration Desk',
            specialization: 'Patient Registration',
            licenseNumber: 'REG-STAFF-2024-11111'
        },
        lab: {
            department: 'Laboratory',
            specialization: 'Clinical Laboratory',
            licenseNumber: 'LAB-LIC-2024-22222'
        },
        patient: {
            department: 'N/A',
            specialization: 'N/A',
            licenseNumber: 'N/A'
        }
    };
    return roleData[role] || roleData.patient;
};

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const roleHome = useRoleHome();
    const [isEditing, setIsEditing] = useState(false);

    // Initialize user data from auth context
    const roleSpecific = getRoleSpecificData(user?.role || 'patient', user?.name || '');
    const [userData, setUserData] = useState({
        name: user?.name || 'User',
        email: user?.email || 'user@swasthatrack.com',
        phone: '+91 98765 43210',
        role: user?.role || 'patient',
        department: roleSpecific.department,
        employeeId: `EMP-2024-${user?.id || '001'}`,
        joinDate: '2024-01-15',
        address: '123 Medical Street, Healthcare City, HC 12345',
        specialization: roleSpecific.specialization,
        licenseNumber: roleSpecific.licenseNumber
    });

    // Update userData when user changes
    useEffect(() => {
        if (user) {
            const roleSpecific = getRoleSpecificData(user.role, user.name);
            setUserData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                role: user.role,
                department: roleSpecific.department,
                employeeId: `EMP-2024-${user.id}`,
                specialization: roleSpecific.specialization,
                licenseNumber: roleSpecific.licenseNumber
            }));
        }
    }, [user]);

    const handleSave = () => {
        // In real app, this would save to backend
        setIsEditing(false);
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            doctor: 'bg-blue-500',
            patient: 'bg-green-500',
            pharmacist: 'bg-purple-500',
            lab: 'bg-orange-500',
            registration: 'bg-pink-500',
            admin: 'bg-red-500'
        };
        return colors[role] || 'bg-gray-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(roleHome)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src="/placeholder-avatar.jpg" />
                                <AvatarFallback className={`text-2xl ${getRoleColor(userData.role)} text-white`}>
                                    {userData.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                className="absolute bottom-0 right-0 rounded-full"
                                variant="secondary"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold text-lg">{userData.name}</h3>
                            <Badge variant="outline" className="capitalize">
                                {userData.role}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                                {userData.department}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>
                                    View and update your personal information
                                </CardDescription>
                            </div>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="space-x-2">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="personal" className="space-y-4">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="professional">Professional</TabsTrigger>
                                <TabsTrigger value="security">Security</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                value={userData.name}
                                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={userData.email}
                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                value={userData.phone}
                                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="address"
                                                value={userData.address}
                                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="professional" className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="employeeId">Employee ID</Label>
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="employeeId"
                                                value={userData.employeeId}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            value={userData.department}
                                            onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="specialization">Specialization</Label>
                                        <Input
                                            id="specialization"
                                            value={userData.specialization}
                                            onChange={(e) => setUserData({ ...userData, specialization: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="license">License Number</Label>
                                        <Input
                                            id="license"
                                            value={userData.licenseNumber}
                                            onChange={(e) => setUserData({ ...userData, licenseNumber: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="joinDate">Join Date</Label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="joinDate"
                                                value={userData.joinDate}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="security" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Change Password</CardTitle>
                                        <CardDescription>
                                            Update your password to keep your account secure
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="current-password"
                                                    type="password"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                placeholder="Enter new password"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                placeholder="Confirm new password"
                                            />
                                        </div>

                                        <Button className="w-full">Update Password</Button>
                                    </CardContent>
                                </Card>

                                <Separator />

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Notification Preferences</CardTitle>
                                        <CardDescription>
                                            Manage how you receive notifications
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">Email Notifications</span>
                                            </div>
                                            <input type="checkbox" defaultChecked className="toggle" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">SMS Notifications</span>
                                            </div>
                                            <input type="checkbox" defaultChecked className="toggle" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">Push Notifications</span>
                                            </div>
                                            <input type="checkbox" className="toggle" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
