import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useRoleHome } from '@/hooks/useRoleHome';
import {
    Users as UsersIcon,
    Plus,
    Search,
    Edit,
    Trash2,
    Shield,
    ArrowLeft,
    Mail,
    Phone,
    MoreVertical
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    status: 'active' | 'inactive';
    joinDate: string;
}

export default function Users() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    // Mock users data
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            name: 'Dr. John Smith',
            email: 'john.smith@swasthatrack.com',
            phone: '+91 98765 43210',
            role: 'doctor',
            department: 'Cardiology',
            status: 'active',
            joinDate: '2024-01-15'
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.j@swasthatrack.com',
            phone: '+91 98765 43211',
            role: 'pharmacist',
            department: 'Pharmacy',
            status: 'active',
            joinDate: '2024-02-20'
        },
        {
            id: '3',
            name: 'Mike Wilson',
            email: 'mike.w@swasthatrack.com',
            phone: '+91 98765 43212',
            role: 'lab',
            department: 'Laboratory',
            status: 'active',
            joinDate: '2024-03-10'
        },
        {
            id: '4',
            name: 'Emily Brown',
            email: 'emily.b@swasthatrack.com',
            phone: '+91 98765 43213',
            role: 'registration',
            department: 'Registration',
            status: 'inactive',
            joinDate: '2023-12-05'
        }
    ]);

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            doctor: 'bg-blue-500',
            pharmacist: 'bg-purple-500',
            lab: 'bg-orange-500',
            registration: 'bg-pink-500',
            admin: 'bg-red-500',
            patient: 'bg-green-500'
        };
        return colors[role] || 'bg-gray-500';
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage user accounts and access control
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>
                                    Create a new user account with role and permissions
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="Enter full name" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="user@swasthatrack.com" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select>
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="doctor">Doctor</SelectItem>
                                            <SelectItem value="pharmacist">Pharmacist</SelectItem>
                                            <SelectItem value="lab">Lab Technician</SelectItem>
                                            <SelectItem value="registration">Registration Staff</SelectItem>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input id="department" placeholder="Enter department" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsAddUserOpen(false)}>
                                    Create User
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {users.filter(u => u.status === 'active').length} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Doctors</CardTitle>
                        <Shield className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.role === 'doctor').length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Staff</CardTitle>
                        <Shield className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => ['pharmacist', 'lab', 'registration'].includes(u.role)).length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <Shield className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.status === 'inactive').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[250px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-[200px]">
                            <Select value={filterRole} onValueChange={setFilterRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="doctor">Doctor</SelectItem>
                                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                                    <SelectItem value="lab">Lab Technician</SelectItem>
                                    <SelectItem value="registration">Registration</SelectItem>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-full ${getRoleBadgeColor(user.role)} flex items-center justify-center text-white font-semibold`}>
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <Badge variant="outline" className="capitalize">
                                                {user.role}
                                            </Badge>
                                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                                {user.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {user.phone}
                                            </div>
                                            <div>{user.department}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
