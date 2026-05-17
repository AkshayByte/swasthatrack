import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    Plus,
    Search,
    Edit,
    MapPin,
    ArrowLeft,
    Phone,
    Users,
    Bed
} from 'lucide-react';
import { useRoleHome } from '@/hooks/useRoleHome';

interface Facility {
    id: string;
    name: string;
    type: string;
    address: string;
    phone: string;
    capacity: number;
    occupied: number;
    departments: string[];
    status: 'active' | 'inactive';
}

export default function Facilities() {
    const navigate = useNavigate();
    const roleHome = useRoleHome();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);

    // Mock facilities data
    const [facilities, setFacilities] = useState<Facility[]>([
        {
            id: '1',
            name: 'Main Hospital Building',
            type: 'hospital',
            address: '123 Medical Street, Healthcare City, HC 12345',
            phone: '+91 98765 00001',
            capacity: 500,
            occupied: 342,
            departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency'],
            status: 'active'
        },
        {
            id: '2',
            name: 'Outpatient Clinic - North',
            type: 'clinic',
            address: '456 Health Avenue, Healthcare City, HC 12346',
            phone: '+91 98765 00002',
            capacity: 50,
            occupied: 28,
            departments: ['General Medicine', 'Pediatrics'],
            status: 'active'
        },
        {
            id: '3',
            name: 'Diagnostic Center',
            type: 'diagnostic',
            address: '789 Lab Road, Healthcare City, HC 12347',
            phone: '+91 98765 00003',
            capacity: 100,
            occupied: 67,
            departments: ['Radiology', 'Pathology', 'Cardiology Lab'],
            status: 'active'
        },
        {
            id: '4',
            name: 'Rehabilitation Center',
            type: 'rehab',
            address: '321 Wellness Street, Healthcare City, HC 12348',
            phone: '+91 98765 00004',
            capacity: 75,
            occupied: 45,
            departments: ['Physiotherapy', 'Occupational Therapy'],
            status: 'inactive'
        }
    ]);

    const getTypeBadgeColor = (type: string) => {
        const colors: Record<string, string> = {
            hospital: 'bg-blue-500',
            clinic: 'bg-green-500',
            diagnostic: 'bg-purple-500',
            rehab: 'bg-orange-500',
            pharmacy: 'bg-pink-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    const filteredFacilities = facilities.filter(facility => {
        const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            facility.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || facility.type === filterType;
        return matchesSearch && matchesType;
    });

    const getOccupancyPercentage = (occupied: number, capacity: number) => {
        return Math.round((occupied / capacity) * 100);
    };

    const getOccupancyColor = (percentage: number) => {
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 70) return 'text-orange-600';
        return 'text-green-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Facilities Management</h1>
                    <p className="text-muted-foreground">
                        Manage hospital locations, departments, and capacity
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(roleHome)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Dialog open={isAddFacilityOpen} onOpenChange={setIsAddFacilityOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Facility
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Facility</DialogTitle>
                                <DialogDescription>
                                    Create a new facility or location
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="facilityName">Facility Name</Label>
                                    <Input id="facilityName" placeholder="Enter facility name" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="facilityType">Type</Label>
                                    <Select>
                                        <SelectTrigger id="facilityType">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hospital">Hospital</SelectItem>
                                            <SelectItem value="clinic">Clinic</SelectItem>
                                            <SelectItem value="diagnostic">Diagnostic Center</SelectItem>
                                            <SelectItem value="rehab">Rehabilitation Center</SelectItem>
                                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="facilityAddress">Address</Label>
                                    <Input id="facilityAddress" placeholder="Enter full address" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="facilityPhone">Phone</Label>
                                    <Input id="facilityPhone" placeholder="+91 XXXXX XXXXX" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="facilityCapacity">Capacity</Label>
                                    <Input id="facilityCapacity" type="number" placeholder="Enter capacity" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddFacilityOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsAddFacilityOpen(false)}>
                                    Create Facility
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
                        <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{facilities.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {facilities.filter(f => f.status === 'active').length} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                        <Bed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {facilities.reduce((sum, f) => sum + f.capacity, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            beds/units available
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Currently Occupied</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {facilities.reduce((sum, f) => sum + f.occupied, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            beds/units in use
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(
                                (facilities.reduce((sum, f) => sum + f.occupied, 0) /
                                    facilities.reduce((sum, f) => sum + f.capacity, 0)) * 100
                            )}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            across all facilities
                        </p>
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
                                    placeholder="Search by name or address..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-[200px]">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="hospital">Hospital</SelectItem>
                                    <SelectItem value="clinic">Clinic</SelectItem>
                                    <SelectItem value="diagnostic">Diagnostic Center</SelectItem>
                                    <SelectItem value="rehab">Rehabilitation</SelectItem>
                                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Facilities List */}
            <div className="grid gap-4 md:grid-cols-2">
                {filteredFacilities.map((facility) => {
                    const occupancyPercentage = getOccupancyPercentage(facility.occupied, facility.capacity);
                    return (
                        <Card key={facility.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-lg">{facility.name}</CardTitle>
                                            <Badge variant="outline" className="capitalize">
                                                {facility.type}
                                            </Badge>
                                            <Badge variant={facility.status === 'active' ? 'default' : 'secondary'}>
                                                {facility.status}
                                            </Badge>
                                        </div>
                                        <CardDescription className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span>{facility.address}</span>
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    {facility.phone}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Occupancy</span>
                                        <span className={`font-medium ${getOccupancyColor(occupancyPercentage)}`}>
                                            {facility.occupied} / {facility.capacity} ({occupancyPercentage}%)
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${occupancyPercentage >= 90 ? 'bg-red-500' :
                                                occupancyPercentage >= 70 ? 'bg-orange-500' :
                                                    'bg-green-500'
                                                }`}
                                            style={{ width: `${occupancyPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm">Departments</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {facility.departments.map((dept, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {dept}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
